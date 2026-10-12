"""
Trains Deep Knowledge Tracing (DKT) LSTM on the REAL-WORLD ASSISTments 2009-2010 Benchmark Dataset.
Dataset source: ASSISTments / Worcester Polytechnic Institute (WPI) & EduData Benchmark.
Contains: 3,025 real students, 372,928 real problem interactions across 123 skills.
"""
import json
import os
import random
import sys
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


class RealASSISTmentsDataset(Dataset):
    def __init__(self, json_path: str, max_seq_len: int = 80):
        self.samples = []
        with open(json_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                seq = json.loads(line)
                if len(seq) < 3:
                    continue
                seq = seq[:max_seq_len]
                concepts = [int(step[0]) for step in seq]
                correctness = [int(step[1]) for step in seq]

                times = [300.0] * len(seq)
                attempts = [1.0] * len(seq)
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


def collate_real_batch(batch):
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


def train_real(
    train_path: str = "data/real_data/assistment_2009_2010/train.json",
    val_path: str = "data/real_data/assistment_2009_2010/valid.json",
    test_path: str = "data/real_data/assistment_2009_2010/test.json",
    epochs: int = 10,
    batch_size: int = 64,
    lr: float = 0.003,
    output_dir: str = "weights",
    device: str = "cpu",
):
    set_seed(42)
    os.makedirs(output_dir, exist_ok=True)
    weights_path = os.path.join(output_dir, "dkt_real_assist2009.pt")

    print("==================================================================", flush=True)
    print("  TRAINING DKT LSTM ON REAL-WORLD ASSISTments 2009-2010 DATASET", flush=True)
    print("==================================================================", flush=True)
    print(f"Source: Worcester Polytechnic Institute (WPI) & EduData Benchmark", flush=True)
    print(f"Dataset location: data/real_data/assistment_2009_2010/", flush=True)

    train_ds = RealASSISTmentsDataset(train_path, max_seq_len=80)
    val_ds = RealASSISTmentsDataset(val_path, max_seq_len=80)
    test_ds = RealASSISTmentsDataset(test_path, max_seq_len=80)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, collate_fn=collate_real_batch)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, collate_fn=collate_real_batch)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False, collate_fn=collate_real_batch)

    num_concepts = 124  # skill IDs 0 to 123
    print(f"Loaded Real Students: Train={len(train_ds)}, Val={len(val_ds)}, Test={len(test_ds)}", flush=True)
    print(f"Total Unique Skills: {num_concepts}", flush=True)

    model = DKT_LSTM(
        num_concepts=num_concepts,
        concept_embed_dim=48,
        correctness_embed_dim=16,
        continuous_feature_dim=16,
        hidden_dim=64,
        num_layers=1,
        dropout=0.2,
    ).to(device)

    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-4)

    best_val_auc = 0.0
    history = []

    for epoch in range(1, epochs + 1):
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

        # Validation evaluation
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

        history.append({
            "epoch": epoch,
            "train_loss": round(avg_train_loss, 4),
            "val_loss": round(avg_val_loss, 4),
            "val_auc": round(val_auc, 4),
            "val_acc": round(val_acc, 4),
        })

        print(
            f"Epoch {epoch:02d}/{epochs:02d} | "
            f"Train Loss: {avg_train_loss:.4f} | "
            f"Val Loss: {avg_val_loss:.4f} | "
            f"Val AUC: {val_auc:.4f} | "
            f"Val Acc: {val_acc*100:.2f}%",
            flush=True,
        )

        if val_auc > best_val_auc or epoch == epochs:
            best_val_auc = val_auc
            model.save_weights(weights_path)
            print(f"  -> Saved best model checkpoint to {weights_path} (AUC: {val_auc:.4f})", flush=True)

    # Save training history
    history_path = os.path.join(output_dir, "training_history_assistments.json")
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

    # Final test evaluation on real unseen students
    print("\n------------------------------------------------------------------", flush=True)
    print("  FINAL EVALUATION ON UNSEEN REAL TEST STUDENTS (test.json)", flush=True)
    print("------------------------------------------------------------------", flush=True)
    best_model = DKT_LSTM.load_weights(weights_path, device=device)
    best_model.eval()
    test_preds, test_targs = [], []

    with torch.no_grad():
        for batch in test_loader:
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

            logits, _ = best_model(c_in, y_in, t_in, a_in, e_in)
            gathered_logits = logits.gather(dim=-1, index=target_c.unsqueeze(-1)).squeeze(-1)
            probs = torch.sigmoid(gathered_logits)

            for b in range(concepts.size(0)):
                v_len = target_m[b].sum().item()
                if v_len > 0:
                    test_preds.extend(probs[b, :v_len].cpu().numpy().tolist())
                    test_targs.extend(target_y[b, :v_len].cpu().numpy().tolist())

    test_auc = float(roc_auc_score(test_targs, test_preds))
    test_acc = float(accuracy_score(test_targs, [1 if p >= 0.5 else 0 for p in test_preds]))

    print(f"Total Real Test Interactions Evaluated: {len(test_targs)}", flush=True)
    print(f"Real Test ROC-AUC: {test_auc:.4f}", flush=True)
    print(f"Real Test Accuracy: {test_acc*100:.2f}%", flush=True)
    print(f"Real Model Weights Saved at: {weights_path}", flush=True)
    print("==================================================================", flush=True)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Train DKT LSTM on ASSISTments 2009-2010 real dataset.")
    parser.add_argument("--epochs", "-e", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--batch_size", "-b", type=int, default=128, help="Batch size")
    parser.add_argument("--lr", type=float, default=0.003, help="Learning rate")
    args = parser.parse_args()

    train_real(epochs=args.epochs, batch_size=args.batch_size, lr=args.lr)
