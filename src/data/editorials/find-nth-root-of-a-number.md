# Find Nth root of a number

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Nth Root of M". GfG's function is `int nthRoot(int n, int m)`. Same problem, same order of arguments (n is the root, m the number). The video above explains it too.

## The problem

Return the integer x with **xⁿ = m**. If no integer does it, return **−1**.

Examples: n = 3, m = 27 → **3**. n = 4, m = 69 → **−1**. n = 3, m = 8 → **2**.

## Brute force

Try x = 1, 2, 3, … while xⁿ ≤ m.

- Time: O(m^(1/n) · n). For n = 1 and m = 10⁹ that is 10⁹ tries.

## Binary search on the answer

xⁿ **grows** with x. So for every x, xⁿ is either < m, = m or > m, and these come in order: all the "<" first, then at most one "=", then all the ">". That is exactly the shape binary search needs.

- Search x in [1, m].
- mid: compare midⁿ with m. Equal → answer. Smaller → go right. Bigger → go left.

**The overflow trap:** midⁿ explodes. For mid = 10⁵ and n = 9, it has 45 digits. So compute the power **step by step and stop as soon as it passes m**. Then you never hold a number above m · mid, which fits in `long long`.

## Code (C++)

```cpp
class Solution {
    // 1 if mid^n == m, 0 if mid^n < m, 2 if mid^n > m. Stops early, so no overflow.
    int compare(long long mid, int n, long long m) {
        long long p = 1;
        for (int i = 0; i < n; i++) {
            p *= mid;
            if (p > m) return 2;
        }
        return p == m ? 1 : 0;
    }
  public:
    int nthRoot(int n, int m) {
        if (m == 0) return 0;                    // 0^n = 0
        long long lo = 1, hi = m;
        while (lo <= hi) {
            long long mid = lo + (hi - lo) / 2;
            int c = compare(mid, n, m);
            if (c == 1) return (int)mid;
            if (c == 0) lo = mid + 1;            // too small: go right
            else hi = mid - 1;                   // too big: go left
        }
        return -1;                               // no integer root
    }
};
```

## Complexity

- Time: O(n · log m): log m binary-search steps, each with at most n multiplications.
- Space: O(1).

## Edge cases

- m = 0 → 0, and m = 1 → 1 for every n.
- n = 1 → the answer is m itself. The search finds it.
- The early exit in `compare` is what keeps `p` in range: once p > m we stop, so p ≤ m · mid ≤ m².

## Dry run (n = 3, m = 27)

- [1, 27]: mid 14 → 14³ > 27 → hi = 13.
- [1, 13]: mid 7 → too big → hi = 6.
- [1, 6]: mid 3 → 3³ = 27 → **3**.

(Tested on 30 000 random (n, m) pairs against the brute force.)
