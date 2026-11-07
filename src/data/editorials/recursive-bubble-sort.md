# Recursive Bubble Sort

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> bubbleSort(vector<int>& nums)`. No built-in sort.

## What you need to do

Sort the numbers from small to big with **Bubble Sort, written recursively**, and return them.

## Example

[7, 4, 1, 5, 3] → **[1, 3, 4, 5, 7]**.

## How to solve it, step by step

1. **One "pass" walks left to right and swaps every neighbouring pair that is in the wrong order.**

   **Why:** after one pass, the biggest number has "bubbled" all the way to the end, so it is in its final place.

2. **So after a pass over the first n numbers, only the first n − 1 still need sorting.** Write `bubble(a, n)` as: do one pass, then call `bubble(a, n − 1)`.

   **Why:** that is the same problem, one number smaller. That is the recursive step.

3. **Base case: n ≤ 1.** Nothing to sort.

   **Why:** one number is always sorted, and the recursion must stop somewhere.

4. **Early exit: if a pass made no swaps, stop.**

   **Why:** no swaps means everything is already in order. On a sorted array, this makes the sort take only one pass.

## Code (C++)

```cpp
class Solution {
    void bubble(vector<int>& a, int n) {
        if (n <= 1) return;
        bool swapped = false;
        for (int i = 0; i + 1 < n; i++)            // one pass
            if (a[i] > a[i + 1]) { swap(a[i], a[i + 1]); swapped = true; }
        if (!swapped) return;                       // already sorted
        bubble(a, n - 1);                           // largest is now at a[n-1]
    }
public:
    vector<int> bubbleSort(vector<int>& nums) {
        bubble(nums, nums.size());
        return nums;
    }
};
```

The pass itself could also be recursive, but that is only needed if your judge forbids every loop. The usual "recursive bubble sort" recurses over the passes, as above.

## How fast is it?

O(n²) in general, and O(n) on an already sorted array (thanks to the early exit). The recursion goes up to n calls deep, so O(n) memory.

## Watch out for

- Swap only when `>`, not `>=`. Equal numbers then keep their order (the sort is "stable").

## Walk through ([7, 4, 1, 5, 3])

- bubble(5): pass → [4, 1, 5, 3, 7].
- bubble(4): pass → [1, 4, 3, 5, 7].
- bubble(3): pass → [1, 3, 4, 5, 7].
- bubble(2): pass, no swaps → stop.

Answer: **[1, 3, 4, 5, 7]**.
