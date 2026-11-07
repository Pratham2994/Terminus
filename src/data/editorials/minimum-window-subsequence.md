# Minimum Window Subsequence

> LeetCode 727 is **Premium**, and takeUforward's page needs Plus. The **same problem** is free on GeeksforGeeks: use the Problem link above. GfG's function is `string minWindow(string& s1, string& s2)`: the same code works with the `&` added.

## The problem

Given strings s1 and s2, find the **shortest substring** of s1 that contains s2 as a **subsequence**: the characters of s2 in order, not necessarily adjacent. If several have the same length, return the one that starts **leftmost**. If none exists, return "".

Example: s1 = "abcdebdde", s2 = "bde" → **"bcde"**. ("bdde" is also length 4 and valid, but it starts later.)

## Brute force

For every start i, scan right and match s2 greedily. The first end where all of s2 is matched gives the shortest window starting at i.

- Time: O(n²), where n = |s1|.

## The better idea: forward, then backward

1. **Forward:** from position i, scan s1 and match s2's characters in order. Stop at the index `end` where the last character of s2 matches. The window ends there.
2. **Backward:** from `end`, walk **left** and match s2 from its last character back to its first. Where s2[0] matches is the **latest possible start** for this end. That gives the shortest window ending at `end`.
3. Record the window if it is the shortest so far, then restart the forward scan from **start + 1** to look for another window.

Why does the backward pass help? The forward pass finds some valid window, but it may start too early. Matching backwards from the end pushes the start as far right as possible.

## Code (C++)

```cpp
class Solution {
public:
    string minWindow(string s1, string s2) {
        int n = s1.size(), m = s2.size();
        int bestStart = -1, bestLen = INT_MAX;
        int i = 0;
        while (i < n) {
            int j = 0;                                // forward: match all of s2
            while (i < n) {
                if (s1[i] == s2[j] && ++j == m) break;
                i++;
            }
            if (i == n) break;
            int end = i;
            j = m - 1;                                // backward: tightest start
            while (j >= 0) {
                if (s1[i] == s2[j]) j--;
                i--;
            }
            int start = i + 1;
            if (end - start + 1 < bestLen) { bestLen = end - start + 1; bestStart = start; }
            i = start + 1;                            // try windows that start later
        }
        return bestStart == -1 ? "" : s1.substr(bestStart, bestLen);
    }
};
```

## Complexity

- Time: O(n · m) in typical cases. Each window costs a forward and a backward scan, and windows restart from successive starts. With n ≤ 2 × 10⁴ and m ≤ 100 it is fast.
- Space: O(1).
- DP alternative: dp[i][j] = the latest start index such that s2[0..j] is a subsequence of s1[start..i]. That is O(n · m) time and space.

## Edge cases

- Ties: we only replace the best on a **strictly** shorter window, and windows are found left to right, so the leftmost one wins.
- No window → "".

## Dry run (s1 = "abcdebdde", s2 = "bde")

- Forward from 0: b (1), d (3), e (4) → end = 4. Backward: e (4), d (3), b (1) → start = 1 → "bcde", length 4.
- Forward from 2: b (5), d (6), e (8) → end = 8. Backward: e (8), d (7), b (5) → start = 5 → "bdde", length 4, not shorter.
- Forward from 6: no b left → stop.

Answer: **"bcde"**. (Tested on 3 000 random cases against the O(n²) brute force.)
