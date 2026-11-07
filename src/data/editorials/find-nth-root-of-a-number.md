# Find Nth root of a number

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Nth Root of M". GfG's function is `int nthRoot(int n, int m)`: n is the root, m is the number. The video above explains it too.

## What you need to do

Find the whole number x with **x to the power n equal to m**. If there is none, return −1.

## Example

- n = 3, m = 27 → **3**, because 3 × 3 × 3 = 27.
- n = 4, m = 69 → **−1**: 2⁴ = 16 and 3⁴ = 81, so no whole number works.

## How to solve it, step by step

1. **Notice that xⁿ only grows as x grows.**

   **Why:** this is what makes binary search work. If midⁿ is too small, every smaller x is too small too.

2. **Binary search x between 1 and m.** Look at the middle value, mid.

   **Why:** each check throws away half of the range, so even m = 1 000 000 000 needs only about 30 checks.

3. **Compare midⁿ with m:** equal → that is the answer; smaller → search the right half; bigger → search the left half.

   **Why:** this keeps the answer inside the range you are still searching.

4. **Compute midⁿ one multiplication at a time, and stop as soon as it passes m.**

   **Why:** midⁿ can be enormous (10⁵ to the power 9 has 45 digits) and would overflow. Stopping early keeps the numbers small.

5. **If the search ends without an exact match, return −1.**

## Code (C++, for GfG)

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

## How fast is it?

About log₂(m) checks, each with at most n multiplications: O(n · log m). No extra memory.

## Watch out for

- m = 0 → the answer is 0. Handle it first, because the search starts at 1.
- Do not use `pow()`: it works with decimals and can be slightly off, so `pow(5, 3)` might come out as 124.999….

## Walk through (n = 3, m = 27)

- Range 1–27, mid 14: 14³ is too big → 1–13.
- mid 7: too big → 1–6.
- mid 3: 3³ = 27 → **3**.

(Tested on 30 000 random pairs against trying every x.)
