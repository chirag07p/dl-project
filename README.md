# 🧠 Personalized AI Learning System (Deep Knowledge Tracing)

A state-of-the-art Deep Learning system for personalized Computer Science (DSA) and cognitive knowledge tracing, built with **PyTorch (LSTM-based Deep Knowledge Tracing)**, cognitive diagnostics (Weakness, Ebbinghaus Forgetting, and Learning Style Detection), and adaptive recommendation.

---

## 📊 Dataset Comparison Table

All benchmark datasets are extracted, formatted, and saved as **Pipe-Separated Values (`.psv`)** in the [`data/psv/`](file:///c:/Users/Chirag%20Pradhan/dl%20model/data/psv/) directory.

| Dataset Name | Domain & Scope | Interactions | Skill Tags | Key Features Tracked |
| :--- | :--- | :---: | :---: | :--- |
| **CogniPath CS-DKT** | CS (Arrays, Strings, Recursion, Trees, Graphs, DP) | 1,420 | 6 | `user_id`, `topic_id`, `is_correct`, `time_taken_sec`, `hints_used`, `attempts_count` |
| **ASSISTments 2009-2010** | K-12 Math Skill Builder | 525,534 | 123 | `user_id`, `skill_id`, `correct`, `hint_count`, `ms_first_response` |
| **EdNet Dataset (Riiid)** | AI Test Prep & Tutoring | 131,441,538 | 188 | `solving_id`, `elapsed_time`, `user_answer`, `explanation_read` |
| **KDD Cup 2010** | Algebra & Bridge to Algebra | 8,918,054 | 112 | `Student Id`, `Problem Name`, `Step Name`, `Incorrects`, `Hints` |
| **Statics2011 (CMU)** | Engineering Statics | 189,297 | 84 | `Student ID`, `Problem Name`, `CF Attempt`, `Duration` |

---

## 📁 Extracted PSV Files (`data/psv/`)

All dummy/synthetic datasets have been completely removed. This deep learning system operates directly on the extracted PSV files:

### 1. `cognipath_cs_dkt.psv` (Primary CS/DSA Dataset)
* **File Path**: [`data/psv/cognipath_cs_dkt.psv`](file:///c:/Users/Chirag%20Pradhan/dl%20model/data/psv/cognipath_cs_dkt.psv)
* **Domain**: Computer Science & Data Structures (Arrays, Strings, Recursion, Trees, Graphs, DP).
* **Interactions**: **1,420** interaction steps across **6 core CS topics**.
* **Columns (Pipe-Separated)**:
  ```text
  user_id|topic_id|is_correct|time_taken_sec|hints_used|attempts_count
  ```
* **Sample Record**:
  ```text
  student_001|trees|1|388|0|1
  student_002|trees|0|431|2|2
  student_003|strings|1|227|0|1
  student_004|arrays|1|116|0|1
  ```

### 2. `assistments_2009_2010.psv` (K-12 Math Benchmark)
* **File Path**: [`data/psv/assistments_2009_2010.psv`](file:///c:/Users/Chirag%20Pradhan/dl%20model/data/psv/assistments_2009_2010.psv)
* **Origin**: Worcester Polytechnic Institute (WPI) Neil Heffernan Lab & EduData Benchmark.
* **Interactions**: **525,534** real student records across **123 skills**.
* **Columns (Pipe-Separated)**:
  ```text
  user_id|skill_id|correct|hint_count|ms_first_response
  ```
* **Sample Record**:
  ```text
  user_1|7|1|0|4805
  user_2|82|0|2|3586
  user_3|98|1|0|15302
  ```

### 3. `ednet.psv` (AI Test Prep & Tutoring)
* **File Path**: [`data/psv/ednet.psv`](file:///c:/Users/Chirag%20Pradhan/dl%20model/data/psv/ednet.psv)
* **Origin**: Riiid Labs (EdNet).
* **Scope**: Standardized English & math AI tutoring interactions.
* **Columns (Pipe-Separated)**:
  ```text
  solving_id|elapsed_time|user_answer|explanation_read
  ```

### 4. `kdd_cup_2010.psv` (Algebra Cognitive Tutor)
* **File Path**: [`data/psv/kdd_cup_2010.psv`](file:///c:/Users/Chirag%20Pradhan/dl%20model/data/psv/kdd_cup_2010.psv)
* **Origin**: PSLC DataShop / Carnegie Mellon University.
* **Scope**: Algebra & Bridge to Algebra problem steps.
* **Columns (Pipe-Separated)**:
  ```text
  Student Id|Problem Name|Step Name|Incorrects|Hints
  ```

### 5. `statics2011.psv` (Engineering Statics)
* **File Path**: [`data/psv/statics2011.psv`](file:///c:/Users/Chirag%20Pradhan/dl%20model/data/psv/statics2011.psv)
* **Origin**: Carnegie Mellon University (CMU) Open Learning Initiative (OLI).
* **Scope**: University engineering statics problems.
* **Columns (Pipe-Separated)**:
  ```text
  Student ID|Problem Name|CF Attempt|Duration
  ```

---

## 📐 Deep Learning Model Architecture

The PyTorch Knowledge Tracing model ([`models/dkt_lstm.py`](file:///c:/Users/Chirag%20Pradhan/dl%20model/models/dkt_lstm.py)) implements an LSTM recurrent architecture:

1. **Discrete Embedding**:
   - Concept ID $c_t \in \{0, \dots, C-1\} \rightarrow \mathbf{e}_c(c_t) \in \mathbb{R}^{32}$
   - Answer Correctness $y_t \in \{0, 1\} \rightarrow \mathbf{e}_y(y_t) \in \mathbb{R}^{16}$
2. **Telemetry Projection**:
   - Projects $[\log(1 + \tau_t/60), \log(1 + k_t), \log(1 + \Delta t)] \rightarrow \mathbb{R}^{16}$ via dense SiLU layers.
3. **Latent Knowledge State**:
   $$\mathbf{h}_t, \mathbf{c}_t = \text{LSTM}(\mathbf{x}_t, (\mathbf{h}_{t-1}, \mathbf{c}_{t-1}))$$
   Encodes the dynamic cognitive state of the student in $\mathbf{h}_t \in \mathbb{R}^{64}$.
4. **Mastery Prediction Head**:
   $$\hat{\mathbf{m}}_{t+1} = \sigma(\mathbf{W}_{\text{out}} \mathbf{h}_t + \mathbf{b}_{\text{out}}) \in (0, 1)^{C}$$
   Predicts the probability of answering next questions correctly across all curriculum topics.

---

## 📈 Training History & Benchmark Results

### A. CogniPath CS-DKT Benchmark (CS / DSA)
* **Model Checkpoint**: [`weights/dkt_lstm.pt`](file:///c:/Users/Chirag%20Pradhan/dl%20model/weights/dkt_lstm.pt)
* **History File**: [`weights/training_history_cognipath.json`](file:///c:/Users/Chirag%20Pradhan/dl%20model/weights/training_history_cognipath.json)
* **Metrics**:
  - **ROC-AUC**: **0.6302**
  - **F1-Score**: **0.7413**
  - **Accuracy**: **62.51%**
  - **Skills Tracked**: Arrays, Strings, Recursion, Trees, Graphs, Dynamic Programming.

### B. ASSISTments 2009-2010 Benchmark (Math Skill Builder)
* **Model Checkpoint**: [`weights/dkt_real_assist2009.pt`](file:///c:/Users/Chirag%20Pradhan/dl%20model/weights/dkt_real_assist2009.pt)
* **History File**: [`weights/training_history_assistments.json`](file:///c:/Users/Chirag%20Pradhan/dl%20model/weights/training_history_assistments.json)
* **Metrics (50 Epochs)**:
  - **Real Test Predictions Evaluated**: **32,525 interactions**
  - **ROC-AUC**: **0.7849**
  - **Accuracy**: **73.37%**
  - **Skills Tracked**: 124 distinct skills.

---

## 🚀 Commands & Execution

### 0. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 1. Train on CogniPath CS-DKT Dataset
```powershell
python train.py
```

### 2. Evaluate on CogniPath CS-DKT Dataset
```powershell
python evaluate.py
```

### 3. Train on ASSISTments 2009-2010 (124 Skills)
```powershell
python train_real_dkt.py
```

### 4. Interactive Terminal Mode (CLI)
```powershell
python demo_interactive.py
```

### 5. Automated Unit Tests
```powershell
python -m unittest discover -s tests -p "test_*.py"
```

### 6. Export/Refresh all PSV Datasets
```powershell
python extract_and_save_psv.py
```
