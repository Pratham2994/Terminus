# Replace Elements by Their Rank

> Solve it on [LeetCode 1331 · Rank Transform of an Array](https://leetcode.com/problems/rank-transform-of-an-array/).

## What you need to do

Replace every number with its **rank**: 1 for the smallest value, 2 for the next, and so on. Equal numbers get the **same** rank, and there are no gaps.

## Examples

- [40, 10, 20, 30] → **[4, 1, 2, 3]**
- [100, 100, 100] → **[1, 1, 1]**

## How to solve it, step by step

1. **Copy the array, sort the copy, and remove repeats** (`unique` + `erase`).

   **Why:** in the sorted list of different values, a value's position tells you how many smaller values there are.

2. **A number's rank is its position in that list, plus 1.** Find the position with binary search (`lower_bound`).

   **Why:** positions start at 0, ranks start at 1.

3. **Write the rank back for every number.**

(A hash map from value to rank works the same way.)

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

## How fast is it?

Sorting is O(n log n); each binary search is O(log n). Memory: O(n) for the copy.

## Watch out for

- Remove repeats **before** ranking. Otherwise [10, 10, 20] gives 20 the rank 3 instead of 2.
- An empty array gives an empty answer.

## Why is it on the Heaps line?

You could also pop the values from a min-heap in order, raising the rank only when the value changes. Sorting does the same thing more simply.

## Walk through ([40, 10, 20, 30])

Sorted, different values: [10, 20, 30, 40]. 40 → position 3 → rank 4; 10 → 1; 20 → 2; 30 → 3. Answer: **[4, 1, 2, 3]**.
