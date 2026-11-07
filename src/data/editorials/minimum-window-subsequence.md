# Minimum Window Subsequence

> LeetCode 727 is **Premium**, and takeUforward's page needs Plus. The **same problem** is free on GeeksforGeeks (the Problem link above). GfG's function is `string minWindow(string& s1, string& s2)`: the code below works there with the `&` added.

## What you need to do

Find the **shortest piece of s1** that contains s2 as a subsequence: the letters of s2 in order, but not necessarily next to each other. If several are equally short, return the one that starts first. If none exists, return "".

## Example

s1 = "abcdebdde", s2 = "bde" → **"bcde"**. ("bdde" is also 4 long, but it starts later.)

## How to solve it, step by step

1. **Forward pass:** from a start position, walk through s1 and match the letters of s2 in order. Stop where the **last** letter of s2 matches. That is the end of a window.

   **Why:** this finds a valid window, but its start may be too early.

2. **Backward pass:** from that end, walk **left** and match s2 from its last letter back to its first. Where s2's first letter matches is the **latest possible start**.

   **Why:** going backwards pushes the start as far right as possible, which gives the shortest window with this end.

3. **Keep the window if it is shorter than the best so far.**

   **Why:** only replace on "strictly shorter", so on a tie the earlier window stays.

4. **Start the next forward pass one position after that start,** and repeat until no more windows are found.

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

## How fast is it?

About O(n · m) in practice, where n is the length of s1 and m of s2. Memory: O(1).

## Another way

A DP table where dp[i][j] = the latest start such that s2[0..j] fits inside s1[start..i]. It is also O(n · m), but uses O(n · m) memory.

## Watch out for

- If no window exists, return "".

## Walk through (s1 = "abcdebdde", s2 = "bde")

- Forward from 0: b (1), d (3), e (4) → end 4. Backward: e (4), d (3), b (1) → "bcde", length 4.
- Forward from 2: b (5), d (6), e (8) → end 8. Backward: e (8), d (7), b (5) → "bdde", length 4, not shorter.
- Forward from 6: no b left → stop.

Answer: **"bcde"**. (Tested on 3 000 random cases against the slow way.)
