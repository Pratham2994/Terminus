# KMP Algorithm or LPS array

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> search(string pat, string txt)`. Return every starting index (from 0) where pat appears in txt, smallest first.

## What you need to do

Find every place the pattern appears in the text, in time that is **always** O(n + m), using the Knuth-Morris-Pratt (KMP) method.

## Examples

- text "abracadabra", pattern "abra" → **[0, 7]**
- text "abcabcabc", pattern "abc" → **[0, 3, 6]**

## How to solve it, step by step

1. **See why the simple search is slow.** After a mismatch, it moves the start one step right and compares characters it has **already** seen again.

   **Why this matters:** KMP never steps back in the text. It reuses what it already matched.

2. **Build the LPS array for the pattern.** `lps[i]` = the length of the longest beginning of pat[0..i] that is also its ending (not the whole thing). Example: "aabaaab" → [0, 1, 0, 1, 2, 2, 3].

   **Why:** it tells you how much of a partial match you can keep after a mismatch.

3. **When j pattern characters matched and the next one fails, jump to j = lps[j − 1] instead of 0.**

   **Why:** the last lps[j − 1] characters of the text already equal the first lps[j − 1] characters of the pattern. You can carry on from there, and the text pointer never goes back.

4. **Build the LPS array with the same jump.** Keep `len`, the current matching length:
   - pat[i] == pat[len] → it grows: lps[i] = ++len, move i on.
   - mismatch and len > 0 → fall back: len = lps[len − 1]; keep i.
   - mismatch and len == 0 → lps[i] = 0, move i on.

5. **Scan the text the same way. On a full match, record it and set j = lps[m − 1].**

   **Why:** setting j to lps[m − 1] (not 0) also finds matches that overlap, like "aa" in "aaaa" at 0, 1 and 2.

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

## How fast is it?

O(n + m), always: every step either moves forward in the text or shrinks j, and j can only shrink as much as it grew. Memory: O(m) for the LPS array.

## Watch out for

- Only read `lps[len − 1]` when len > 0. The order of the `if` / `else if` makes sure of that.

## Walk through (LPS for "abab")

- i = 1: b ≠ a and len = 0 → lps[1] = 0.
- i = 2: a == a → lps[2] = 1.
- i = 3: b == b → lps[3] = 2.

lps = [0, 0, 1, 2]. In "ababab", after matching "abab" at 0, j jumps to 2, and the next "ab" completes a match at 2.

(Tested on 4 000 random texts and patterns against a plain search.)
