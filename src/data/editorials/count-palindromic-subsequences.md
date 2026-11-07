# Count Palindromic Subsequences

> Solve it on takeUforward's free practice page (the Problem link above). The function is `int countPalSubseq(const string& s)`. LeetCode 2484 has a **different** problem with the same name (only length-5 palindromes), so do not use it here.

## What you need to do

Count **all** the ways to pick letters from s (keeping their order) that read the same forwards and backwards. Picks at different positions count separately, even if they spell the same thing. s has at most 30 letters.

## Examples

- "abcd" → **4** (each single letter)
- "aab" → **4** ("a", "a", "b", "aa")

## How to solve it, step by step

1. **The slow idea:** check every pick. For 30 letters that is about a billion picks: too slow.

2. **Let `dp[i][j]` = the number of palindromic picks inside s[i..j].** A single letter: `dp[i][i] = 1`.

   **Why:** a bigger range can be built from smaller ranges, which is the heart of dynamic programming.

3. **Count by the two ends.** dp[i + 1][j] counts the picks that do not use s[i]. dp[i][j − 1] counts the picks that do not use s[j]. The picks that use **neither** end are in both, so they are counted twice: that is dp[i + 1][j − 1].

4. **If s[i] ≠ s[j]:** no palindrome can use both ends, so
   dp[i][j] = dp[i + 1][j] + dp[i][j − 1] − dp[i + 1][j − 1].

   **Why:** subtracting removes the double count from step 3.

5. **If s[i] == s[j]:** you can also wrap both ends around any palindrome inside (dp[i + 1][j − 1] of them), plus the pair s[i] s[j] on its own (1 more). The wrapped ones exactly cancel the subtraction, so
   dp[i][j] = dp[i + 1][j] + dp[i][j − 1] + 1.

6. **Fill i from the end backwards,** so dp[i + 1][…] is ready before you need it.

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

## How fast is it?

O(n²) time and memory.

## Watch out for

- When j = i + 1, the inside s[i + 1..j − 1] is empty; its count is 0. The code guards that case.
- The biggest answer (30 × 'a') is 2³⁰ − 1, which fits in `int`; the table uses `long long` to stay safe in the middle steps.

## Walk through ("aab")

- Single letters: 1 each.
- "aa" (equal ends): 1 + 1 + 1 = 3 ("a", "a", "aa").
- "ab" (different ends): 1 + 1 − 0 = 2.
- "aab" (a ≠ b): dp("ab") + dp("aa") − dp("a") = 2 + 3 − 1 = **4**.

(Tested on 2 000 random strings against checking every pick.)
