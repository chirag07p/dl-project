"""
Trains the Deep Knowledge Tracing (DKT) LSTM model directly on the real CogniPath CS-DKT dataset (data/psv/cognipath_cs_dkt.psv).
Features tracked: user_id, topic_id, is_correct, time_taken_sec, hints_used, attempts_count.
Supports:
  - Dynamically updating training data by syncing live student sessions.
  - Continual / incremental fine-tuning without reinitializing from scratch.
"""
import argparse
import csv
import json
import os
import random
from collections import defaultdict
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.metrics import roc_auc_score, accuracy_score

from models.dkt_lstm import DKT_LSTM


def set_seed(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)


class CogniPathDataset(Dataset):
    def __init__(self, student_sequences, topic_to_idx, max_seq_len: int = 50):
        self.samples = []
        for seq in student_sequences:
            if len(seq) < 2:
                continue
            seq = seq[:max_seq_len]
            concepts = [topic_to_idx.get(row["topic_id"], 0) for row in seq]
            correctness = [int(row["is_correct"]) for row in seq]
            times = [float(row["time_taken_sec"]) for row in seq]
            attempts = [float(row["attempts_count"]) for row in seq]
            elapsed = [1.0] * len(seq)

            self.samples.append({
                "concepts": torch.tensor(concepts, dtype=torch.long),
                "correctness": torch.tensor(correctness, dtype=torch.long),
                "times": torch.tensor(times, dtype=torch.float32),
                "attempts": torch.tensor(attempts, dtype=torch.float32),
                "elapsed": torch.tensor(elapsed, dtype=torch.float32),
                "length": len(concepts),
            })

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        return self.samples[idx]


def collate_cognipath_batch(batch):
    max_len = max(item["length"] for item in batch)
    B = len(batch)

    concepts = torch.zeros(B, max_len, dtype=torch.long)
    correctness = torch.zeros(B, max_len, dtype=torch.long)
    times = torch.zeros(B, max_len, dtype=torch.float32)
    attempts = torch.zeros(B, max_len, dtype=torch.float32)
    elapsed = torch.zeros(B, max_len, dtype=torch.float32)
    mask = torch.zeros(B, max_len, dtype=torch.bool)

    for i, item in enumerate(batch):
        L = item["length"]
        concepts[i, :L] = item["concepts"]
        correctness[i, :L] = item["correctness"]
        times[i, :L] = item["times"]
        attempts[i, :L] = item["attempts"]
        elapsed[i, :L] = item["elapsed"]
        mask[i, :L] = True

    return {
        "concepts": concepts,
        "correctness": correctness,
        "times": times,
        "attempts": attempts,
        "elapsed": elapsed,
        "mask": mask,
    }


def sync_student_sessions_to_psv(
    psv_path: str = "data/psv/cognipath_cs_dkt.psv",
    session_files: list = None,
) -> int:
    """
    Scans live student interaction stores and dynamically appends
    any unrecorded interactions directly into the training PSV file.
    """
    if session_files is None:
        session_files = [
            "data/demo_students.json",
            "data/student_store.json",
            "data/web_students.json",
        ]

    if not os.path.exists(psv_path):
        return 0

    # Read existing lines to avoid duplicates
    existing_records = set()
    with open(psv_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="|")
        header = next(reader, None)
        for row in reader:
            if len(row) >= 6:
                existing_records.add((row[0], row[1], row[2], row[3], row[5]))

    new_rows = []
    for s_file in session_files:
        if os.path.exists(s_file):
            try:
                with open(s_file, "r", encoding="utf-8") as f:
                    store = json.load(f)
                    for sid, sdata in store.items():
                        for inter in sdata.get("interactions", []):
                            key = (
                                str(sid),
                                str(inter.get("topic_id", "arrays")),
                                str(int(inter.get("correct", 1))),
                                str(int(float(inter.get("time_taken", 300)))),
                                str(int(float(inter.get("attempts", 1)))),
                            )
                            if key not in existing_records:
                                new_rows.append([
                                    key[0], key[1], key[2], key[3], "0", key[4]
                                ])
                                existing_records.add(key)
            except Exception as e:
                pass

    if new_rows:
        with open(psv_path, "a", encoding="utf-8", newline="") as f:
            writer = csv.writer(f, delimiter="|")
            writer.writerows(new_rows)
        print(f"[DATASET DYNAMIC UPDATE]: Added {len(new_rows)} new live interaction(s) to {psv_path}!", flush=True)

    return len(new_rows)


def load_cognipath_sequences(psv_path: str = "data/psv/cognipath_cs_dkt.psv"):
    student_records = defaultdict(list)
    with open(psv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="|")
        for row in reader:
            student_records[row["user_id"]].append(row)
    return list(student_records.values())


def train_model(
    psv_path: str = "data/psv/cognipath_cs_dkt.psv",
    taxonomy_path: str = "data/dsa_taxonomy.json",
    epochs: int = 15,
    batch_size: int = 16,
    lr: float = 0.003,
    hidden_dim: int = 64,
    incremental: bool = False,
    sync_sessions: bool = True,
    output_dir: str = "weights",
    device: str = "cpu",
):
    set_seed(42)
    os.makedirs(output_dir, exist_ok=True)
    weights_path = os.path.join(output_dir, "dkt_lstm.pt")
    history_path = os.path.join(output_dir, "training_history_cognipath.json")

    # 1. Dynamically sync new student session interactions
    if sync_sessions:
        sync_student_sessions_to_psv(psv_path)

    # 2. Load curriculum taxonomy
    with open(taxonomy_path, "r", encoding="utf-8") as f:
        taxonomy = json.load(f)

    topics = [t["id"] for t in taxonomy["topics"]]
    num_concepts = len(topics)
    topic_to_idx = {tid: i for i, tid in enumerate(topics)}

    print("==================================================================", flush=True)
    if incremental and os.path.exists(weights_path):
        print("  CONTINUAL FINE-TUNING ON UPDATED COGNIPATH CS-DKT (PSV)", flush=True)
    else:
        print("  TRAINING DKT LSTM ON REAL COGNIPATH CS-DKT BENCHMARK (PSV)", flush=True)
    print("==================================================================", flush=True)
    print(f"Dataset path: {psv_path}", flush=True)
    print(f"CS Curriculum Topics: {topics} ({num_concepts} skills)", flush=True)

    student_sequences = load_cognipath_sequences(psv_path)
    total_interactions = sum(len(seq) for seq in student_sequences)
    print(f"Total Student Learning Sequences: {len(student_sequences)} ({total_interactions} total interactions)", flush=True)

    random.shuffle(student_sequences)
    split_idx = int(0.8 * len(student_sequences))
    train_seqs = student_sequences[:split_idx]
    val_seqs = student_sequences[split_idx:]

    train_ds = CogniPathDataset(train_seqs, topic_to_idx, max_seq_len=50)
    val_ds = CogniPathDataset(val_seqs, topic_to_idx, max_seq_len=50)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, collate_fn=collate_cognipath_batch)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, collate_fn=collate_cognipath_batch)

    # 3. Initialize or Load existing model for Continual Learning
    if incremental and os.path.exists(weights_path):
        print(f"[CONTINUAL LEARNING]: Loading existing checkpoint from {weights_path} to fine-tune on newly updated data.", flush=True)
        model = DKT_LSTM.load_weights(weights_path, device=device)
        effective_lr = lr * 0.5  # lower learning rate for stable continual fine-tuning
    else:
        model = DKT_LSTM(
            num_concepts=num_concepts,
            concept_embed_dim=32,
            correctness_embed_dim=16,
            continuous_feature_dim=16,
            hidden_dim=hidden_dim,
            num_layers=2,
            dropout=0.2,
        ).to(device)
        effective_lr = lr

    optimizer = torch.optim.AdamW(model.parameters(), lr=effective_lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-4)

    best_val_auc = 0.0
    history = []
    if incremental and os.path.exists(history_path):
        try:
            with open(history_path, "r", encoding="utf-8") as f:
                history = json.load(f)
        except Exception:
            history = []

    start_epoch = len(history) if (incremental and history) else 0

    for epoch in range(1, epochs + 1):
        actual_epoch = start_epoch + epoch
        model.train()
        train_loss = 0.0
        train_batches = 0

        for batch in train_loader:
            concepts = batch["concepts"].to(device)
            correctness = batch["correctness"].to(device)
            times = batch["times"].to(device)
            attempts = batch["attempts"].to(device)
            elapsed = batch["elapsed"].to(device)
            mask = batch["mask"].to(device)

            if concepts.size(1) < 2:
                continue

            optimizer.zero_grad()
            c_in = concepts[:, :-1]
            y_in = correctness[:, :-1]
            t_in = times[:, :-1]
            a_in = attempts[:, :-1]
            e_in = elapsed[:, :-1]

            target_c = concepts[:, 1:]
            target_y = correctness[:, 1:]
            target_m = mask[:, 1:]

            logits, _ = model(c_in, y_in, t_in, a_in, e_in)
            loss = model.compute_loss(logits, target_c, target_y, mask=target_m)

            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), max_norm=2.0)
            optimizer.step()

            train_loss += loss.item()
            train_batches += 1

        scheduler.step()
        avg_train_loss = train_loss / max(1, train_batches)

        # Validation
        model.eval()
        val_loss = 0.0
        val_batches = 0
        all_preds, all_targs = [], []

        with torch.no_grad():
            for batch in val_loader:
                concepts = batch["concepts"].to(device)
                correctness = batch["correctness"].to(device)
                times = batch["times"].to(device)
                attempts = batch["attempts"].to(device)
                elapsed = batch["elapsed"].to(device)
                mask = batch["mask"].to(device)

                if concepts.size(1) < 2:
                    continue

                c_in = concepts[:, :-1]
                y_in = correctness[:, :-1]
                t_in = times[:, :-1]
                a_in = attempts[:, :-1]
                e_in = elapsed[:, :-1]

                target_c = concepts[:, 1:]
                target_y = correctness[:, 1:]
                target_m = mask[:, 1:]

                logits, _ = model(c_in, y_in, t_in, a_in, e_in)
                loss = model.compute_loss(logits, target_c, target_y, mask=target_m)

                val_loss += loss.item()
                val_batches += 1

                gathered_logits = logits.gather(dim=-1, index=target_c.unsqueeze(-1)).squeeze(-1)
                probs = torch.sigmoid(gathered_logits)

                for b in range(concepts.size(0)):
                    v_len = target_m[b].sum().item()
                    if v_len > 0:
                        all_preds.extend(probs[b, :v_len].cpu().numpy().tolist())
                        all_targs.extend(target_y[b, :v_len].cpu().numpy().tolist())

        avg_val_loss = val_loss / max(1, val_batches)
        try:
            val_auc = float(roc_auc_score(all_targs, all_preds))
        except Exception:
            val_auc = 0.5
        val_acc = float(accuracy_score(all_targs, [1 if p >= 0.5 else 0 for p in all_preds]))

        print(
            f"Epoch {actual_epoch:02d} | "
            f"Train Loss: {avg_train_loss:.4f} | "
            f"Val Loss: {avg_val_loss:.4f} | "
            f"Val AUC: {val_auc:.4f} | "
            f"Val Acc: {val_acc*100:.2f}%",
            flush=True,
        )

        history.append({
            "epoch": actual_epoch,
            "train_loss": round(avg_train_loss, 4),
            "val_loss": round(avg_val_loss, 4),
            "val_auc": round(val_auc, 4),
            "val_acc": round(val_acc, 4),
        })

        if val_auc > best_val_auc or epoch == epochs:
            best_val_auc = val_auc
            model.save_weights(weights_path)
            print(f"  -> Model checkpoint updated at {weights_path} (AUC: {val_auc:.4f})", flush=True)

    # Save history to both history files
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)
    with open(os.path.join(output_dir, "training_history.json"), "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

    print(f"\n[DONE] Training complete on dynamically updated dataset ({total_interactions} interactions)!", flush=True)
    return weights_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train DKT LSTM on dynamically updating PSV dataset.")
    parser.add_argument("--epochs", "-e", type=int, default=10, help="Number of epochs to train")
    parser.add_argument("--incremental", "-i", action="store_true", help="Continual learning from existing weights")
    parser.add_argument("--no-sync", action="store_true", help="Do not sync live student sessions to PSV")
    parser.add_argument("--psv", type=str, default="data/psv/cognipath_cs_dkt.psv", help="Path to training PSV file")
    args = parser.parse_args()

    train_model(
        psv_path=args.psv,
        epochs=args.epochs,
        incremental=args.incremental,
        sync_sessions=not args.no_sync,
    )
