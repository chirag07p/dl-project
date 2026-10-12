"""
Evaluation script for DKT LSTM model on the CogniPath CS-DKT dataset (data/psv/cognipath_cs_dkt.psv).
Calculates ROC-AUC, Accuracy, Precision, Recall, F1, and topic-wise breakdowns.
"""
import csv
import json
import os
from collections import defaultdict
import numpy as np
import torch
from sklearn.metrics import (
    roc_auc_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    brier_score_loss,
)
from torch.utils.data import DataLoader

from models.dkt_lstm import DKT_LSTM
from train import CogniPathDataset, collate_cognipath_batch, load_cognipath_sequences


def evaluate_model(
    taxonomy_path: str = "data/dsa_taxonomy.json",
    psv_path: str = "data/psv/cognipath_cs_dkt.psv",
    weights_path: str = "weights/dkt_lstm.pt",
    device: str = "cpu",
):
    print("==================================================================", flush=True)
    print("  EVALUATING DKT LSTM ON REAL COGNIPATH CS-DKT BENCHMARK", flush=True)
    print("==================================================================", flush=True)

    with open(taxonomy_path, "r", encoding="utf-8") as f:
        taxonomy = json.load(f)

    topics = [t["id"] for t in taxonomy["topics"]]
    topic_names = {t["id"]: t["name"] for t in taxonomy["topics"]}
    topic_to_idx = {tid: i for i, tid in enumerate(topics)}
    idx_to_topic = {i: tid for i, tid in enumerate(topics)}

    model = DKT_LSTM.load_weights(weights_path, device=device)
    model.eval()

    student_sequences = load_cognipath_sequences(psv_path)
    test_ds = CogniPathDataset(student_sequences, topic_to_idx, max_seq_len=50)
    test_loader = DataLoader(test_ds, batch_size=32, shuffle=False, collate_fn=collate_cognipath_batch)

    all_preds, all_targets = [], []
    topic_preds = defaultdict(list)
    topic_targets = defaultdict(list)

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

            target_concepts = concepts[:, 1:]
            target_correctness = correctness[:, 1:]
            target_mask = mask[:, 1:]

            logits, _ = model(c_in, y_in, t_in, a_in, e_in)
            gathered_logits = logits.gather(dim=-1, index=target_concepts.unsqueeze(-1)).squeeze(-1)
            probs = torch.sigmoid(gathered_logits)

            for b in range(concepts.size(0)):
                valid_len = target_mask[b].sum().item()
                if valid_len > 0:
                    p_seq = probs[b, :valid_len].cpu().numpy().tolist()
                    t_seq = target_correctness[b, :valid_len].cpu().numpy().tolist()
                    c_seq = target_concepts[b, :valid_len].cpu().numpy().tolist()

                    all_preds.extend(p_seq)
                    all_targets.extend(t_seq)

                    for p, t_val, c_idx in zip(p_seq, t_seq, c_seq):
                        t_name = idx_to_topic[c_idx]
                        topic_preds[t_name].append(p)
                        topic_targets[t_name].append(t_val)

    auc = roc_auc_score(all_targets, all_preds)
    pred_bin = [1 if p >= 0.5 else 0 for p in all_preds]
    acc = accuracy_score(all_targets, pred_bin)
    prec = precision_score(all_targets, pred_bin, zero_division=0)
    rec = recall_score(all_targets, pred_bin, zero_division=0)
    f1 = f1_score(all_targets, pred_bin, zero_division=0)
    brier = brier_score_loss(all_targets, all_preds)

    print("\n--- Overall Evaluation Metrics on CogniPath CS-DKT ---", flush=True)
    print(f"Total Next-Step Predictions: {len(all_targets)}", flush=True)
    print(f"ROC-AUC Score:      {auc:.4f}", flush=True)
    print(f"Accuracy:           {acc*100:.2f}%", flush=True)
    print(f"Precision:          {prec:.4f}", flush=True)
    print(f"Recall:             {rec:.4f}", flush=True)
    print(f"F1-Score:           {f1:.4f}", flush=True)
    print(f"Brier Calibration:  {brier:.4f} (lower is better)", flush=True)

    print("\n--- CS Skill Breakdown ---", flush=True)
    print(f"{'Topic ID':<15} | {'Samples':<7} | {'Accuracy':<9} | {'AUC':<7}", flush=True)
    print("-" * 45, flush=True)
    for tid in topics:
        t_targs = topic_targets[tid]
        t_preds = topic_preds[tid]
        if len(t_targs) >= 5 and len(set(t_targs)) > 1:
            t_acc = accuracy_score(t_targs, [1 if p >= 0.5 else 0 for p in t_preds])
            try:
                t_auc = roc_auc_score(t_targs, t_preds)
                auc_str = f"{t_auc:.4f}"
            except Exception:
                auc_str = "N/A"
            print(f"{tid:<15} | {len(t_targs):<7} | {t_acc*100:<8.1f}% | {auc_str}", flush=True)
        else:
            print(f"{tid:<15} | {len(t_targs):<7} | {'N/A':<9} | {'N/A'}", flush=True)

    return {"auc": auc, "accuracy": acc, "f1": f1}


if __name__ == "__main__":
    evaluate_model()
