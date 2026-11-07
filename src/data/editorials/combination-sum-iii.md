# Combination Sum III

> Solve it on [LeetCode 216 · Combination Sum III](https://leetcode.com/problems/combination-sum-iii/).

## What you need to do

Find every way to pick **k different digits from 1 to 9** that add up to n. Each digit can be used once, and the same group must not appear twice.

## Examples

- k = 3, n = 7 → **[[1, 2, 4]]**
- k = 3, n = 9 → **[[1, 2, 6], [1, 3, 5], [2, 3, 4]]**

## How to solve it, step by step

1. **Always pick digits in increasing order.** After picking d, the next digit must be at least d + 1.

   **Why:** this stops repeats like [1, 2, 4] and [2, 1, 4]: only one order of each group is ever built.

2. **Write `build(start, k, n)`:** choose the remaining digits from start to 9, with n still to reach.

3. **When you have k digits, keep the group only if n is exactly 0.**

   **Why:** the group must add up to n exactly.

4. **Otherwise, try every digit d from start to 9, but only while d ≤ n.** Add d, recurse with d + 1 and n − d, then remove d.

   **Why:** a digit bigger than what is left would overshoot, and so would every bigger digit after it. Stopping early saves work.

## Code (C++)

```cpp
class Solution {
    void build(int start, int k, int n, vector<int>& cur, vector<vector<int>>& out) {
        if ((int)cur.size() == k) {
            if (n == 0) out.push_back(cur);
            return;
        }
        for (int d = start; d <= 9 && d <= n; d++) {
            cur.push_back(d);
            build(d + 1, k, n - d, cur, out);
            cur.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum3(int k, int n) {
        vector<vector<int>> out;
        vector<int> cur;
        build(1, k, n, cur, out);
        return out;
    }
};
```

## How fast is it?

There are at most 126 groups of digits to look at (choosing k of 9), so it is instant. In general: O(C(9, k) · k).

## Watch out for

- If n is too big (k = 3, n = 30; the most is 7 + 8 + 9 = 24), the answer is [].

## Walk through (k = 3, n = 7)

- 1, 2, then need 4: 3 gives 6 ✗, 4 ✓ → [1, 2, 4].
- 1, 3, then need 3: the next digit must be at least 4 → nothing.
- 2, 3, then need 2: nothing.

Answer: **[[1, 2, 4]]**. (Tested for every k = 1…9 and n = 1…60 against trying all 512 groups of digits.)
