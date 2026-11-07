# Check if a Number is Prime or Not

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `bool isPrime(int n)`.

## The problem

Return true if n is **prime**: greater than 1, with no divisors other than 1 and itself.

Examples: 5 → **true**. 15 → **false** (3 · 5). 1 → **false**. 2 → **true**.

## Brute force

Try every d from 2 to n − 1. If any divides n, it is not prime.

- Time: O(n). For n = 10⁹ that is a billion steps.

## Why √n is enough

Divisors come in **pairs**: if d divides n, so does n / d. In each pair, one number is ≤ √n and the other ≥ √n (they cannot both be bigger, or their product would exceed n).

So if n has any divisor besides 1 and n, it has one **≤ √n**. Checking d from 2 while **d · d ≤ n** is enough.

## Code (C++)

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

## Complexity

- Time: O(√n). For n = 10⁹ about 31 623 steps.
- Space: O(1).

## Edge cases

- n = 1 (and 0) are **not** prime. The `n < 2` check handles them.
- Write the loop as `d * d <= n`, not `d <= sqrt(n)`: `sqrt` works with floating point and can be off by one for big n.
- Use `long long` for d, or `d * d` can overflow near n = 2³¹ − 1.

## Dry run (n = 15)

- d = 2: 15 % 2 = 1.
- d = 3: 15 % 3 = 0 → **false**.

(Tested on every n up to 100 000 against the brute force.)
