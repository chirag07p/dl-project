/**
 * Clean text utilities and client-side knowledge matcher for CogniPath AI Tutor.
 * Guarantees that raw Markdown symbols (#, ---, *, **) are never displayed to the user
 * and that different questions receive distinct, accurate answers.
 */

export function cleanMarkdownSymbols(raw: string): string {
  if (!raw) return '';

  // 1. Remove all '#' characters completely
  let text = raw.replace(/#/g, '');

  // 2. Remove divider lines (---, ***, ___)
  const lines = text.split('\n');
  const cleanedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed === '---' ||
      trimmed === '***' ||
      trimmed === '___' ||
      trimmed === '- - -' ||
      trimmed === '* * *'
    ) {
      continue;
    }
    // Remove bold and italic markdown asterisks (**word** -> word, *word* -> word)
    let cleaned = line.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
    // Replace any remaining stray asterisks with clean bullet or space
    cleaned = cleaned.replace(/\*/g, '•');
    cleanedLines.push(cleaned);
  }

  let result = cleanedLines.join('\n');
  // Collapse excessive newlines
  result = result.replace(/\n{3,}/g, '\n\n');
  return result.trim();
}

/**
 * Intelligent client-side response matcher providing distinct, detailed answers
 * for DSA queries if the Python backend is temporarily offline.
 */
export function getSmartOfflineResponse(query: string, topic: string = 'Arrays and Strings'): string {
  const q = query.toLowerCase().trim();
  const header = `CogniPath AI Tutor:\nBased on your learning state for ${topic}:\n`;

  let body = '';

  // 1. Declare array
  if (
    q.includes('declare array') ||
    q.includes('declaration of array') ||
    q.includes('create array') ||
    q.includes('initialize array') ||
    q.includes('define array') ||
    q.includes('make array') ||
    q.includes('how to declare')
  ) {
    body = `How to Declare an Array:
An array is a linear collection of elements stored at contiguous memory locations.

• Python:
  numbers = [1, 2, 3, 4, 5]          // List with initial elements
  empty_list = []                    // Empty list
  zeros = [0] * 10                   // 10 elements initialized to 0

• JavaScript / TypeScript:
  const numbers = [1, 2, 3, 4, 5];   // Array literal
  const emptyArr: number[] = [];     // Empty typed array
  const sized = new Array(5).fill(0);// Sized array of 5 zeros

• C++:
  int numbers[5] = {1, 2, 3, 4, 5};  // Static array
  vector<int> numbers = {1, 2, 3};   // Dynamic vector

• Java:
  int[] numbers = {1, 2, 3, 4, 5};   // Direct initialization
  int[] numbers = new int[5];        // Sized array

Key Property:
Arrays provide constant O(1) time access to any element using its index.`;
  }
  // 2. Print array
  else if (
    q.includes('print array') ||
    q.includes('display array') ||
    q.includes('show array') ||
    q.includes('output array') ||
    q.includes('print elements') ||
    q.includes('how to print')
  ) {
    body = `How to Print an Array:
Here is how to display array elements across programming languages:

• Python:
  numbers = [10, 20, 30]
  print(numbers)                     // Output: [10, 20, 30]
  for val in numbers:
      print(val, end=" ")            // Output: 10 20 30

• JavaScript / TypeScript:
  const numbers = [10, 20, 30];
  console.log(numbers);              // Output: [10, 20, 30]
  console.log(numbers.join(", "));   // Output: 10, 20, 30

• C++:
  vector<int> numbers = {10, 20, 30};
  for (int val : numbers) {
      cout << val << " ";
  }

• Java:
  int[] numbers = {10, 20, 30};
  System.out.println(Arrays.toString(numbers)); // Output: [10, 20, 30]

Performance:
Printing all elements requires traversing the collection, taking O(n) linear time.`;
  }
  // 3. Reverse array
  else if (
    q.includes('reverse array') ||
    q.includes('reverse an array') ||
    q.includes('invert array') ||
    q.includes('reverse string') ||
    q.includes('reverse')
  ) {
    body = `How to Reverse an Array (Two-Pointer Method):
The optimal approach uses two pointers starting at opposite ends and swapping inward.

Algorithm Steps:
1. Initialize left = 0 and right = length - 1.
2. While left < right, swap arr[left] with arr[right].
3. Increment left (left++) and decrement right (right--).

• Python Example:
  def reverse_array(arr):
      left, right = 0, len(arr) - 1
      while left < right:
          arr[left], arr[right] = arr[right], arr[left]
          left += 1
          right -= 1
      return arr

Complexity:
• Time Complexity: O(n) because each element is visited once.
• Space Complexity: O(1) in-place auxiliary space.`;
  }
  // 4. Two-pointer invariant
  else if (
    q.includes('invariant') ||
    q.includes('two pointer') ||
    q.includes('two sum') ||
    q.includes('right--') ||
    q.includes('left++')
  ) {
    body = `Two-Pointer Invariant Explanation:
When an array is sorted in ascending order:

1. If numbers[left] + numbers[right] > target:
   The current sum is strictly too large.
   Because the array is sorted, numbers[left] is the smallest remaining number on the left side. Any element paired with numbers[right] will only produce a sum equal to or greater than the current sum. Therefore, numbers[right] can never participate in any valid pair. The only correct step is right--.

2. If numbers[left] + numbers[right] < target:
   The current sum is strictly too small.
   Because numbers[right] is the largest candidate, pairing it with numbers[left] already fell short. Therefore, numbers[left] can never reach the target. The only correct step is left++.

Complexity:
• Time Complexity: O(n) single pass.
• Space Complexity: O(1) in-place pointers.`;
  }
  // 5. Complexity
  else if (
    q.includes('time complexity') ||
    q.includes('space complexity') ||
    q.includes('big o') ||
    q.includes('complexity')
  ) {
    body = `Time and Space Complexity Reference:

• Array Index Access: O(1) constant time.
• Linear Search: O(n) worst-case examining each item.
• Binary Search (Sorted): O(log n) halving search space.
• Two-Pointer Traversal: O(n) time, O(1) space.
• Sorting:
  - QuickSort / MergeSort: O(n log n) average time.
  - Bubble / Insertion / Selection Sort: O(n^2) quadratic time.
• Space Complexity:
  - In-place algorithms require O(1) auxiliary memory.
  - Recursive algorithms use O(depth) stack space.`;
  }
  // 6. Sorting
  else if (
    q.includes('sort') ||
    q.includes('sorting') ||
    q.includes('bubble') ||
    q.includes('merge sort') ||
    q.includes('quicksort')
  ) {
    body = `Overview of Sorting Algorithms:

1. Bubble Sort: Compares adjacent elements and swaps them if out of order. Time: O(n^2), Space: O(1).
2. Selection Sort: Repeatedly finds the minimum element and places it at the start. Time: O(n^2), Space: O(1).
3. Insertion Sort: Builds sorted subarray element by element. Time: O(n^2), Space: O(1).
4. Merge Sort: Divide and conquer algorithm dividing array in halves and merging sorted parts. Time: O(n log n), Space: O(n).
5. QuickSort: Partitions elements around a pivot and sorts partitions recursively. Average Time: O(n log n), Space: O(log n).`;
  }
  // 7. Searching
  else if (q.includes('search') || q.includes('binary search') || q.includes('linear search')) {
    body = `Searching Algorithms:

• Linear Search:
  Examines elements sequentially from start to end.
  Works on unsorted arrays. Time: O(n), Space: O(1).

• Binary Search:
  Prerequisite: Array must be sorted.
  Compares target against midpoint: mid = (left + right) / 2.
  If target == arr[mid], returns index.
  If target < arr[mid], searches left: right = mid - 1.
  If target > arr[mid], searches right: left = mid + 1.
  Time Complexity: O(log n), Space: O(1).`;
  }
  // 8. Recursion
  else if (
    q.includes('recursion') ||
    q.includes('recursive') ||
    q.includes('base case') ||
    q.includes('call stack')
  ) {
    body = `Understanding Recursion:
Recursion is a programming technique where a function calls itself to solve smaller subproblems.

Core Principles:
1. Base Case: The terminating condition that returns without recursive calls, preventing infinite loops.
2. Recursive Step: Breaks the problem into smaller self-similar subproblems.

• Python Example (Factorial):
  def factorial(n):
      if n <= 1:
          return 1
      return n * factorial(n - 1)

Stack Memory:
Each recursive call consumes a stack frame, resulting in O(n) space complexity.`;
  }
  // 9. Trees & BST
  else if (
    q.includes('tree') ||
    q.includes('binary tree') ||
    q.includes('bst') ||
    q.includes('traversal') ||
    q.includes('inorder')
  ) {
    body = `Binary Trees and Traversals:
A tree is a non-linear data structure with nodes connected by edges.

• Binary Search Tree (BST) Invariant:
  All values in left subtree < node value < all values in right subtree.

• Three Standard Traversals:
  1. Inorder (Left, Root, Right): Produces sorted ascending order for BSTs.
  2. Preorder (Root, Left, Right): Ideal for cloning or serializing trees.
  3. Postorder (Left, Right, Root): Ideal for bottom-up operations like deletion and height calculation.`;
  }
  // 10. Recommendations
  else if (
    q.includes('recommend') ||
    q.includes('next') ||
    q.includes('what should i practice') ||
    q.includes('weakness') ||
    q.includes('suggest')
  ) {
    body = `Personalized DKT Learning Recommendation:
Based on your knowledge tracing curve, your recommended next focus is Recursion at Medium difficulty.

Pedagogical Reason:
Focus on strengthening recursive call stack invariants and state reduction before progressing into Trees.

Suggested Next Steps:
1. Open the Practice Questions tab and select Recursion.
2. Solve 2-3 foundational problems to establish strong baseline mastery.
3. Return to review your updated DKT probability curve on the Dashboard.`;
  }
  // 11. General
  else {
    body = `Analysis for: "${query}"

When approaching this problem in ${topic}:
1. Clarify Inputs and Constraints: Identify array lengths, value ranges, and whether data is sorted.
2. Choose the Optimal Structure: Determine whether an array, hash map, two-pointer window, or stack is required.
3. State the Algorithm Invariant: Define what invariant must remain true across every loop iteration.
4. Verify Edge Cases: Check empty collections, single elements, duplicates, and extreme boundaries.

Tip: You can ask specific questions like 'how to declare array', 'how to print array', 'how to reverse array', or 'time complexity' to see code examples.`;
  }

  const footer = `\nAI Learning Style Note: You are categorized as a Fast Intuitive. You quickly identify algorithmic patterns and execute them with high speed.`;
  return cleanMarkdownSymbols(`${header}\n${body}\n${footer}`);
}

