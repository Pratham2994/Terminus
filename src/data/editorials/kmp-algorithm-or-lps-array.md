# KMP Algorithm or LPS array

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> search(string pat, string txt)`. Return every 0-based start index of pat in txt, in increasing order.

## The problem

Find all occurrences of a pattern in a text, in **guaranteed** O(n + m), using Knuth-Morris-Pratt.

Examples: text "abracadabra", pattern "abra" → **[0, 7]**. text "abcabcabc", pattern "abc" → **[0, 3, 6]**.

## Why is brute force slow?

After a mismatch, brute force moves the start one step right and **re-compares characters it has already seen**. KMP never moves backwards in the text.

## The LPS array

For each position i of the pattern, `lps[i]` = the length of the longest **proper prefix** of pat[0..i] that is also a **suffix** of it.

Example: "aabaaab" → lps = [0, 1, 0, 1, 2, 2, 3].

Why it helps: suppose we matched j characters of the pattern, and then the next character mismatches. Those j characters were pat[0..j−1]. Their longest prefix-that-is-also-suffix is `lps[j−1]` characters long. The text's last `lps[j−1]` characters already equal the pattern's first `lps[j−1]` characters, so continue matching from j = lps[j−1] instead of 0. Nothing is lost, and the text pointer never goes back.

## Building the LPS array

Use the same trick on the pattern itself. `len` = the length of the current prefix-suffix:

- pat[i] == pat[len] → it grows: lps[i] = ++len.
- Mismatch and len > 0 → fall back: len = lps[len − 1]. Do not advance i.
- Mismatch and len == 0 → lps[i] = 0, advance i.

## Code (C++)

```cpp
class Solution {
public:
    vector<int> search(string pat, string txt) {
        int m = pat.size(), n = txt.size();
        vector<int> lps(m, 0), out;
        for (int i = 1, len = 0; i < m; ) {            // build LPS
            if (pat[i] == pat[len]) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
        for (int i = 0, j = 0; i < n; ) {              // scan the text
            if (txt[i] == pat[j]) {
                i++; j++;
                if (j == m) {                          // full match ends at i-1
                    out.push_back(i - m);
                    j = lps[j - 1];                    // keep going: overlaps allowed
                }
            }
            else if (j > 0) j = lps[j - 1];
            else i++;
        }
        return out;
    }
};
```

## Complexity

- Time: O(n + m), guaranteed. Every step either moves i forward or makes j smaller, and j can only shrink as much as it has grown.
- Space: O(m) for the LPS array.

## Edge cases

- After a full match, set j = lps[m − 1], not 0. That finds **overlapping** matches: "aa" in "aaaa" → 0, 1, 2.
- Only `lps[len − 1]` when len > 0. The `else if` order guarantees it.

## Dry run (LPS for "abab")

- i = 1: b ≠ a, len 0 → lps[1] = 0.
- i = 2: a == pat[0] → lps[2] = 1.
- i = 3: b == pat[1] → lps[3] = 2.

lps = [0, 0, 1, 2]. In "ababab", after matching "abab" at 0, j becomes 2, and the next "ab" completes a match at 2.

(Tested on 4 000 random texts and patterns against a plain search.)
