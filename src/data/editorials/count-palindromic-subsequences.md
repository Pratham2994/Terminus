# Count Palindromic Subsequences

> Solve it on takeUforward's free practice page (the Problem link above). The function is `int countPalSubseq(const string& s)`. LeetCode 2484 has a **different** problem with the same name (it counts only length-5 palindromes, mod 10⁹+7), so do not use it for this station.

## The problem

Count **all** palindromic subsequences of s (n ≤ 30, lowercase). Subsequences at different positions count separately, even if they spell the same string. No modulo is needed.

Examples: "abcd" → **4** (each single letter). "aab" → **4** ("a", "a", "b", "aa").

## Brute force

There are 2ⁿ − 1 non-empty subsequences. Check each one.

- For n = 30, about 10⁹ subsequences, each O(n) to check. Too slow.

## The DP

Let `dp[i][j]` = the number of palindromic subsequences inside s[i..j].

Split by whether the subsequences use s[i] and s[j]:

- dp[i+1][j] counts those that **do not use s[i]**.
- dp[i][j−1] counts those that **do not use s[j]**.
- The ones that use **neither** are counted in both. That is dp[i+1][j−1].

**If s[i] ≠ s[j]:** no palindrome can use both ends, so
dp[i][j] = dp[i+1][j] + dp[i][j−1] − dp[i+1][j−1].

**If s[i] == s[j]:** palindromes using **both** ends are s[i] + (any palindrome inside) + s[j], which is dp[i+1][j−1] of them, plus the pair s[i]s[j] on its own, which is 1 more. Adding these to the formula above cancels the subtraction:
dp[i][j] = dp[i+1][j] + dp[i][j−1] + 1.

Base case: dp[i][i] = 1 (one letter).

## Code (C++)

```cpp
class Solution {
public:
    int countPalSubseq(const string& s) {
        int n = s.size();
        vector<vector<long long>> dp(n, vector<long long>(n, 0));   // dp[i][j]: count in s[i..j]
        for (int i = n - 1; i >= 0; i--) {
            dp[i][i] = 1;
            for (int j = i + 1; j < n; j++) {
                if (s[i] == s[j])
                    dp[i][j] = dp[i + 1][j] + dp[i][j - 1] + 1;
                else
                    dp[i][j] = dp[i + 1][j] + dp[i][j - 1]
                             - (i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0);
            }
        }
        return (int)dp[0][n - 1];
    }
};
```

## Complexity

- Time: O(n²).
- Space: O(n²).

## Edge cases

- The largest answer: 30 × 'a' gives 2³⁰ − 1 = 1 073 741 823, which still fits in `int`. The table uses `long long` so the middle steps stay safe.
- When j = i + 1, the inner range s[i+1..j−1] is empty. Its count is 0, which is what the `?:` guard returns.
- i runs **downwards** so that dp[i+1][·] is ready before dp[i][·].

## Dry run ("aab")

- dp[0][0] = dp[1][1] = dp[2][2] = 1.
- dp[0][1] ("aa", equal ends) = 1 + 1 + 1 = 3 ("a", "a", "aa").
- dp[1][2] ("ab") = 1 + 1 − 0 = 2.
- dp[0][2] ("aab", a ≠ b) = dp[1][2] + dp[0][1] − dp[1][1] = 2 + 3 − 1 = **4**.

(Tested on 2 000 random strings against checking every subsequence.)
