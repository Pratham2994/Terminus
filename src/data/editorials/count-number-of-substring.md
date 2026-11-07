# Count Number of Substrings

> Solve it on takeUforward's free practice page (the Problem link above). The function is `long long countSubstrings(string s)`. The same problem is free on [LeetCode 1915 · Number of Wonderful Substrings](https://leetcode.com/problems/number-of-wonderful-substrings/).

## The problem

The name hides what this problem asks. s has only the letters 'a' to 'j' (10 letters) and length up to 10⁵. A substring is **valid** when **at most one** letter appears an **odd** number of times in it. Count the valid non-empty substrings.

Examples: "aba" → **4** ("a", "b", "a", "aba"). "aabb" → **9** (all 10 substrings except "ab").

## Brute force

For every start i, extend the end j and keep 10 counters. Check how many counters are odd.

- Time: O(n² · 10). For n = 10⁵ that is 10¹¹ steps, too slow.

## Key idea 1: only parity matters

We only care whether each letter's count is **odd or even**. Store that as a 10-bit **mask**: bit c is 1 when letter c has appeared an odd number of times.

Let `mask(k)` be the mask of the first k characters, the prefix. The mask of the substring s[i..j−1] is

**mask(j) XOR mask(i)**

because XOR cancels the part they share, and a parity is just a count mod 2.

## Key idea 2: what "valid" means for the masks

A substring is valid when its mask has **zero or one** bit set, so:

- mask(j) XOR mask(i) = 0, which means mask(i) = mask(j), or
- mask(j) XOR mask(i) = one bit b, which means mask(i) = mask(j) XOR (1 << b), for one of the 10 letters b.

So walk through s and keep the current prefix mask. For each end j, count how many earlier prefixes i had one of these 11 masks. Store those counts in an array `seen` of size 2¹⁰ = 1024.

Start with `seen[0] = 1`: that is the empty prefix, so substrings starting at index 0 are counted too.

## Code (C++)

```cpp
class Solution {
public:
    long long countSubstrings(string s) {
        vector<long long> seen(1 << 10, 0);
        seen[0] = 1;                 // the empty prefix
        int mask = 0;
        long long ans = 0;
        for (char c : s) {
            mask ^= 1 << (c - 'a');
            ans += seen[mask];                                  // all counts even
            for (int b = 0; b < 10; b++) ans += seen[mask ^ (1 << b)];  // one odd
            seen[mask]++;
        }
        return ans;
    }
};
```

## Complexity

- Time: O(n · 10). For each character, 11 array lookups.
- Space: O(2¹⁰) = 1024 counters.

## Edge cases

- The answer can reach about n²/2 = 5 × 10⁹, which overflows `int`. Use `long long`, as the function signature says.
- Add the current mask to `seen` **after** counting. Otherwise the current prefix would pair with itself, and count an empty substring.

## Dry run ("aba")

Masks: a = bit 0, b = bit 1. seen = {0: 1}.

- 'a' → mask 01. seen[01] = 0. One bit off: seen[00] = 1 → +1 ("a"). seen = {00:1, 01:1}.
- 'b' → mask 11. seen[11] = 0. Flip bit 0 → 10: 0. Flip bit 1 → 01: 1 → +1 ("b"). seen adds 11.
- 'a' → mask 10. seen[10] = 0. Flip bit 0 → 11: 1 ("a"). Flip bit 1 → 00: 1 ("aba") → +2.

Total **4** ✓.
