# Count all subsequences with sum K

> Solve it on takeUforward's free practice page (the Problem link above). The function is `int countSubsequenceWithTargetSum(vector<int>& nums, int k)`.

## What you need to do

Count how many ways you can pick some of the numbers (at least one) so that they add up to exactly k. Equal numbers at different positions count as different picks.

## Examples

- [4, 9, 2, 5, 1], k = 10 → **2** (9 + 1, and 4 + 5 + 1)
- [4, 2, 10, 5, 1, 3], k = 5 → **3**

## How to solve it, step by step

1. **Same pick-or-skip idea as "Check if there exists a subsequence with sum K",** but count instead of stopping at the first success.

   **Why:** every group is one path of pick/skip choices, so counting the paths that work counts the groups.

2. **`countWays(i, k)` = (ways if you pick nums[i]) + (ways if you skip it).**

   **Why:** the two choices lead to different groups, so their counts add up.

3. **At the end of the array, return 1 if k is 0, else 0.**

   **Why:** reaching the end with k = 0 is exactly one finished group. Checking only at the end (not as soon as k hits 0) makes sure each group is counted once.

4. **If k goes below 0, return 0.**

   **Why:** the numbers are positive, so k cannot come back up.

## Code (C++)

```cpp
class Solution {
    int countWays(vector<int>& nums, int i, int k) {
        if (i == (int)nums.size()) return k == 0 ? 1 : 0;
        if (k < 0) return 0;                      // all values are positive
        return countWays(nums, i + 1, k - nums[i])   // pick
             + countWays(nums, i + 1, k);            // skip
    }
public:
    int countSubsequenceWithTargetSum(vector<int>& nums, int k) {
        return countWays(nums, 0, k);
    }
};
```

## How fast is it?

Up to 2ⁿ paths, about a million for n = 20. Recursion depth: n.

## Going further

Remembering answers for each (i, k) makes it O(n · k). That is "Count subsets with sum K" on the DP line.

## Walk through ([2, 3, 5], k = 5)

- Pick 2 → need 3: pick 3 → need 0, skip 5 → **1** way. Skip 3 → need 3 from [5] → 0.
- Skip 2 → need 5: pick 3 → need 2 from [5] → 0. Skip 3 → pick 5 → **1** way.

Answer: **2** ([2, 3] and [5]).
