# Count all subsequences with sum K

> Solve it on takeUforward's free practice page (the Problem link above). The function is `int countSubsequenceWithTargetSum(vector<int>& nums, int k)`.

## The problem

Given nums (length ≤ 20, values 1…100) and k (1…2000), count the **non-empty** subsequences whose sum is exactly k. Equal values at different positions count as different subsequences.

Examples: [4, 9, 2, 5, 1], k = 10 → **2** ([9, 1] and [4, 5, 1]). [4, 2, 10, 5, 1, 3], k = 5 → **3**.

## The idea: pick or skip, and add up the ways

This is the same pick-or-skip recursion as "Check if there exists a subsequence with sum K", but we **count** instead of stopping at the first success:

`countWays(i, k)` = number of ways to choose elements from index i onwards with sum k.

- Pick nums[i] → countWays(i + 1, k − nums[i]).
- Skip nums[i] → countWays(i + 1, k).
- Answer = pick + skip.

Base cases:

- i == n → 1 if k == 0, else 0. We check at the **end**, not when k hits 0 early, because skipping all the remaining elements is exactly one way, and the end of the array is where that way is counted.
- k < 0 → 0. Values are positive, so it can only get worse.

k ≥ 1 means the empty subsequence (sum 0) is never counted.

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

## Complexity

- Time: O(2ⁿ), about 10⁶ calls for n = 20.
- Space: O(n) recursion depth.

## Going further

With memoisation on (i, k), this becomes O(n · k). It is the DP line's "Count subsets with sum K".

## Dry run ([2, 3, 5], k = 5)

- Pick 2 → need 3: pick 3 → need 0, skip 5 → **1** way. Skip 3 → need 3 from [5] → 0.
- Skip 2 → need 5: pick 3 → need 2 from [5] → 0. Skip 3: pick 5 → **1** way.

Answer: **2** ([2, 3] and [5]).
