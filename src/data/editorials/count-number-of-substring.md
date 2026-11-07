# Count Number of Substrings

> Solve it on takeUforward's free practice page (the Problem link above). The function is `long long countSubstrings(string s)`. The same problem is free on [LeetCode 1915 · Number of Wonderful Substrings](https://leetcode.com/problems/number-of-wonderful-substrings/).

## What you need to do

The name hides the real question. s uses only the letters 'a' to 'j' (10 letters) and can be 100 000 long. Count the connected pieces where **at most one letter appears an odd number of times**.

## Examples

- "aba" → **4**: "a", "b", "a", "aba"
- "aabb" → **9**: every piece except "ab"

## How to solve it, step by step

1. **The slow idea:** try every piece and count its letters. That is about 10¹¹ steps for n = 100 000.

2. **Only odd or even matters, so store it as bits.** Keep a 10-bit number `mask`: bit c is 1 when letter c has appeared an odd number of times so far.

   **Why:** 10 yes/no answers fit in one small number, and flipping a bit (XOR) adds one letter.

3. **The mask of a piece is (mask at its end) XOR (mask at its start).**

   **Why:** XOR cancels the part before the piece, just like subtracting prefix sums.

4. **A piece is valid when its mask has zero or one bit set.** So, at each end, count earlier masks that are **equal** to the current mask, or differ from it in **exactly one** bit (10 choices).

   **Why:** equal masks XOR to 0 (every letter even); masks one bit apart XOR to a single bit (one letter odd).

5. **Keep counts of the masks seen so far** in an array of 1024 (= 2¹⁰). Start with `seen[0] = 1`.

   **Why:** `seen[0] = 1` stands for the empty start, so pieces that begin at index 0 are counted too.

6. **Add the current mask to `seen` only after counting.**

   **Why:** otherwise the current position pairs with itself and counts an empty piece.

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

## How fast is it?

For each letter, 11 lookups: O(10 · n) time. Memory: 1024 counters.

## Watch out for

- The answer can be about n²/2 = 5 billion, too big for `int`. Use `long long`.

## Walk through ("aba")

a = bit 0, b = bit 1. seen = {00: 1}.

- 'a' → mask 01. Equal: 0. One bit off: 00 → 1. Total 1 ("a").
- 'b' → mask 11. Equal: 0. One bit off: 01 → 1. Total 2 ("b").
- 'a' → mask 10. Equal: 0. One bit off: 11 → 1 ("a"), 00 → 1 ("aba"). Total **4**.
