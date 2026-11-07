# Longest Palindromic Substring

> Solve it on [LeetCode 5 · Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/).

## The problem

Return the longest substring of s that reads the same forwards and backwards. n ≤ 1000. If two have the same length, either is accepted.

Examples: "babad" → **"bab"** (or "aba"). "cbbd" → **"bb"**.

## Brute force

Check every substring (O(n²) of them), and test each for being a palindrome in O(n).

- Time: O(n³), about 10⁹ for n = 1000. Too slow.

## The better idea: expand around the centre

Every palindrome is symmetric around its **centre**:

- odd length ("aba"): the centre is one character;
- even length ("abba"): the centre is the gap between two characters.

So there are only 2n − 1 possible centres. For each one, expand outwards while the characters on both sides match. The longest expansion over all centres is the answer.

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

## Complexity

- Time: O(n²): 2n centres, each expanding up to n/2 steps. Fast enough for n ≤ 1000.
- Space: O(1).

## Going further

- **DP**: dp[i][j] = s[i] == s[j] and dp[i+1][j−1]. It is also O(n²), but uses O(n²) memory.
- **Manacher's algorithm** solves it in O(n). It is worth reading once, but rarely expected in interviews.

## Edge cases

- One character → itself (bestLen starts at 1).
- After the while loop, l and r have gone **one step too far**, so the palindrome is s[l+1..r−1].

## Dry run ("cbbd")

- c = 0: odd "c" (1); even c≠b.
- c = 1: odd "b"; even s[1] = s[2] = b → expand to l = 0, r = 3: c ≠ d, stop → "bb", length 2, best.
- c = 2, c = 3: nothing longer.

Answer: **"bb"**.
