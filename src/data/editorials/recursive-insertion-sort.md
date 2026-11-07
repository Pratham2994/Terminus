# Recursive Insertion Sort

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> insertionSort(vector<int>& nums)`. **No loops** and no built-in sort.

## The problem

Sort nums in non-decreasing order with **Insertion Sort**, using recursion instead of every loop. n ≤ 1000, values may repeat.

Example: [5, 4, 4, 1, 1] → **[1, 1, 4, 4, 5]**.

## Insertion Sort in one sentence

Keep the front part a[0..i−1] sorted. Take the next value a[i] and slide it left past every bigger value, until it sits in place. Now a[0..i] is sorted.

The loop version has **two** loops: the outer one over i, and the inner one that slides a[i] left. Without loops, **both** become recursive functions.

## Two recursive functions

**`placeLast(a, j)`** slides a[j] left into the sorted part before it:

- Base case: j == 0 (it is at the front), or a[j−1] ≤ a[j] (it is already in place).
- Otherwise swap a[j−1] and a[j], then `placeLast(a, j − 1)`.

**`insertion(a, i)`**: a[0..i−1] is sorted, so insert everything from i onwards:

- Base case: i == n. Everything is inserted.
- Otherwise `placeLast(a, i)`, then `insertion(a, i + 1)`.

Start with `insertion(a, 1)`, because a single element a[0] is already sorted.

## Code (C++)

```cpp
class Solution {
    // a[0..j-1] is sorted; slide a[j] left into place
    void placeLast(vector<int>& a, int j) {
        if (j == 0 || a[j - 1] <= a[j]) return;
        swap(a[j - 1], a[j]);
        placeLast(a, j - 1);
    }
    // a[0..i-1] is sorted; insert a[i], a[i+1], ...
    void insertion(vector<int>& a, int i) {
        if (i >= (int)a.size()) return;
        placeLast(a, i);
        insertion(a, i + 1);
    }
public:
    vector<int> insertionSort(vector<int>& nums) {
        insertion(nums, 1);
        return nums;
    }
};
```

## Complexity

- Time: O(n²) worst case (reversed input), O(n) best case (sorted input: every `placeLast` stops at once).
- Space: O(n) recursion depth. `insertion` goes n calls deep, and `placeLast` up to n more, so with n ≤ 1000 the stack is safe.

## Edge cases

- `<=` in the base case keeps equal values in their original order: the sort is stable.
- One element: `insertion(a, 1)` returns at once.

## Dry run ([7, 4, 1])

- insertion(1): placeLast(1): 7 > 4 → swap → [4, 7, 1].
- insertion(2): placeLast(2): 7 > 1 → swap → [4, 1, 7]; placeLast(1): 4 > 1 → swap → [1, 4, 7].
- insertion(3): i == n, stop.

Answer: **[1, 4, 7]**.
