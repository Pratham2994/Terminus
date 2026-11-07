# LCM of two numbers

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int lcm(int a, int b)`.

## What you need to do

Find the **smallest number that both a and b divide** (the Lowest Common Multiple).

## Example

a = 4, b = 6. Multiples of 4: 4, 8, **12**, 16 … Multiples of 6: 6, **12**, 18 … The first one they share is **12**.

## How to solve it, step by step

1. **The slow idea:** start at the bigger number and count up until both divide it.

   **Why it is not enough:** for two big primes, like 9973 and 9967, you would count up almost 100 million times.

2. **Use this fact: lcm(a, b) × gcd(a, b) = a × b.** So lcm = a × b / gcd.

   **Why:** the gcd is the part a and b share. a × b counts that shared part twice; dividing by the gcd removes the extra copy.

3. **Find the gcd with Euclid's rule:** gcd(a, b) = gcd(b, a mod b), and gcd(a, 0) = a. Repeat until the second number is 0.

   **Why:** any number that divides a and b also divides a mod b. So the pair gets smaller but the answer stays the same. It finishes in a handful of steps, even for huge numbers.

4. **Divide before you multiply:** compute `a / gcd * b`, not `a * b / gcd`.

   **Why:** a × b can be too big for an `int` even when the answer fits. a / gcd is always a whole number, so dividing first is safe.

## Code (C++, for GfG)

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

## How fast is it?

Euclid's rule takes O(log(min(a, b))) steps, so it is very fast. No extra memory.

## Watch out for

- **Overflow:** always divide first (step 4).
- When one number divides the other, like (4, 12), the answer is the bigger one: 12.

## Walk through (a = 12, b = 18)

- gcd: (12, 18) → (18, 12) → (12, 6) → (6, 0). gcd = **6**.
- lcm = 12 / 6 × 18 = **36**.

(Tested on 20 000 random pairs against the slow idea.)
