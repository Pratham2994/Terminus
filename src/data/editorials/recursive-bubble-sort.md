# Recursive Bubble Sort

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> bubbleSort(vector<int>& nums)`. No built-in sort.

## The problem

Sort nums in non-decreasing order with **Bubble Sort written recursively**, and return it. n ≤ 1000, values may repeat.

Example: [7, 4, 1, 5, 3] → **[1, 3, 4, 5, 7]**.

## Bubble Sort in one sentence

One **pass** walks left to right and swaps every neighbouring pair that is out of order. After the pass, the **largest** value has "bubbled" to the last position, which is now final.

## Making it recursive

The loop version runs passes on shorter and shorter prefixes: n, then n − 1, …

So define `bubble(a, n)` = "sort the first n elements":

1. **Base case:** n ≤ 1. Nothing to sort.
2. Do **one pass** over a[0..n−1]. The largest of them lands at a[n−1].
3. Recurse on the first n − 1 elements: `bubble(a, n − 1)`.

**Early exit:** if a pass made no swaps, the prefix is already sorted, so stop. On sorted input this makes the sort O(n).

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

The pass itself can be recursive too, as `pass(a, i, n)` that compares a[i] and a[i+1], then calls `pass(a, i + 1, n)`. That is only needed if your judge forbids every loop. The standard "recursive bubble sort" recurses over the passes, as above.

## Complexity

- Time: O(n²) in the worst and average case, and O(n) when the input is already sorted, thanks to the early exit.
- Space: O(n) recursion depth, at most n calls.

## Edge cases

- Use `>` and not `>=` in the comparison. Equal values never swap, so the sort stays **stable**.
- One element → returned as is.

## Dry run ([7, 4, 1, 5, 3])

- bubble(5): pass → [4, 1, 5, 3, 7].
- bubble(4): pass → [1, 4, 3, 5, 7].
- bubble(3): pass → [1, 3, 4, 5, 7].
- bubble(2): pass, no swaps → stop.

Answer: **[1, 3, 4, 5, 7]**.
