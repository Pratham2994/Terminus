# Longest Palindromic Substring

> Solve it on [LeetCode 5 · Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/).

## What you need to do

Find the longest connected piece of s that reads the same forwards and backwards (a palindrome). s has at most 1000 characters. If two are equally long, either is fine.

## Examples

- "babad" → **"bab"** (or "aba")
- "cbbd" → **"bb"**

## How to solve it, step by step

1. **The slow idea:** check every piece and test whether it is a palindrome. That is O(n³), about a billion steps for n = 1000.

2. **Every palindrome mirrors around its middle.** The middle is either one character ("aba") or the gap between two characters ("abba").

   **Why:** this means you can grow palindromes outwards from their middle instead of testing every piece.

3. **There are only 2n − 1 possible middles.** For each one, step outwards while the characters on both sides match.

   **Why:** you stop as soon as they differ, so you never test a piece that cannot work.

4. **Keep the longest one found.**

## Code (C++)

```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        int bestStart = 0, bestLen = 1, n = s.size();
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
            // the palindrome is s[l+1 .. r-1], length r - l - 1
            if (r - l - 1 > bestLen) { bestLen = r - l - 1; bestStart = l + 1; }
        };
        for (int c = 0; c < n; c++) {
            expand(c, c);      // odd length, centre at c
            expand(c, c + 1);  // even length, centre between c and c+1
        }
        return s.substr(bestStart, bestLen);
    }
};
```

## How fast is it?

2n − 1 middles, each growing up to n/2 steps: O(n²) time, fast enough for n = 1000. O(1) memory.

## Watch out for

- When the growing loop stops, l and r have gone **one step too far**. The palindrome is from l + 1 to r − 1.
- One character is its own answer.

## Going further

- A DP table (`dp[i][j]` = s[i] == s[j] and `dp[i+1][j−1]`) also takes O(n²), but uses O(n²) memory.
- Manacher's algorithm does it in O(n). It is worth reading once, but rarely asked.

## Walk through ("cbbd")

- Middle at "c": just "c". Gap c|b: c ≠ b.
- Middle at the first "b": just "b". Gap b|b: they match → "bb". Next step: c ≠ d → stop. Length 2, the best.
- The rest find nothing longer.

Answer: **"bb"**.
