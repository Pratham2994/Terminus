# Check if there exists a subsequence with sum K

> Solve it on takeUforward's free practice page (the Problem link above). The function is `bool checkSubsequenceSum(vector<int>& nums, int k)`.

## The problem

Given nums (length ≤ 20, values 1…100) and k (1…2000), return true if **some subsequence** (any subset of elements, keeping order) sums to exactly k.

Examples: [1, 2, 3, 4, 5], k = 8 → **true** ([3, 5]). [4, 3, 9, 2], k = 10 → **false**.

## The idea: pick or skip

Every element is either **in** the subsequence or **not**. That gives a binary recursion:

`canMake(i, k)` = "can elements from index i onwards make sum k?"

- **Pick** nums[i]: canMake(i + 1, k − nums[i]).
- **Skip** nums[i]: canMake(i + 1, k).

Base cases:

- k == 0 → true. We have chosen elements that add up exactly. Because k ≥ 1 at the start, at least one element was picked.
- i == n, or k < 0 → false. All values are positive, so once k is negative, adding more cannot help.

`||` stops at the first true, so we stop as soon as one subsequence works.

## Code (C++)

```cpp
class Solution {
    bool canMake(vector<int>& nums, int i, int k) {
        if (k == 0) return true;
        if (i == (int)nums.size() || k < 0) return false;
        return canMake(nums, i + 1, k - nums[i])   // pick
            || canMake(nums, i + 1, k);            // skip
    }
public:
    bool checkSubsequenceSum(vector<int>& nums, int k) {
        return canMake(nums, 0, k);
    }
};
```

## Complexity

- Time: O(2ⁿ) worst case, about 10⁶ for n = 20. Fine.
- Space: O(n) recursion depth.

## Going further

This is the **Subset Sum** problem. With bigger n, memoise on (i, k), or use the DP on the Dynamic Programming line ("Subset sum equals to target"), which is O(n · k).

## Dry run ([4, 3, 9, 2], k = 10)

- Pick 4 → need 6 from [3, 9, 2]: pick 3 → need 3 from [9, 2]: 9 is too big, 2 leaves 1 → fail; skip 3 → need 6 from [9, 2] → fail.
- Skip 4 → need 10 from [3, 9, 2]: 3 + 9 = 12, 3 + 2 = 5, 9 + 2 = 11 → fail.

Answer: **false**.
