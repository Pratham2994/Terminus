# Count of Prime Numbers till N

> Solve it on [LeetCode 204 · Count Primes](https://leetcode.com/problems/count-primes/). LeetCode counts primes **strictly less than** n. If your version says "till N" including N, run the same sieve up to n.

## The problem

Given an integer n, count how many prime numbers are smaller than n. A prime has exactly two divisors: 1 and itself. So 0 and 1 are not prime.

Example: n = 10 → the primes below 10 are 2, 3, 5, 7 → answer **4**.

## Brute force

Test every number x from 2 to n − 1. To test x, try every divisor d with d × d ≤ x. If none divides x, it is prime.

- Time: O(n √n). For n = 5 × 10⁶ this is about 10¹⁰ steps, far too slow.

## The better idea: Sieve of Eratosthenes

Instead of testing each number, **cross out the multiples** of every prime.

1. Assume every number from 2 to n − 1 is prime.
2. Walk i = 2, 3, 4, … If i is still not crossed out, it is prime: count it.
3. Cross out every multiple of that prime: i², i² + i, i² + 2i, …

Why start at i² and not 2i? Every smaller multiple, k × i with k < i, has a prime factor smaller than i, so an earlier prime already crossed it out.

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

## Complexity

- Time: O(n log log n). The inner loops add up to n/2 + n/3 + n/5 + … over the primes, which grows like n log log n. In practice that is nearly linear.
- Space: O(n) for the `composite` array.

## Edge cases

- n = 0, 1 or 2 → 0, because there is no prime below 2.
- `i * i` overflows `int` once i passes 46 340, so use `long long` for i and j.
- `vector<bool>` stores 1 bit per number, so even n = 5 × 10⁶ uses under 1 MB.

## Dry run (n = 10)

- i = 2: prime (count 1). Cross out 4, 6, 8.
- i = 3: prime (count 2). Cross out 9.
- i = 4: crossed out, skip.
- i = 5: prime (count 3). 25 ≥ 10, nothing to cross out.
- i = 6: skip. i = 7: prime (count 4). i = 8, 9: skip.

Answer: **4**.
