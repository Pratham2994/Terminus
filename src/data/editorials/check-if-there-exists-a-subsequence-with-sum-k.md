# Check if there exists a subsequence with sum K

> Solve it on takeUforward's free practice page (the Problem link above). The function is `bool checkSubsequenceSum(vector<int>& nums, int k)`.

## What you need to do

Can you pick some of the numbers (keeping their order, not necessarily next to each other) so that they add up to exactly k? Return true or false. There are at most 20 numbers, each from 1 to 100.

## Examples

- [1, 2, 3, 4, 5], k = 8 → **true** (3 + 5)
- [4, 3, 9, 2], k = 10 → **false**

## How to solve it, step by step

1. **Each number is either picked or skipped.** Write `canMake(i, k)`: "can the numbers from index i onwards make k?"

   **Why:** two choices per number cover every possible group.

2. **Pick:** try `canMake(i + 1, k − nums[i])`. **Skip:** try `canMake(i + 1, k)`. If either works, return true.

   **Why:** picking uses up part of k; skipping leaves k as it is.

3. **If k is exactly 0, return true.**

   **Why:** the picked numbers add up exactly.

4. **If you run out of numbers, or k goes below 0, return false.**

   **Why:** all numbers are positive, so a negative k can never come back up to 0.

5. **Use `||` between the two tries.**

   **Why:** it stops at the first success, so you do not search further than needed.

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

## How fast is it?

Up to 2ⁿ choices, about a million for n = 20: fine. Recursion depth: n.

## Going further

This is the Subset Sum problem. For bigger inputs, remember answers for each (i, k), or use the DP version on the Dynamic Programming line ("Subset sum equals to target"), which is O(n · k).

## Walk through ([4, 3, 9, 2], k = 10)

- Pick 4 → need 6 from [3, 9, 2]: 3 leaves 3 (9 too big, 2 leaves 1) ✗; without 3: 9 too big, 2 leaves 4 ✗.
- Skip 4 → need 10 from [3, 9, 2]: 3 + 9 = 12, 3 + 2 = 5, 9 + 2 = 11 ✗.

Answer: **false**.
