# Rabin Karp Algorithm

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> search(string pat, string txt)`. Return every starting index (from 0) where pat appears in txt.

## What you need to do

Find every place the pattern appears in the text, using the Rabin-Karp idea.

## Examples

- text "ababcabcababc", pattern "abc" → **[2, 5, 10]**
- text "hello", pattern "ll" → **[2]**

## How to solve it, step by step

1. **The simple search compares the pattern at every position.** In the worst case ("aaaa…a" against "aa…ab") that is O(n · m).

2. **Turn each window of m characters into a number, its "hash", and compare numbers instead of strings.**

   **Why:** comparing two numbers takes one step; comparing two strings takes m steps.

3. **Treat the window as a number in base B (131 here), kept small with mod M (a big prime).**

4. **Slide the window with a "rolling" hash:** subtract the leftmost character's part (txt[i] × B^(m − 1)), multiply by B, and add the new character.

   **Why:** this updates the hash in one step instead of recomputing it from scratch.

5. **When the hashes match, confirm with a real string comparison.**

   **Why:** two different strings can sometimes share a hash (a "collision"). Confirming makes the answer always correct; the hash only makes it fast.

## Code (C++)

```cpp
class Solution {
public:
    vector<int> search(string pat, string txt) {
        int m = pat.size(), n = txt.size();
        vector<int> out;
        if (m > n) return out;
        const long long MOD = 1'000'000'007, BASE = 131;
        long long hp = 0, ht = 0, power = 1;            // power = BASE^(m-1)
        for (int i = 0; i < m; i++) {
            hp = (hp * BASE + pat[i]) % MOD;
            ht = (ht * BASE + txt[i]) % MOD;
            if (i < m - 1) power = power * BASE % MOD;
        }
        for (int i = 0; ; i++) {
            if (hp == ht && txt.compare(i, m, pat) == 0) out.push_back(i);  // confirm
            if (i + m >= n) break;
            ht = (ht - txt[i] * power % MOD + MOD) % MOD;   // drop txt[i]
            ht = (ht * BASE + txt[i + m]) % MOD;            // add txt[i+m]
        }
        return out;
    }
};
```

## How fast is it?

O(n + m) on average: the real comparison only runs on true matches and rare collisions. The worst case is O(n · m) if collisions are forced; using two different mods makes that practically impossible. Memory: O(1) besides the answer.

## Watch out for

- Add M before the final `% M` after subtracting, so the hash never goes negative.
- The leftmost character's weight is B^(m − 1), not B^m.
- Overlapping matches are found ("aa" in "aaaa" → 0, 1, 2), because every window is checked.

(Tested on 4 000 random texts and patterns against a plain search. KMP gives the same answers with a guaranteed O(n + m); see the KMP station.)
