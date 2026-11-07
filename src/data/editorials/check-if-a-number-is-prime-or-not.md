# Check if a Number is Prime or Not

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `bool isPrime(int n)`.

## What you need to do

Return true if n is **prime**: bigger than 1, and divisible only by 1 and itself.

## Example

- 5 → **true** (only 1 and 5 divide it).
- 15 → **false** (3 × 5 = 15).
- 1 → **false** (1 is not prime by definition).

## How to solve it, step by step

1. **Numbers below 2 are not prime.** Return false for them first.

   **Why:** that is the definition, and it keeps 0 and 1 out of the loop.

2. **Try dividing by d = 2, 3, 4, …** If any d divides n, it is not prime.

   **Why:** a prime has no divisor between 1 and itself.

3. **Stop when d × d > n.** You never need to go past √n.

   **Why:** divisors come in pairs: if d divides n, so does n / d. One of each pair is at most √n. So if there is any divisor, you meet one before √n.

4. **If no d divided n, return true.**

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    bool isPrime(int n) {
        if (n < 2) return false;                 // 0 and 1 are not prime
        for (long long d = 2; d * d <= n; d++)   // long long: d*d must not overflow
            if (n % d == 0) return false;        // found a divisor <= sqrt(n)
        return true;
    }
};
```

## How fast is it?

At most √n tries: O(√n). For n = 1 000 000 000 that is about 31 600 tries instead of a billion. No extra memory.

## Watch out for

- Write the loop as `d * d <= n`, not `d <= sqrt(n)`. `sqrt` uses decimals and can be off by one for big n.
- Use `long long` for d, or `d * d` can overflow when n is near 2 000 000 000.

## Walk through (n = 15)

- d = 2: 15 is not divisible by 2.
- d = 3: 15 ÷ 3 = 5 → divisible → **false**.

(Tested on every n up to 100 000.)
