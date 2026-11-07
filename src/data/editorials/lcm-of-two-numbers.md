# LCM of two numbers

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int lcm(int a, int b)`.

## The problem

Return the **Lowest Common Multiple** of two positive integers: the smallest positive number that both divide.

Examples: (4, 6) → **12**. (12, 18) → **36**. (5, 11) → **55**.

## Brute force

Start at max(a, b) and go up until a number is divisible by both.

- Time: O(a · b) in the worst case (two primes, like 9973 and 9967). Too slow for big inputs.

## The key fact: lcm · gcd = a · b

Write a and b as products of primes. The **gcd** takes the smaller power of every prime, the **lcm** the larger one. Together they use every power exactly once, so

**lcm(a, b) = a · b / gcd(a, b)**.

So the real work is the gcd.

## Euclid's algorithm for the gcd

**gcd(a, b) = gcd(b, a mod b)**, and gcd(a, 0) = a.

Why: any number that divides a and b also divides a − k·b, and a mod b is exactly such a number. So (a, b) and (b, a mod b) have the same common divisors.

The numbers shrink fast: at least halving every two steps, so it takes O(log min(a, b)) steps.

## Code (C++)

```cpp
class Solution {
    long long gcd(long long a, long long b) {
        while (b != 0) {
            long long r = a % b;          // gcd(a, b) = gcd(b, a mod b)
            a = b;
            b = r;
        }
        return a;
    }
  public:
    int lcm(int a, int b) {
        // Divide first, then multiply: a / g * b cannot overflow when a * b would.
        return (int)(a / gcd(a, b) * b);
    }
};
```

## Complexity

- Time: O(log min(a, b)). Space: O(1).

## Edge cases

- **Overflow:** `a * b / g` can overflow an `int` even when the answer fits. `a / g * b` divides first. (`a / g` is exact, because g divides a.)
- One number divides the other, like (4, 12): gcd = 4, lcm = 4 / 4 · 12 = 12. ✓
- Equal numbers: lcm(7, 7) = 7.

## Dry run (12, 18)

- gcd: (12, 18) → (18, 12) → (12, 6) → (6, 0) → **6**.
- lcm = 12 / 6 · 18 = **36**.

(Tested on 20 000 random pairs against the brute force.)
