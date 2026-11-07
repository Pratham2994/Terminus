# Recursive Insertion Sort

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> insertionSort(vector<int>& nums)`. **No loops**, and no built-in sort.

## What you need to do

Sort the numbers from small to big with **Insertion Sort**, using recursion instead of any loop.

## Example

[5, 4, 4, 1, 1] → **[1, 1, 4, 4, 5]**.

## How to solve it, step by step

Insertion Sort keeps the front part sorted and slides each new number left into its place. The loop version has two loops, so you need **two** recursive functions.

1. **`placeLast(a, j)`: slide a[j] left until it fits.** If j is 0, or a[j − 1] ≤ a[j], stop. Otherwise swap them and call `placeLast(a, j − 1)`.

   **Why:** the part before j is already sorted, so the new number only has to move left past bigger numbers. This replaces the inner loop.

2. **`insertion(a, i)`: insert every number from position i onwards.** If i equals n, stop. Otherwise call `placeLast(a, i)`, then `insertion(a, i + 1)`.

   **Why:** after placing a[i], the front part a[0..i] is sorted, so the next number can be placed the same way. This replaces the outer loop.

3. **Start with `insertion(a, 1)`.**

   **Why:** a single number, a[0], is already a sorted front part.

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

## How fast is it?

O(n²) in the worst case (numbers in reverse order), O(n) on an already sorted array, because each `placeLast` stops at once. The recursion can go about 2n calls deep; with n ≤ 1000 that is safe.

## Watch out for

- Stop on `a[j − 1] <= a[j]` (with the `=`). Equal numbers then keep their order.

## Walk through ([7, 4, 1])

- insertion(1): 7 > 4 → swap → [4, 7, 1].
- insertion(2): 7 > 1 → swap → [4, 1, 7]; 4 > 1 → swap → [1, 4, 7].
- insertion(3): i = n → stop.

Answer: **[1, 4, 7]**.
