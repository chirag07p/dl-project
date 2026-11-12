import { DSA_QUESTION_BANK, getNextQuestionInTopic, getQuestionById } from '../data/dsaQuestions.ts';
import { DSA_TOPICS, getCanonicalConcept } from '../data/dsaTopics.ts';

const VALID_TOPICS = DSA_TOPICS.map((t) => t.name);
const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export function runQuestionBankValidation() {
  console.log('--- RUNNING QUESTION BANK INTEGRITY TESTS ---');

  // 1. Verify Unique IDs
  const idSet = new Set<string>();
  const duplicates: string[] = [];
  for (const q of DSA_QUESTION_BANK) {
    if (idSet.has(q.id)) {
      duplicates.push(q.id);
    }
    idSet.add(q.id);
  }
  if (duplicates.length > 0) {
    throw new Error(`Duplicate Question IDs found: ${duplicates.join(', ')}`);
  }
  console.log(`✓ All ${DSA_QUESTION_BANK.length} Question IDs are strictly unique.`);

  // 2. Verify each question structure & data contracts
  for (const q of DSA_QUESTION_BANK) {
    // Topic & Difficulty
    if (!VALID_TOPICS.includes(q.topic)) {
      throw new Error(`Invalid topic in question ${q.id}: ${q.topic}`);
    }
    if (!VALID_DIFFICULTIES.includes(q.difficulty)) {
      throw new Error(`Invalid difficulty in question ${q.id}: ${q.difficulty}`);
    }

    // Required non-empty strings
    if (!q.title?.trim() || !q.prompt?.trim() || !q.explanation?.trim() || !q.keyTakeaway?.trim()) {
      throw new Error(`Question ${q.id} has empty title, prompt, explanation, or keyTakeaway.`);
    }

    // Options
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Question ${q.id} has invalid options array.`);
    }
    const optionIds = q.options.map((o) => o.id);
    if (!optionIds.includes(q.correctOptionId)) {
      throw new Error(`Question ${q.id}: correctOptionId "${q.correctOptionId}" not found in options [${optionIds.join(', ')}]`);
    }

    for (const opt of q.options) {
      if (!opt.id?.trim() || !opt.text?.trim() || !opt.explanationSnippet?.trim()) {
        throw new Error(`Question ${q.id} option ${opt.id} has empty text or explanation snippet.`);
      }
    }
  }
  console.log(`✓ All questions have valid options, explanations, topic, and difficulty attributes.`);

  // 3. Verify Next Question Navigation
  const q1Next = getNextQuestionInTopic('AS-EASY-01', 'Arrays and Strings', 'All');
  if (q1Next?.id !== 'AS-EASY-02') {
    throw new Error(`Expected next after AS-EASY-01 to be AS-EASY-02, got ${q1Next?.id}`);
  }
  console.log(`✓ Question 1 (AS-EASY-01) -> Next resolves to Question 2 (AS-EASY-02)`);

  const q2Next = getNextQuestionInTopic('AS-EASY-02', 'Arrays and Strings', 'All');
  if (q2Next?.id !== 'AS-EASY-03') {
    throw new Error(`Expected next after AS-EASY-02 to be AS-EASY-03, got ${q2Next?.id}`);
  }
  console.log(`✓ Question 2 (AS-EASY-02) -> Next resolves to Question 3 (AS-EASY-03)`);

  const lastQNext = getNextQuestionInTopic('AS-HARD-01', 'Arrays and Strings', 'All');
  if (lastQNext !== null) {
    throw new Error(`Expected next after final question AS-HARD-01 to be null, got ${lastQNext?.id}`);
  }
  console.log(`✓ Final question (AS-HARD-01) -> Next resolves to null (Completion state verified)`);

  // 4. Verify Difficulty-filtered Next Question Navigation
  const easyFilteredLast = getNextQuestionInTopic('AS-EASY-03', 'Arrays and Strings', 'Easy');
  if (easyFilteredLast !== null) {
    throw new Error(`Expected next after final Easy question AS-EASY-03 to be null under Easy filter, got ${easyFilteredLast?.id}`);
  }
  console.log(`✓ Filtered final question (AS-EASY-03 under Easy) -> Next resolves to null (Completion state verified)`);

  // 5. Verify Canonical Concept Mapping (Requirement 2)
  for (const q of DSA_QUESTION_BANK) {
    const concept = getCanonicalConcept(q.subconcept, q.topic);
    if (!concept || concept.trim().length === 0) {
      throw new Error(`Question ${q.id} failed canonical concept resolution for subconcept "${q.subconcept}"`);
    }
  }
  // Check specific concept consolidation:
  const asEasy01Concept = getCanonicalConcept('Two-Pointer Technique', 'Arrays and Strings');
  const asHard01Concept = getCanonicalConcept('Two-Pointer / Trapping Rain Water', 'Arrays and Strings');
  if (asEasy01Concept !== 'Two-Pointer Technique' || asHard01Concept !== 'Two-Pointer Technique') {
    throw new Error(`Expected AS-EASY-01 and AS-HARD-01 to both map to 'Two-Pointer Technique', got ${asEasy01Concept} & ${asHard01Concept}`);
  }
  console.log(`✓ Canonical concept mapping verified: AS-EASY-01 and AS-HARD-01 consolidate to '${asEasy01Concept}'`);

  const asMed01Concept = getCanonicalConcept('Sliding Window (Dynamic Size)', 'Arrays and Strings');
  const asMed02Concept = getCanonicalConcept('Sliding Window (Fixed Size / Hash Map)', 'Arrays and Strings');
  if (asMed01Concept !== 'Sliding Window Patterns' || asMed02Concept !== 'Sliding Window Patterns') {
    throw new Error(`Expected AS-MED-01 and AS-MED-02 to both map to 'Sliding Window Patterns', got ${asMed01Concept} & ${asMed02Concept}`);
  }
  console.log(`✓ Canonical concept mapping verified: AS-MED-01 and AS-MED-02 consolidate to '${asMed01Concept}'`);

  // 6. Verify Safe Question ID Lookup & Invalid QID resilience (Requirement 3)
  const validQ = getQuestionById('AS-EASY-01');
  if (!validQ || validQ.id !== 'AS-EASY-01') {
    throw new Error(`Failed to safely retrieve valid question AS-EASY-01`);
  }
  const invalidQ = getQuestionById('INVALID-QID-999');
  if (invalidQ !== undefined) {
    throw new Error(`Expected undefined for invalid question ID, got ${JSON.stringify(invalidQ)}`);
  }
  console.log(`✓ Safe question lookup verified: valid ID returns question, invalid ID safely returns undefined`);

  console.log('--- ALL QUESTION BANK INTEGRITY TESTS PASSED ---\n');
}

// Run directly if executed via node
runQuestionBankValidation();
