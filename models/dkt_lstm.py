import math
from typing import Dict, List, Optional, Tuple
import torch
import torch.nn as nn
import torch.nn.functional as F


class DKT_LSTM(nn.Module):
    """
    LSTM-based Deep Knowledge Tracing (DKT) model with multi-feature telemetry inputs.
    
    Inputs per interaction step t:
        - concept_id: topic / knowledge concept index in [0, num_concepts - 1]
        - correctness: 1 if student solved correctly, 0 if failed
        - time_taken: time in seconds spent on the problem
        - attempts: number of tries before final submission
        - elapsed_days: days elapsed since last practice interaction
        
    Outputs:
        - Hidden state h_t representing the student's dynamic latent knowledge profile
        - Predicted mastery probability distribution over all concepts at step t+1: P(C_j = 1 | h_t)
    """

    def __init__(
        self,
        num_concepts: int,
        concept_embed_dim: int = 32,
        correctness_embed_dim: int = 16,
        continuous_feature_dim: int = 16,
        hidden_dim: int = 64,
        num_layers: int = 2,
        dropout: float = 0.2,
    ):
        super().__init__()
        self.num_concepts = num_concepts
        self.concept_embed_dim = concept_embed_dim
        self.correctness_embed_dim = correctness_embed_dim
        self.continuous_feature_dim = continuous_feature_dim
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers

        # Concept index embedding
        self.concept_embedding = nn.Embedding(num_concepts, concept_embed_dim)

        # Correctness outcome embedding (0 or 1)
        self.correctness_embedding = nn.Embedding(2, correctness_embed_dim)

        # Multi-feature telemetry projection: [log(1+time), log(1+attempts), log(1+elapsed_days)]
        self.telemetry_encoder = nn.Sequential(
            nn.Linear(3, continuous_feature_dim),
            nn.SiLU(),
            nn.Linear(continuous_feature_dim, continuous_feature_dim),
        )

        input_dim = concept_embed_dim + correctness_embed_dim + continuous_feature_dim
        self.input_norm = nn.LayerNorm(input_dim)
        self.input_dropout = nn.Dropout(dropout)

        # Recurrent core: Multi-layer LSTM
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0,
        )

        # Knowledge State Decoder / Prediction Head
        # Predicts logits for each concept being answered correctly at next step
        self.prediction_head = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, num_concepts),
        )

    def _prepare_continuous_features(
        self,
        time_taken: torch.Tensor,
        attempts: torch.Tensor,
        elapsed_days: torch.Tensor,
    ) -> torch.Tensor:
        """
        Log-transforms and scales continuous metrics to maintain numeric stability.
        """
        # Clamp negative values if any
        time_safe = torch.clamp(time_taken, min=0.0)
        attempts_safe = torch.clamp(attempts, min=1.0)
        elapsed_safe = torch.clamp(elapsed_days, min=0.0)

        log_time = torch.log1p(time_safe / 60.0)      # minutes scale
        log_attempts = torch.log1p(attempts_safe)      # count scale
        log_elapsed = torch.log1p(elapsed_safe)        # days scale

        feats = torch.stack([log_time, log_attempts, log_elapsed], dim=-1)
        return self.telemetry_encoder(feats)

    def forward(
        self,
        concept_seq: torch.Tensor,
        correctness_seq: torch.Tensor,
        time_seq: torch.Tensor,
        attempts_seq: torch.Tensor,
        elapsed_seq: torch.Tensor,
        hidden_state: Optional[Tuple[torch.Tensor, torch.Tensor]] = None,
    ) -> Tuple[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]]:
        """
        Args:
            concept_seq: (B, L) LongTensor of concept IDs
            correctness_seq: (B, L) LongTensor of 0 or 1
            time_seq: (B, L) FloatTensor of response times in seconds
            attempts_seq: (B, L) FloatTensor of attempt counts
            elapsed_seq: (B, L) FloatTensor of days since last practice
            hidden_state: Optional initial (h_0, c_0) for the LSTM

        Returns:
            logits: (B, L, num_concepts) Raw logits for all concepts at each step
            (h_n, c_n): Final LSTM hidden and cell states
        """
        # 1. Embed discrete features
        concept_emb = self.concept_embedding(concept_seq)
        correctness_emb = self.correctness_embedding(correctness_seq)

        # 2. Project continuous telemetry
        telemetry_emb = self._prepare_continuous_features(time_seq, attempts_seq, elapsed_seq)

        # 3. Fuse representations
        x = torch.cat([concept_emb, correctness_emb, telemetry_emb], dim=-1)
        x = self.input_norm(x)
        x = self.input_dropout(x)

        # 4. Process sequence with LSTM
        lstm_out, next_hidden = self.lstm(x, hidden_state)

        # 5. Project hidden states to concept prediction logits
        logits = self.prediction_head(lstm_out)
        return logits, next_hidden

    def compute_loss(
        self,
        logits: torch.Tensor,
        target_concept_seq: torch.Tensor,
        target_correctness_seq: torch.Tensor,
        mask: Optional[torch.Tensor] = None,
    ) -> torch.Tensor:
        """
        Computes masked Binary Cross Entropy loss for next-item prediction.
        
        Args:
            logits: (B, L-1, num_concepts) Predictions from step 0 to L-2
            target_concept_seq: (B, L-1) Next concepts (step 1 to L-1)
            target_correctness_seq: (B, L-1) Next correctness labels (0 or 1)
            mask: (B, L-1) 1 for real interactions, 0 for padded steps
        """
        # Gather predicted logits for the specific target concept at step t+1
        # target_concept_seq unsqueezed: (B, L-1, 1)
        gathered_logits = logits.gather(dim=-1, index=target_concept_seq.unsqueeze(-1)).squeeze(-1)
        
        targets = target_correctness_seq.float()
        loss = F.binary_cross_entropy_with_logits(gathered_logits, targets, reduction='none')

        if mask is not None:
            loss = (loss * mask.float()).sum() / (mask.float().sum() + 1e-8)
        else:
            loss = loss.mean()
        return loss

    @torch.no_grad()
    def predict_current_mastery(
        self,
        concept_seq: torch.Tensor,
        correctness_seq: torch.Tensor,
        time_seq: torch.Tensor,
        attempts_seq: torch.Tensor,
        elapsed_seq: torch.Tensor,
    ) -> torch.Tensor:
        """
        Predicts current topic mastery probabilities [0, 1] for all concepts
        after observing the full history sequence.

        Returns:
            mastery_vector: (B, num_concepts) tensor in [0.0, 1.0]
        """
        self.eval()
        logits, _ = self.forward(
            concept_seq,
            correctness_seq,
            time_seq,
            attempts_seq,
            elapsed_seq,
        )
        # Take the final time step's prediction
        last_step_logits = logits[:, -1, :]
        probs = torch.sigmoid(last_step_logits)
        return probs

    def save_weights(self, path: str):
        torch.save({
            "state_dict": self.state_dict(),
            "config": {
                "num_concepts": self.num_concepts,
                "concept_embed_dim": self.concept_embed_dim,
                "correctness_embed_dim": self.correctness_embed_dim,
                "continuous_feature_dim": self.continuous_feature_dim,
                "hidden_dim": self.hidden_dim,
                "num_layers": self.num_layers,
            }
        }, path)

    @classmethod
    def load_weights(cls, path: str, device: str = "cpu") -> "DKT_LSTM":
        checkpoint = torch.load(path, map_location=device)
        model = cls(**checkpoint["config"])
        model.load_state_dict(checkpoint["state_dict"])
        model.to(device)
        model.eval()
        return model
