/**
 * API Client Service connecting the React frontend to the CogniPath AI Python Backend.
 * Communicates with the PyTorch DKT LSTM engine, diagnostic profilers, and personalized recommender.
 */

import { cleanMarkdownSymbols } from './tutorKnowledge';

const CUSTOM_BASE = import.meta.env.VITE_API_URL;

async function fetchApi(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (CUSTOM_BASE) {
    return await fetch(`${CUSTOM_BASE}${path}`, { ...options, headers });
  }
  try {
    // 1. Try Vite local proxy path
    const res = await fetch(`/api${path}`, { ...options, headers });
    if (res.ok) return res;
  } catch {
    // Ignore proxy error and fallback to direct port 5000
  }
  // 2. Direct localhost:5000
  return await fetch(`http://localhost:5000/api${path}`, { ...options, headers });
}

export interface BackendHealthResponse {
  status: string;
  engine_ready: boolean;
  model_architecture: string;
  topics_supported: string[];
  weights_loaded: boolean;
}

export interface TopicMasteryDetail {
  topic_id: string;
  topic_name: string;
  mastery_score: number;
  mastery_level: string;
  question_count: number;
  correct_count: number;
  accuracy_rate: number;
  confidence: string;
  last_practiced_days_ago?: number;
}

export interface DktProfile {
  student_id: string;
  overall_mastery: number;
  overall_accuracy: number;
  total_questions_solved: number;
  current_day: number;
  topic_masteries: Record<string, TopicMasteryDetail>;
}

export interface WeaknessItem {
  topic_id: string;
  topic_name: string;
  mastery: number;
  severity: string;
  reason: string;
  weak_prerequisites: string[];
  suggested_action: string;
}

export interface ForgettingAlertItem {
  topic_id: string;
  topic_name: string;
  current_retention_rate: number;
  days_since_practice: number;
  risk_level: string;
  recommended_action: string;
}

export interface LearningStyleDetail {
  primary_style: string;
  pace_description: string;
  attempt_behavior: string;
  pedagogical_guidance: string;
  style_scores: Record<string, number>;
}

export interface RecommendationDetail {
  recommended_topic_id: string;
  recommended_topic_name: string;
  recommended_difficulty: string;
  reasoning: string;
  suggested_questions: Array<{
    question_id: string;
    topic_id: string;
    title: string;
    difficulty: string;
    description: string;
    tags: string[];
  }>;
  revision_plan: Array<{
    topic_id: string;
    topic_name: string;
    recommended_difficulty: string;
    priority: string;
    urgency_reason: string;
  }>;
}

export interface StudentFullPipelineResponse {
  student_id: string;
  student_name: string;
  current_day: number;
  profile: DktProfile;
  weaknesses: WeaknessItem[];
  forgetting_alerts: ForgettingAlertItem[];
  learning_style: LearningStyleDetail;
  recommendation: RecommendationDetail;
}

export interface SubmitInteractionPayload {
  student_id: string;
  question_id: string;
  topic: string;
  is_correct: boolean;
  time_taken_seconds: number;
  attempts?: number;
  days_advanced?: number;
}

export interface SubmitInteractionResponse {
  success: boolean;
  new_topic_mastery: number;
  overall_mastery: number;
  topic: string;
  backend_topic: string;
  profile: DktProfile;
  weaknesses: WeaknessItem[];
  forgetting_alerts: ForgettingAlertItem[];
  learning_style: LearningStyleDetail;
  recommendation: RecommendationDetail;
}

export interface AskAiPayload {
  student_id: string;
  query: string;
  topic?: string;
  question_title?: string;
  code_snippet?: string;
  is_correct?: boolean;
}

export interface AskAiResponse {
  success: boolean;
  query: string;
  topic: string;
  topic_mastery: number;
  mastery_level: string;
  answer: string;
  primary_style: string;
}

export const apiClient = {
  /**
   * Pings the backend to check if the Python Flask server & PyTorch DKT model are active.
   */
  async checkHealth(): Promise<BackendHealthResponse | null> {
    try {
      const res = await fetchApi('/health', { method: 'GET' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Fetches the student's live DKT knowledge profile, weaknesses, and recommendations.
   */
  async getStudentProfile(studentId: string): Promise<StudentFullPipelineResponse | null> {
    try {
      const res = await fetchApi(`/student/${encodeURIComponent(studentId)}`, { method: 'GET' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Sends an answered question interaction to the backend.
   * Dynamically triggers the PyTorch LSTM forward pass to update mastery probabilities.
   */
  async submitInteraction(
    payload: SubmitInteractionPayload
  ): Promise<SubmitInteractionResponse | null> {
    try {
      const res = await fetchApi('/interact', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Sends a user query or explanation request to the backend AI Tutor.
   * Returns tailored pedagogical guidance computed from the student's DKT knowledge state.
   */
  async askAiTutor(payload: AskAiPayload): Promise<AskAiResponse | null> {
    try {
      const res = await fetchApi('/ask', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const data: AskAiResponse = await res.json();
      if (data && data.answer) {
        data.answer = cleanMarkdownSymbols(data.answer);
      }
      return data;
    } catch {
      return null;
    }
  },

  /**
   * Resets the student interaction store on the backend.
   */
  async resetDemo(): Promise<boolean> {
    try {
      const res = await fetchApi('/reset-demo', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  },
};

