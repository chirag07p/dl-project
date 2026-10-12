"""
Deep Learning Models for Personalized AI Learning.
Implements Deep Knowledge Tracing (DKT) with LSTM and multi-feature telemetry embeddings.
"""
from .dkt_lstm import DKT_LSTM
from .knowledge_profile import KnowledgeProfiler
from .weakness_detector import WeaknessDetector
from .forgetting_detector import ForgettingDetector
from .learning_style import LearningStyleDetector

__all__ = [
    "DKT_LSTM",
    "KnowledgeProfiler",
    "WeaknessDetector",
    "ForgettingDetector",
    "LearningStyleDetector",
]
