# Rabin Karp Algorithm

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> search(string pat, string txt)`. Return every 0-based start index of pat in txt.

## The problem

Find all occurrences of `pattern` in `text`, using the Rabin-Karp idea.

Examples: text "ababcabcababc", pattern "abc" → **[2, 5, 10]**. text "hello", pattern "ll" → **[2]**.

## Brute force

Compare pattern against text at every start index.

- Time: O(n · m) in the worst case (text "aaaa…a", pattern "aa…ab").

## The Rabin-Karp idea: compare numbers, not strings

Turn every length-m window into a number, its **hash**, and compare that with the pattern's hash. Comparing two numbers is O(1).

The trick is the **rolling** hash. Treat a string as a number in base B (we use 131), taken mod a big prime M:

hash("c₀c₁…c_{m−1}") = c₀·B^(m−1) + c₁·B^(m−2) + … + c_{m−1} (mod M)

Sliding the window right by one:

1. **Remove** the leftmost character: subtract txt[i] · B^(m−1).
2. **Shift and add** the new one: multiply by B, add txt[i + m].

So each new window's hash costs O(1).

**Collisions:** two different strings can have the same hash. When the hashes match, **confirm** with a real string comparison. Then the answer is always correct, and only the speed depends on the hash.

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

## Complexity

- Time: O(n + m) on average. A real comparison only happens when the hashes match: for true matches, and for rare collisions.
- Worst case O(n · m), if an attacker forces many collisions. Using two different mods (double hashing) makes that practically impossible.
- Space: O(1) besides the output.

## Edge cases

- `+ MOD` before the final `% MOD` keeps the hash non-negative after the subtraction.
- `power` is BASE^(m−1), not BASE^m. It is the weight of the window's **first** character.
- Overlapping matches are found ("aa" in "aaaa" → 0, 1, 2), because we check every window.

(Tested on 4 000 random texts and patterns against a plain search. KMP gives the same answers with a guaranteed O(n + m). See the KMP station.)
