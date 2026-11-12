import type { DSAQuestion, DSATopicCategory, DifficultyLevel } from '../types';

/**
 * Centralized Demo DSA Question Bank.
 * Formatted with standardized question IDs, topic mappings, calibrated difficulty,
 * code snippets, testable option choices, and step-by-step explanations.
 */
export const DSA_QUESTION_BANK: DSAQuestion[] = [
  // ==========================================
  // 1. ARRAYS AND STRINGS
  // ==========================================
  {
    id: 'AS-EASY-01',
    topic: 'Arrays and Strings',
    topicSlug: 'arrays-and-strings',
    subconcept: 'Two-Pointer Technique',
    difficulty: 'Easy',
    type: 'code_analysis',
    title: 'Two Sum in a Sorted Array (Two-Pointer Invariant)',
    prompt:
      'Given an array of integers sorted in ascending order and a target sum, which pointer adjustment correctly maintains the invariant when numbers[left] + numbers[right] > target?',
    codeSnippet: `function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    if (currentSum === target) {
      return [left, right];
    } else if (currentSum > target) {
      // Which action correctly reduces the sum while preserving potential solutions?
      /* ??? */
    } else {
      left++;
    }
  }
  return [];
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'A',
        text: 'left++',
        explanationSnippet: 'Incrementing left increases or maintains the sum because the array is sorted, moving further from target.',
      },
      {
        id: 'B',
        text: 'right--',
        explanationSnippet: 'Since numbers[right] is the largest available element, decrementing right reduces currentSum towards target without skipping valid pairs.',
      },
      {
        id: 'C',
        text: 'left = right',
        explanationSnippet: 'Collapsing both pointers terminates the search immediately and misses valid combinations.',
      },
      {
        id: 'D',
        text: 'right = Math.floor((left + right) / 2)',
        explanationSnippet: 'Halving the boundary arbitrarily skips elements that may form the exact target with numbers[left].',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'In a sorted array, the elements satisfy numbers[0] <= numbers[1] <= ... <= numbers[n-1]. If numbers[left] + numbers[right] > target, numbers[right] cannot be paired with numbers[left] or any larger number to its right. Therefore, right must be decremented (right--) to decrease the sum while maintaining the two-pointer invariant in O(N) time and O(1) space.',
    keyTakeaway: 'When currentSum > target on a sorted collection, decrement the right pointer because no element between left and right can pair with numbers[right] to yield a smaller sum.',
    timeTargetSeconds: 75,
  },
  {
    id: 'AS-EASY-02',
    topic: 'Arrays and Strings',
    topicSlug: 'arrays-and-strings',
    subconcept: 'Prefix Sum Array',
    difficulty: 'Easy',
    type: 'multiple_choice',
    title: 'Range Sum Query using Prefix Sums',
    prompt:
      'Given an original array nums = [3, 1, 4, 2, 8] and its 1-indexed prefix sum array prefix = [0, 3, 4, 8, 10, 18], what formula calculates the subarray sum from index L=1 to R=3 (i.e. nums[1] + nums[2] + nums[3] where 0-indexed elements are 1, 4, 2) in O(1) time?',
    options: [
      {
        id: 'A',
        text: 'prefix[R + 1] - prefix[L]',
        explanationSnippet: 'prefix[4] - prefix[1] = 10 - 3 = 7, exactly matching nums[1] + nums[2] + nums[3] = 1 + 4 + 2 = 7.',
      },
      {
        id: 'B',
        text: 'prefix[R] - prefix[L]',
        explanationSnippet: 'prefix[3] - prefix[1] = 8 - 3 = 5, which excludes nums[3].',
      },
      {
        id: 'C',
        text: 'prefix[R + 1] - prefix[L + 1]',
        explanationSnippet: 'This mistakenly excludes nums[1].',
      },
      {
        id: 'D',
        text: 'prefix[R] + prefix[L]',
        explanationSnippet: 'Adding prefix sums doubles early terms rather than isolating the range difference.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'With a 1-indexed prefix sum array where prefix[k] stores the sum of the first k elements, the sum of elements from index L to R inclusive is prefix[R + 1] - prefix[L]. Here, prefix[3 + 1] - prefix[1] = 10 - 3 = 7, matching 1 + 4 + 2 = 7.',
    keyTakeaway: 'A prefix sum table converts any contiguous subarray range sum query from O(K) loop traversal to O(1) subtraction.',
    timeTargetSeconds: 60,
  },
  {
    id: 'AS-EASY-03',
    topic: 'Arrays and Strings',
    topicSlug: 'arrays-and-strings',
    subconcept: 'String Reversal & In-Place Modification',
    difficulty: 'Easy',
    type: 'code_analysis',
    title: 'In-Place Character Array Reversal Invariant',
    prompt:
      'Consider this function intended to reverse an array of characters in-place. What is the space complexity, and how many character swaps are executed for an array of length N?',
    codeSnippet: `function reverseString(s: string[]): void {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'A',
        text: 'O(N) auxiliary space, N swaps executed',
        explanationSnippet: 'No extra array is allocated; only pointers and a temp variable are used.',
      },
      {
        id: 'B',
        text: 'O(1) auxiliary space, Math.floor(N / 2) swaps executed',
        explanationSnippet: 'Pointers move towards each other one step at a time, performing exactly floor(N/2) swaps with constant auxiliary memory.',
      },
      {
        id: 'C',
        text: 'O(log N) auxiliary space, N / 2 swaps executed',
        explanationSnippet: 'There is no logarithmic recursion or divide-and-conquer call stack.',
      },
      {
        id: 'D',
        text: 'O(1) auxiliary space, 2 * N swaps executed',
        explanationSnippet: 'Swapping stops once pointers meet at the middle, never exceeding floor(N/2).',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'The two-pointer reversal moves inward from both boundaries simultaneously. For an array of length N, the pointers converge at the center after floor(N / 2) iterations. Because only a scalar temp variable and two indices are stored, the algorithm operates in O(1) auxiliary space.',
    keyTakeaway: 'In-place two-pointer reversal achieves optimal O(N) time and O(1) space with exactly floor(N/2) pairwise element swaps.',
    timeTargetSeconds: 60,
  },
  {
    id: 'AS-MED-01',
    topic: 'Arrays and Strings',
    topicSlug: 'arrays-and-strings',
    subconcept: 'Sliding Window Patterns',
    difficulty: 'Medium',
    type: 'code_analysis',
    title: 'Minimum Size Subarray Sum (Dynamic Window Contraction)',
    prompt:
      'In the sliding window problem below, we want to find the minimal length of a contiguous subarray whose sum is greater than or equal to target. What line must be inserted in the inner while loop to ensure the window contracts properly?',
    codeSnippet: `function minSubArrayLen(target: number, nums: number[]): number {
  let minLength = Infinity;
  let currentSum = 0;
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];

    while (currentSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      // How do we shrink the window from the left?
      /* LINE TO INSERT */
    }
  }

  return minLength === Infinity ? 0 : minLength;
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'A',
        text: 'currentSum -= nums[left++];',
        explanationSnippet: 'Subtracts nums[left] from currentSum and then increments the left pointer, effectively shrinking the window from the left.',
      },
      {
        id: 'B',
        text: 'currentSum -= nums[right--];',
        explanationSnippet: 'Shrinking the right boundary conflicts with the outer for loop progression.',
      },
      {
        id: 'C',
        text: 'left++;',
        explanationSnippet: 'Fails to subtract nums[left] from currentSum, causing an incorrect running accumulator.',
      },
      {
        id: 'D',
        text: 'currentSum = 0; left = right;',
        explanationSnippet: 'Discards the entire window rather than searching for the minimal valid length.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'The sliding window strategy expands with right++ until the condition (currentSum >= target) is met, then records the length and shrinks with currentSum -= nums[left]; left++ to find the smallest valid subarray. Option A concisely accomplishes both the deduction and the pointer increment.',
    keyTakeaway: 'In variable-size sliding windows, expand with the right boundary to satisfy constraints, then contract with the left boundary to optimize the objective function.',
    timeTargetSeconds: 90,
  },
  {
    id: 'AS-MED-02',
    topic: 'Arrays and Strings',
    topicSlug: 'arrays-and-strings',
    subconcept: 'Sliding Window & Hash Map',
    difficulty: 'Medium',
    type: 'code_analysis',
    title: 'Longest Substring Without Repeating Characters',
    prompt:
      'When processing string s = "pwwkew" using a sliding window and a Map tracking each character’s latest seen index, why must the left pointer be updated using left = Math.max(left, lastSeen.get(char) + 1) instead of left = lastSeen.get(char) + 1?',
    codeSnippet: `const lastSeen = new Map<string, number>();
let left = 0;
let maxLength = 0;

for (let right = 0; right < s.length; right++) {
  const char = s[right];
  if (lastSeen.has(char)) {
    // Why is Math.max essential here?
    left = Math.max(left, lastSeen.get(char)! + 1);
  }
  lastSeen.set(char, right);
  maxLength = Math.max(maxLength, right - left + 1);
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'A',
        text: 'To avoid moving the left pointer backwards if the duplicate character was seen before the current window start',
        explanationSnippet: 'If a character appeared earlier outside the active window, lastSeen + 1 could be smaller than left. Math.max guarantees left only advances.',
      },
      {
        id: 'B',
        text: 'To ensure the right pointer does not exceed string length',
        explanationSnippet: 'The right pointer is controlled by the outer loop and is unaffected by left pointer calculations.',
      },
      {
        id: 'C',
        text: 'Because JavaScript Maps do not support negative index lookups',
        explanationSnippet: 'Map indices are positive numbers; Math.max does not relate to negative index handling here.',
      },
      {
        id: 'D',
        text: 'To automatically reset the Map when a collision occurs',
        explanationSnippet: 'The Map is not cleared; it retains previous locations for remaining characters.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'In "abba", when right=3 ("a"), "a" was last seen at index 0. However, the window currently starts at left=2 (due to duplicate "b"). Without Math.max, left would move backwards from 2 to 0+1=1, erroneously re-including duplicate "b" into the window. Math.max ensures left is monotonically non-decreasing.',
    keyTakeaway: 'Always bound sliding window pointer jumps using Math.max(left, duplicateIndex + 1) to prevent the window boundary from rewinding past prior contractions.',
    timeTargetSeconds: 90,
  },
  {
    id: 'AS-MED-03',
    topic: 'Arrays and Strings',
    topicSlug: 'arrays-and-strings',
    subconcept: "Kadane's Algorithm",
    difficulty: 'Medium',
    type: 'multiple_choice',
    title: "Kadane's Algorithm for Maximum Subarray",
    prompt:
      "For an array containing both positive and negative numbers such as nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4], what is the recurrence relation that determines the maximum subarray ending at index i?",
    options: [
      {
        id: 'A',
        text: 'currentMax[i] = Math.max(nums[i], currentMax[i - 1] + nums[i])',
        explanationSnippet: 'At index i, we either start a fresh subarray at nums[i] or extend the previous optimal subarray currentMax[i - 1] + nums[i].',
      },
      {
        id: 'B',
        text: 'currentMax[i] = currentMax[i - 1] + Math.abs(nums[i])',
        explanationSnippet: 'Taking absolute values violates the original array values and problem definition.',
      },
      {
        id: 'C',
        text: 'currentMax[i] = Math.max(0, currentMax[i - 1]) * nums[i]',
        explanationSnippet: 'Multiplying by nums[i] solves maximum product, not maximum contiguous sum.',
      },
      {
        id: 'D',
        text: 'currentMax[i] = nums[i] - currentMax[i - 1]',
        explanationSnippet: 'Subtracting previous subarrays does not compute cumulative contiguous sum.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      "Kadane's algorithm maintains the dynamic programming state: at each index i, the maximum sum ending at i is either the element itself (discarding any negative cumulative sum from before) or the element added to the previous maximum: max(nums[i], currentMax[i-1] + nums[i]). This runs in O(N) time and O(1) space.",
    keyTakeaway: "If the accumulator from previous elements drops below zero, it only drags down future subarrays; start a fresh subarray from nums[i].",
    timeTargetSeconds: 80,
  },
  {
    id: 'AS-HARD-01',
    topic: 'Arrays and Strings',
    topicSlug: 'arrays-and-strings',
    subconcept: 'Trapping Rain Water (Two Pointers)',
    difficulty: 'Hard',
    type: 'code_analysis',
    title: 'Trapping Rain Water: Two-Pointer Space Optimization',
    prompt:
      'In the two-pointer approach for Trapping Rain Water, why can we safely compute trapped water using leftMax - height[left] whenever height[left] < height[right], without needing to know the exact global maximum between left and right?',
    codeSnippet: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left]; // Why is this safe?
      }
      left++;
    } else {
      // symmetric logic for right pointer
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }
  return totalWater;
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'A',
        text: 'Because height[left] < height[right] guarantees that there is at least one boundary to the right that is >= leftMax, so leftMax is the true bottleneck.',
        explanationSnippet: 'Water depth is min(maxLeft, maxRight) - height[i]. Since height[right] > height[left] and rightMax >= height[right], rightMax is guaranteed to be >= leftMax.',
      },
      {
        id: 'B',
        text: 'Because the array is guaranteed to be sorted in increasing order up to height[right].',
        explanationSnippet: 'The elevation array can have arbitrary spikes and valleys; it is not sorted.',
      },
      {
        id: 'C',
        text: 'Because leftMax always equals the total water collected so far.',
        explanationSnippet: 'leftMax is the highest wall seen from the left, not the accumulated water volume.',
      },
      {
        id: 'D',
        text: 'Because negative water values are automatically clamped by the compiler.',
        explanationSnippet: 'leftMax >= height[left] in that branch, so the value is naturally non-negative.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'The trapped water above any bar i is determined by min(maxLeft_i, maxRight_i) - height[i]. When height[left] < height[right], we know there exists some bar on the right side that is at least as tall as height[right], which is taller than leftMax. Therefore, leftMax is strictly the limiting bottleneck, allowing us to compute trapped water on the left side in O(1) space.',
    keyTakeaway: 'The two-pointer technique allows computing water volume from whichever side has the lower current wall, because the opposite side is guaranteed not to be the limiting boundary.',
    timeTargetSeconds: 120,
  },

  // ==========================================
  // 2. SEARCHING
  // ==========================================
  {
    id: 'SR-EASY-01',
    topic: 'Searching',
    topicSlug: 'searching',
    subconcept: 'Binary Search Lower Bound',
    difficulty: 'Easy',
    type: 'code_analysis',
    title: 'Binary Search Lower Bound Termination',
    prompt:
      'To find the first index where array[index] >= target in a sorted array, which loop condition and midpoint pointer assignment avoid an infinite loop?',
    codeSnippet: `let left = 0;
let right = array.length; // half-open interval [left, right)

while (left < right) {
  const mid = Math.floor(left + (right - left) / 2);
  if (array[mid] >= target) {
    right = mid; // Search left half
  } else {
    /* What should left be set to? */
    /* ??? */
  }
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'A',
        text: 'left = mid + 1;',
        explanationSnippet: 'Since array[mid] < target, mid cannot be the lower bound. Moving to mid + 1 strictly shrinks the search interval.',
      },
      {
        id: 'B',
        text: 'left = mid;',
        explanationSnippet: 'When right - left = 1, mid = left, causing left = mid to stall in an infinite loop.',
      },
      {
        id: 'C',
        text: 'left = mid - 1;',
        explanationSnippet: 'Moving left backwards expands the search range and violates the invariant.',
      },
      {
        id: 'D',
        text: 'right = mid - 1;',
        explanationSnippet: 'Modifying right in the else branch discards valid elements on the left.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'In a half-open search interval [left, right), if array[mid] < target, index mid is strictly less than target and cannot be the answer. Setting left = mid + 1 guarantees progress towards the termination condition (left === right), returning the exact lower bound in O(log N).',
    keyTakeaway: 'Use left = mid + 1 when array[mid] < target to ensure the search range shrinks monotonically and eliminates infinite loops.',
    timeTargetSeconds: 70,
  },

  // ==========================================
  // 3. SORTING
  // ==========================================
  {
    id: 'ST-MED-01',
    topic: 'Sorting',
    topicSlug: 'sorting',
    subconcept: 'Merge Sort Invariant',
    difficulty: 'Medium',
    type: 'multiple_choice',
    title: 'Merge Sort Stability and Auxiliary Space Invariant',
    prompt:
      'Why is standard Merge Sort classified as a stable sort, and what is its auxiliary space complexity for sorting an array of N elements?',
    options: [
      {
        id: 'A',
        text: 'Stable because equal elements from the left subarray are merged before equal elements from the right subarray; O(N) auxiliary space.',
        explanationSnippet: 'The condition left[i] <= right[j] explicitly preserves original relative order, requiring O(N) temporary buffer space during merge.',
      },
      {
        id: 'B',
        text: 'Unstable because elements are swapped across long distances; O(1) auxiliary space.',
        explanationSnippet: 'Merge sort does not do long-distance swaps; that describes Quick Sort or Heap Sort.',
      },
      {
        id: 'C',
        text: 'Stable; O(1) auxiliary space.',
        explanationSnippet: 'Standard array merge sort requires O(N) auxiliary memory to store elements during merging.',
      },
      {
        id: 'D',
        text: 'Unstable; O(log N) auxiliary space.',
        explanationSnippet: 'Merge sort is stable when implemented with <= comparison.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'Stability means elements with equal keys maintain their original relative order. In the merge step, when left[i] === right[j], choosing left[i] first preserves stability. Merging two arrays requires an auxiliary buffer of size N, yielding O(N) auxiliary space and O(N log N) time.',
    keyTakeaway: 'Merge Sort guarantees O(N log N) worst-case time and stability at the cost of O(N) auxiliary buffer space.',
    timeTargetSeconds: 75,
  },

  // ==========================================
  // 4. LINKED LISTS
  // ==========================================
  {
    id: 'LL-EASY-01',
    topic: 'Linked Lists',
    topicSlug: 'linked-lists',
    subconcept: 'Fast and Slow Pointers',
    difficulty: 'Easy',
    type: 'code_analysis',
    title: "Floyd's Cycle Detection Algorithm",
    prompt:
      'Given the head of a singly linked list, which pointer speeds guarantee detection of a cycle in O(N) time and O(1) space if a cycle exists?',
    codeSnippet: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      return true; // Cycle detected
    }
  }
  return false;
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'A',
        text: 'slow advances 1 step, fast advances 2 steps per iteration',
        explanationSnippet: 'The relative distance between fast and slow decreases by exactly 1 per step inside the loop, guaranteeing intersection without skipping.',
      },
      {
        id: 'B',
        text: 'slow advances 1 step, fast advances 3 steps per iteration',
        explanationSnippet: 'Advancing 3 steps can hop over slow depending on cycle length parity, requiring extra checks.',
      },
      {
        id: 'C',
        text: 'Both advance 2 steps per iteration',
        explanationSnippet: 'Equal speeds maintain constant distance and will never intersect if started apart.',
      },
      {
        id: 'D',
        text: 'fast advances 1 step, slow advances 2 steps per iteration',
        explanationSnippet: 'Inverting the naming does not change the core invariant, but standard Floyd convention moves fast 2 and slow 1.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      "Floyd's Tortoise and Hare algorithm advances slow by 1 node and fast by 2 nodes. If a cycle exists with circumference C, the relative gap between fast and slow closes by 1 node each iteration. Thus, fast catches slow within C steps after entering the cycle, achieving O(N) time and O(1) auxiliary space.",
    keyTakeaway: 'Fast (2x) and slow (1x) pointers close the gap by 1 step per cycle iteration, guaranteeing an intersection in linear time without extra memory.',
    timeTargetSeconds: 65,
  },

  // ==========================================
  // 5. STACKS AND QUEUES
  // ==========================================
  {
    id: 'SQ-EASY-01',
    topic: 'Stacks and Queues',
    topicSlug: 'stacks-and-queues',
    subconcept: 'Balanced Parentheses Validation',
    difficulty: 'Easy',
    type: 'multiple_choice',
    title: 'Valid Parentheses LIFO Invariant',
    prompt:
      'When validating balanced brackets such as "({[]})", which data structure and operation order correctly matches closing brackets with their most immediate opening counterparts?',
    options: [
      {
        id: 'A',
        text: 'Stack (LIFO): Push opening brackets, pop and verify matching type upon encountering each closing bracket.',
        explanationSnippet: 'The most recently opened bracket must be the first one closed, which directly matches the Last-In, First-Out property of a stack.',
      },
      {
        id: 'B',
        text: 'Queue (FIFO): Enqueue opening brackets, dequeue upon encountering closing brackets.',
        explanationSnippet: 'FIFO matches the oldest open bracket, which incorrectly fails on nested patterns like "{()}".',
      },
      {
        id: 'C',
        text: 'Hash Set: Add opening brackets and remove on closing brackets.',
        explanationSnippet: 'A set does not preserve ordering or handle multiple brackets of the same type.',
      },
      {
        id: 'D',
        text: 'Binary Heap: Insert character ASCII values.',
        explanationSnippet: 'Heaps sort by priority, not chronological nesting structure.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'Parentheses matching requires resolving innermost brackets first. A LIFO Stack stores opening brackets. When a closing bracket arrives, the top element of the stack must be the corresponding opening bracket. If the stack is empty or the types mismatch, the string is invalid. Finally, an empty stack confirms balance in O(N) time and O(N) space.',
    keyTakeaway: 'Nested hierarchical structures require LIFO (Stack) ordering so the most recently opened scope is verified first.',
    timeTargetSeconds: 60,
  },

  // ==========================================
  // 6. RECURSION
  // ==========================================
  {
    id: 'RC-EASY-01',
    topic: 'Recursion',
    topicSlug: 'recursion',
    subconcept: 'Base Case and Call Stack',
    difficulty: 'Easy',
    type: 'code_analysis',
    title: 'Recursive Base Case Invariant',
    prompt:
      'What happens if the base case condition n <= 1 is omitted from the recursive factorial function below when called with n = 5?',
    codeSnippet: `function factorial(n: number): number {
  // If base case 'if (n <= 1) return 1;' is omitted:
  return n * factorial(n - 1);
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'A',
        text: 'The function returns 0 when n reaches 0.',
        explanationSnippet: 'Without a return statement at 0, execution continues recursively into negative numbers.',
      },
      {
        id: 'B',
        text: 'Call stack overflow error (RangeError: Maximum call stack size exceeded).',
        explanationSnippet: 'The function recurses indefinitely into -1, -2, -3... until the runtime call stack exhausts available memory.',
      },
      {
        id: 'C',
        text: 'The JavaScript runtime converts it automatically into an iterative loop.',
        explanationSnippet: 'Standard JavaScript runtimes do not convert unbounded recursion into loops.',
      },
      {
        id: 'D',
        text: 'The function returns NaN after 10 iterations.',
        explanationSnippet: 'Recursion does not stop at 10; it continues until stack exhaustion.',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'Every recursive function must have a well-defined base case that terminates recursion without further self-invocations. Without if (n <= 1) return 1;, calls continue infinitely (5 -> 4 -> 3 -> 2 -> 1 -> 0 -> -1 -> ...), rapidly filling call stack frames until a call stack overflow error occurs.',
    keyTakeaway: 'A valid recursive algorithm requires both a termination base case and a recurrence step that strictly moves state closer to that base case.',
    timeTargetSeconds: 60,
  },

  // ==========================================
  // 7. TREES
  // ==========================================
  {
    id: 'TR-EASY-01',
    topic: 'Trees',
    topicSlug: 'trees',
    subconcept: 'Binary Search Tree Traversal Invariant',
    difficulty: 'Easy',
    type: 'multiple_choice',
    title: 'BST Inorder Traversal Property',
    prompt:
      'Which tree traversal produces the keys of a valid Binary Search Tree (BST) in strictly ascending sorted order?',
    options: [
      {
        id: 'A',
        text: 'Inorder Traversal (Left -> Root -> Right)',
        explanationSnippet: 'Because all nodes in the left subtree are smaller than root, and all nodes in the right subtree are larger, visiting Left then Root then Right yields sorted order.',
      },
      {
        id: 'B',
        text: 'Preorder Traversal (Root -> Left -> Right)',
        explanationSnippet: 'Preorder visits root before left, placing parents before smaller children.',
      },
      {
        id: 'C',
        text: 'Postorder Traversal (Left -> Right -> Root)',
        explanationSnippet: 'Postorder visits root last, commonly used for tree deletions, not sorted output.',
      },
      {
        id: 'D',
        text: 'Level-Order Traversal (Breadth-First)',
        explanationSnippet: 'Level-order groups nodes by depth, which does not guarantee key ordering across branches.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'By definition, for any node in a BST, every key in its left subtree is less than the node’s key, and every key in its right subtree is greater. Inorder traversal visits left subtree first, then the current node, then right subtree. This guarantees strictly non-decreasing output in O(N) time.',
    keyTakeaway: 'Inorder traversal of a Binary Search Tree always outputs elements in sorted order.',
    timeTargetSeconds: 60,
  },
];

/**
 * Helper utilities for accessing question bank data.
 */
export const getAllQuestions = (): DSAQuestion[] => {
  return DSA_QUESTION_BANK;
};

export const getQuestionsByTopic = (topic: DSATopicCategory): DSAQuestion[] => {
  return DSA_QUESTION_BANK.filter((q) => q.topic === topic);
};

export const getQuestionById = (id: string): DSAQuestion | undefined => {
  return DSA_QUESTION_BANK.find((q) => q.id.toLowerCase() === id.toLowerCase());
};

export const getInitialQuestionForTopic = (
  topic: DSATopicCategory,
  preferredDifficulty?: DifficultyLevel
): DSAQuestion | undefined => {
  const topicQuestions = getQuestionsByTopic(topic);
  if (topicQuestions.length === 0) {
    return undefined;
  }

  if (preferredDifficulty) {
    const match = topicQuestions.find((q) => q.difficulty === preferredDifficulty);
    if (match) return match;
  }

  return topicQuestions[0];
};

export const getNextQuestionInTopic = (
  currentQuestionId: string,
  topic: DSATopicCategory,
  difficultyFilter: DifficultyLevel | 'All' = 'All'
): DSAQuestion | null => {
  const topicQuestions = getQuestionsByTopic(topic).filter(
    (q) => difficultyFilter === 'All' || q.difficulty === difficultyFilter
  );
  const currentIndex = topicQuestions.findIndex(
    (q) => q.id.toLowerCase() === currentQuestionId.toLowerCase()
  );
  if (currentIndex !== -1 && currentIndex < topicQuestions.length - 1) {
    return topicQuestions[currentIndex + 1];
  }
  return null;
};
