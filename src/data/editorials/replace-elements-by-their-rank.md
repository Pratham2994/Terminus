# Replace Elements by Their Rank

> Solve it on [LeetCode 1331 · Rank Transform of an Array](https://leetcode.com/problems/rank-transform-of-an-array/).

## The problem

Replace every element with its **rank**: 1 for the smallest value, then 2, 3, … Equal values get the **same** rank, and ranks have no gaps.

Examples: [40, 10, 20, 30] → **[4, 1, 2, 3]**. [100, 100, 100] → **[1, 1, 1]**. [37, 12, 28, 9, 100, 56, 80, 5, 12] → **[5, 3, 4, 2, 8, 6, 7, 1, 3]**.

## Brute force

For each element, count the **distinct** values smaller than it, then add 1.

- Time: O(n²).

## The better idea: sort the distinct values

1. Copy the array, sort it, and remove duplicates (`unique` + `erase`).
2. Each value's rank is its position in this sorted list + 1. Find it with binary search (`lower_bound`).

You can also store value → rank in a hash map. The idea is the same.

## Code (C++)

```cpp
class Solution {
public:
    vector<int> arrayRankTransform(vector<int>& arr) {
        vector<int> sorted = arr;
        sort(sorted.begin(), sorted.end());
        sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());
        vector<int> ans;
        for (int x : arr)
            ans.push_back(lower_bound(sorted.begin(), sorted.end(), x) - sorted.begin() + 1);
        return ans;
    }
};
```

## Complexity

- Time: O(n log n).
- Space: O(n).

## Edge cases

- Empty array → empty answer.
- Duplicates must be removed **before** ranking. Otherwise [10, 10, 20] would give 20 the rank 3 instead of 2.

## Why is it on the Heaps line?

You can also rank values by popping them from a min-heap in order and raising the rank only when the value changes. Sorting does the same job more simply.

## Dry run ([40, 10, 20, 30])

- Sorted distinct values: [10, 20, 30, 40].
- 40 → index 3 → rank 4. 10 → 1. 20 → 2. 30 → 3.

Answer: **[4, 1, 2, 3]**.
