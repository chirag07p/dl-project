import re
from typing import Dict, Any, Optional

def clean_markdown_symbols(text: str) -> str:
    """
    Completely removes Markdown header symbols (#, ##, ###), horizontal dividers (---, ***, ___),
    and asterisks (*, **) from text so the output is clean, readable, and professional.
    """
    # Remove all '#' characters entirely
    text = text.replace("#", "")
    
    lines = text.split("\n")
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        # Remove divider lines
        if stripped in ("---", "***", "___", "- - -", "* * *"):
            continue
        # Replace **word** or *word* with clean word
        line = re.sub(r'\*\*([^*]+)\*\*', r'\1', line)
        line = re.sub(r'\*([^*]+)\*', r'\1', line)
        # Replace any remaining stray asterisks with clean bullet or space
        line = line.replace("*", "•")
        cleaned_lines.append(line)
    
    result = "\n".join(cleaned_lines)
    # Remove excessive blank lines
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result.strip()


def generate_tutor_response(
    query: str,
    topic: str = "Arrays and Strings",
    mastery_pct: float = 83.4,
    mastery_level: str = "Proficient",
    style_name: str = "Fast Intuitive",
    style_guidance: str = "You quickly identify algorithmic patterns and execute them with high speed.",
    rec_topic: str = "Recursion",
    rec_diff: str = "Medium",
    rec_reason: str = "Focus on strengthening non-linear patterns."
) -> str:
    """
    Generates intelligent, query-specific answers without raw markdown symbols (#, ---, *).
    Directly answers declarations, printing, traversals, algorithms, complexities, and DKT recommendations.
    """
    q = query.lower().strip()
    header = f"CogniPath AI Tutor:\nBased on your current learning state for {topic} (Mastery: {mastery_pct}%, {mastery_level}):\n"

    # 1. How to declare / initialize an array
    if any(k in q for k in ["declare array", "declaration of array", "create array", "initialize array", "define array", "how to make array", "how to declare"]):
        body = (
            "How to Declare an Array:\n"
            "An array is a linear collection of elements stored at contiguous memory locations.\n\n"
            "• Python:\n"
            "  numbers = [1, 2, 3, 4, 5]          // List with initial elements\n"
            "  empty_list = []                    // Empty list\n"
            "  zeros = [0] * 10                   // 10 elements initialized to 0\n\n"
            "• JavaScript / TypeScript:\n"
            "  const numbers = [1, 2, 3, 4, 5];   // Array literal\n"
            "  const emptyArr: number[] = [];     // Empty typed array\n"
            "  const sized = new Array(5).fill(0);// Sized array of 5 zeros\n\n"
            "• C++:\n"
            "  int numbers[5] = {1, 2, 3, 4, 5};  // Static array\n"
            "  vector<int> numbers = {1, 2, 3};   // Dynamic vector\n\n"
            "• Java:\n"
            "  int[] numbers = {1, 2, 3, 4, 5};   // Direct initialization\n"
            "  int[] numbers = new int[5];        // Sized array\n\n"
            "Key Property:\n"
            "Arrays provide constant O(1) time access to any element using its index."
        )

    # 2. How to print an array / display array
    elif any(k in q for k in ["print array", "display array", "show array", "output array", "print elements", "how to print"]):
        body = (
            "How to Print an Array:\n"
            "Here is how to display array elements across programming languages:\n\n"
            "• Python:\n"
            "  numbers = [10, 20, 30]\n"
            "  print(numbers)                     // Output: [10, 20, 30]\n"
            "  for val in numbers:\n"
            "      print(val, end=\" \")            // Output: 10 20 30\n\n"
            "• JavaScript / TypeScript:\n"
            "  const numbers = [10, 20, 30];\n"
            "  console.log(numbers);              // Output: [10, 20, 30]\n"
            "  console.log(numbers.join(\", \"));   // Output: 10, 20, 30\n\n"
            "• C++:\n"
            "  vector<int> numbers = {10, 20, 30};\n"
            "  for (int val : numbers) {\n"
            "      cout << val << \" \";\n"
            "  }\n\n"
            "• Java:\n"
            "  int[] numbers = {10, 20, 30};\n"
            "  System.out.println(Arrays.toString(numbers)); // Output: [10, 20, 30]\n\n"
            "Performance:\n"
            "Printing all elements requires traversing the collection, taking O(n) linear time."
        )

    # 3. How to reverse an array / reverse string
    elif any(k in q for k in ["reverse array", "reverse an array", "invert array", "reverse string", "reverse"]):
        body = (
            "How to Reverse an Array (Two-Pointer Method):\n"
            "The optimal approach uses two pointers starting at opposite ends and swapping inward.\n\n"
            "Algorithm Steps:\n"
            "1. Initialize left = 0 and right = length - 1.\n"
            "2. While left < right, swap arr[left] with arr[right].\n"
            "3. Increment left (left++) and decrement right (right--).\n\n"
            "• Python Example:\n"
            "  def reverse_array(arr):\n"
            "      left, right = 0, len(arr) - 1\n"
            "      while left < right:\n"
            "          arr[left], arr[right] = arr[right], arr[left]\n"
            "          left += 1\n"
            "          right -= 1\n"
            "      return arr\n\n"
            "Complexity:\n"
            "• Time Complexity: O(n) because each element is visited once.\n"
            "• Space Complexity: O(1) in-place auxiliary space."
        )

    # 4. Invariant / two pointer / two sum
    elif any(k in q for k in ["invariant", "two pointer", "two sum", "pointer adjustment", "right--", "left++"]):
        body = (
            "Two-Pointer Invariant Explanation:\n"
            "When an array is sorted in ascending order:\n\n"
            "1. If numbers[left] + numbers[right] > target:\n"
            "   The current sum is strictly too large.\n"
            "   Because the array is sorted, numbers[left] is the smallest remaining number on the left side. "
            "Any element paired with numbers[right] will only produce a sum equal to or greater than the current sum. "
            "Therefore, numbers[right] can never participate in any valid pair. The only correct step is right--.\n\n"
            "2. If numbers[left] + numbers[right] < target:\n"
            "   The current sum is strictly too small.\n"
            "   Because numbers[right] is the largest candidate, pairing it with numbers[left] already fell short. "
            "Therefore, numbers[left] can never reach the target. The only correct step is left++.\n\n"
            "Complexity:\n"
            "• Time Complexity: O(n) with a single pass.\n"
            "• Space Complexity: O(1) in-place pointers."
        )

    # 5. Time and space complexity
    elif any(k in q for k in ["time complexity", "space complexity", "big o", "complexity"]):
        body = (
            "Time and Space Complexity Reference:\n\n"
            "• Array Index Access: O(1) constant time.\n"
            "• Linear Search: O(n) worst-case examining each item.\n"
            "• Binary Search (Sorted): O(log n) halving search space.\n"
            "• Two-Pointer Traversal: O(n) time, O(1) space.\n"
            "• Sorting:\n"
            "  - QuickSort / MergeSort: O(n log n) average time.\n"
            "  - Bubble / Insertion / Selection Sort: O(n^2) quadratic time.\n"
            "• Space Complexity:\n"
            "  - In-place algorithms require O(1) auxiliary memory.\n"
            "  - Recursive algorithms use O(depth) stack space."
        )

    # 6. Sorting algorithms
    elif any(k in q for k in ["sort", "sorting", "bubble", "merge sort", "quicksort"]):
        body = (
            "Overview of Sorting Algorithms:\n\n"
            "1. Bubble Sort: Compares adjacent elements and swaps them if out of order. Time: O(n^2), Space: O(1).\n"
            "2. Selection Sort: Repeatedly finds the minimum element and places it at the start. Time: O(n^2), Space: O(1).\n"
            "3. Insertion Sort: Builds sorted subarray element by element. Time: O(n^2), Space: O(1).\n"
            "4. Merge Sort: Divide and conquer algorithm dividing array in halves and merging sorted parts. Time: O(n log n), Space: O(n).\n"
            "5. QuickSort: Partitions elements around a pivot and sorts partitions recursively. Average Time: O(n log n), Space: O(log n)."
        )

    # 7. Searching / Binary Search
    elif any(k in q for k in ["search", "binary search", "linear search"]):
        body = (
            "Searching Algorithms:\n\n"
            "• Linear Search:\n"
            "  Examines elements sequentially from start to end.\n"
            "  Works on unsorted arrays. Time: O(n), Space: O(1).\n\n"
            "• Binary Search:\n"
            "  Prerequisite: Array must be sorted.\n"
            "  Compares target against midpoint: mid = (left + right) / 2.\n"
            "  If target == arr[mid], returns index.\n"
            "  If target < arr[mid], searches left: right = mid - 1.\n"
            "  If target > arr[mid], searches right: left = mid + 1.\n"
            "  Time Complexity: O(log n), Space: O(1)."
        )

    # 8. Recursion
    elif any(k in q for k in ["recursion", "recursive", "base case", "call stack"]):
        body = (
            "Understanding Recursion:\n"
            "Recursion is a programming technique where a function calls itself to solve smaller subproblems.\n\n"
            "Core Principles:\n"
            "1. Base Case: The terminating condition that returns without recursive calls, preventing infinite loops.\n"
            "2. Recursive Step: Breaks the problem into smaller self-similar subproblems.\n\n"
            "• Python Example (Factorial):\n"
            "  def factorial(n):\n"
            "      if n <= 1:\n"
            "          return 1\n"
            "      return n * factorial(n - 1)\n\n"
            "Stack Memory:\n"
            "Each recursive call consumes a stack frame, resulting in O(n) space complexity."
        )

    # 9. Trees & BST
    elif any(k in q for k in ["tree", "binary tree", "bst", "traversal", "inorder", "preorder"]):
        body = (
            "Binary Trees and Traversals:\n"
            "A tree is a non-linear data structure with nodes connected by edges.\n\n"
            "• Binary Search Tree (BST) Invariant:\n"
            "  All values in left subtree < node value < all values in right subtree.\n\n"
            "• Three Standard Traversals:\n"
            "  1. Inorder (Left, Root, Right): Produces sorted ascending order for BSTs.\n"
            "  2. Preorder (Root, Left, Right): Ideal for cloning or serializing trees.\n"
            "  3. Postorder (Left, Right, Root): Ideal for bottom-up operations like deletion and height calculation."
        )

    # 10. Recommendations / Next Topic
    elif any(k in q for k in ["recommend", "next", "what should i practice", "weakness", "suggest"]):
        body = (
            "Personalized DKT Learning Recommendation:\n"
            f"Based on your knowledge tracing curve, your recommended next focus is {rec_topic} at {rec_diff} difficulty.\n\n"
            f"Pedagogical Reason:\n{rec_reason}\n\n"
            "Suggested Next Steps:\n"
            f"1. Open the Practice Questions tab and select {rec_topic}.\n"
            "2. Solve 2-3 foundational problems to establish strong baseline mastery.\n"
            "3. Return to review your updated DKT probability curve on the Dashboard."
        )

    # 11. General DSA Guidance tailored to the query
    else:
        body = (
            f"Analysis for: \"{query}\"\n\n"
            f"When approaching this problem in {topic}:\n"
            "1. Clarify Inputs and Constraints: Identify array lengths, value ranges, and whether data is sorted.\n"
            "2. Choose the Optimal Structure: Determine whether an array, hash map, two-pointer window, or stack is required.\n"
            "3. State the Algorithm Invariant: Define what invariant must remain true across every loop iteration.\n"
            "4. Verify Edge Cases: Check empty collections, single elements, duplicates, and extreme boundaries.\n\n"
            "Tip: You can ask specific questions like 'how to declare array', 'how to print array', 'how to reverse array', or 'time complexity' to see code examples."
        )

    footer = f"\nAI Learning Style Note: You are categorized as a {style_name}. {style_guidance}"
    full_text = f"{header}\n{body}\n{footer}"
    return clean_markdown_symbols(full_text)
