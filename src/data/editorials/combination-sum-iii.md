# Combination Sum III

> Solve it on [LeetCode 216 · Combination Sum III](https://leetcode.com/problems/combination-sum-iii/).

## The problem

Find all combinations of **k distinct digits from 1 to 9** that add up to n. Each digit is used at most once, and no combination may appear twice.

Examples: k = 3, n = 7 → **[[1,2,4]]**. k = 3, n = 9 → **[[1,2,6],[1,3,5],[2,3,4]]**.

## The idea: choose digits in increasing order

To avoid duplicates such as [1,2,4] and [2,1,4], only build combinations in **increasing** order. After choosing digit d, the next digit must be at least d + 1.

`build(start, k, n)`: choose the remaining digits from start…9, with remaining sum n.

- When the combination has k digits: keep it only if n == 0.
- Otherwise try every d from start to 9, while d ≤ n (a larger digit would overshoot the sum).

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

## Complexity

- At most C(9, k) ≤ 126 combinations are ever built, so time and space are tiny. In general, O(C(9, k) · k).

## Edge cases

- n too large (k = 3, n = 30: the most 3 digits can make is 7 + 8 + 9 = 24) → [].
- k larger than possible → [].
- `d <= n` prunes branches early. The answer is correct without it, but faster with it.

## Dry run (k = 3, n = 7)

- 1 → 2 → need 4: d = 3 gives 3 ≠ 4 at size 3 ✗, d = 4 ✓ → [1,2,4].
- 1 → 3 → need 3: d starts at 4 > 3, nothing.
- 2 → 3 → need 2: nothing.

Answer: **[[1,2,4]]**. (Tested for every k = 1…9 and n = 1…60 against trying all 512 digit subsets.)
