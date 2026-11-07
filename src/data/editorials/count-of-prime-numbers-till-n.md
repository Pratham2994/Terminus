# Count of Prime Numbers till N

> Solve it on [LeetCode 204 · Count Primes](https://leetcode.com/problems/count-primes/). LeetCode counts primes **below** n (not including n). If your version includes n, run the same sieve up to n.

## What you need to do

Count the prime numbers smaller than n. A prime has exactly two divisors, 1 and itself, so 0 and 1 are not prime.

## Example

n = 10 → the primes below 10 are 2, 3, 5, 7 → **4**.

## How to solve it, step by step

1. **The slow idea:** test every number on its own (try divisors up to its square root). For n = 5 000 000 that is about 10¹⁰ steps: far too slow.

2. **Cross out instead of testing (the Sieve of Eratosthenes).** Start by assuming every number from 2 up is prime.

   **Why:** crossing out multiples is much cheaper than testing each number from scratch.

3. **Walk i = 2, 3, 4, … If i is not crossed out, it is prime: count it.**

   **Why:** every non-prime has a smaller prime factor, so it was crossed out before you reached it.

4. **Then cross out the multiples of i, starting at i × i:** i², i² + i, i² + 2i, …

   **Why start at i²:** a smaller multiple, k × i with k < i, has a smaller prime factor, so it was already crossed out earlier.

## Code (C++)

```cpp
class Solution {
public:
    int countPrimes(int n) {
        if (n < 3) return 0;
        vector<bool> composite(n, false);
        int count = 0;
        for (long long i = 2; i < n; i++) {
            if (composite[i]) continue;
            count++;
            for (long long j = i * i; j < n; j += i) composite[j] = true;
        }
        return count;
    }
};
```

## How fast is it?

O(n log log n), which is almost linear in practice. Memory: one flag per number; `vector<bool>` uses 1 bit each, so 5 million numbers fit in under 1 MB.

## Watch out for

- n = 0, 1 or 2 → 0 (no prime is below 2).
- `i * i` overflows an `int` once i passes 46 340, so use `long long`.

## Walk through (n = 10)

- 2: prime (1). Cross out 4, 6, 8.
- 3: prime (2). Cross out 9.
- 4: crossed out. 5: prime (3); 25 is past 10.
- 6: crossed out. 7: prime (4). 8, 9: crossed out.

Answer: **4**.
