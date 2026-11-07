# Maximum Sum Combination

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> maxSumCombinations(vector<int>& nums1, vector<int>& nums2, int k)`.

## What you need to do

A combination is one number from nums1 plus one number from nums2. Return the **k biggest** combinations, biggest first. Pairs at different positions count separately, even if their sums are equal.

## Example

nums1 = [7, 3], nums2 = [1, 6], k = 2 → **[13, 9]** (7 + 6 and 3 + 6).

## How to solve it, step by step

1. **The slow idea:** make every sum and sort. With 100 000 numbers in each array, that is 10¹⁰ sums: impossible.

2. **Sort both arrays from big to small.** Picture a grid where cell (i, j) holds a[i] + b[j].

   **Why:** the biggest sum is now at (0, 0), and sums only get smaller as you go right or down.

3. **The next biggest sum is always right next to (right of, or below) a cell you already took.**

   **Why:** any other cell has a bigger neighbour above or to its left that has not been taken yet.

4. **So use a max-heap of "frontier" cells.** Start with (0, 0). Pop the biggest, add it to the answer, then push its right and down neighbours.

5. **Keep a "seen" set of cells.**

   **Why:** cell (i + 1, j + 1) can be reached from two cells, but it must enter the heap only once.

6. **Stop after k pops.**

## Code (C++)

```cpp
class Solution {
public:
    vector<int> maxSumCombinations(vector<int>& nums1, vector<int>& nums2, int k) {
        vector<int> a = nums1, b = nums2;
        sort(a.rbegin(), a.rend());                    // descending
        sort(b.rbegin(), b.rend());
        priority_queue<tuple<int, int, int>> heap;     // (sum, i, j)
        set<pair<int, int>> seen;
        heap.push({a[0] + b[0], 0, 0});
        seen.insert({0, 0});
        vector<int> out;
        while ((int)out.size() < k && !heap.empty()) {
            auto [s, i, j] = heap.top();
            heap.pop();
            out.push_back(s);
            if (i + 1 < (int)a.size() && seen.insert({i + 1, j}).second)
                heap.push({a[i + 1] + b[j], i + 1, j});
            if (j + 1 < (int)b.size() && seen.insert({i, j + 1}).second)
                heap.push({a[i] + b[j + 1], i, j + 1});
        }
        return out;
    }
};
```

## How fast is it?

Sorting: O(n log n + m log m). Then k pops and at most 2k pushes: O(k log k). Memory: O(k).

## Watch out for

- `seen.insert(...).second` is true only when the cell is new: one line both checks and marks it.
- Equal sums from different cells all count; "seen" tracks positions, not sums.

## Walk through (a = [7, 3], b = [6, 1], k = 2)

Take (0, 0) = 13 → [13]. Push (1, 0) = 9 and (0, 1) = 8. Take 9 → [13, 9]. Done.

Answer: **[13, 9]**. (Tested on 3 000 random arrays against making and sorting every sum.)
