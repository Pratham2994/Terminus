# Print all primes till N

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> primeTillN(int n)`.

## The problem

Given n (2 ≤ n ≤ 5 × 10⁵), return every prime from 2 up to **and including** n, in increasing order.

Example: n = 7 → **[2, 3, 5, 7]**. n = 2 → **[2]**.

## Brute force

For every x from 2 to n, check divisors d with d × d ≤ x. If none divides x, add x.

- Time: O(n √n), about 3.5 × 10⁸ steps for n = 5 × 10⁵. That is too slow for comfort.

## The better idea: Sieve of Eratosthenes

Do not test numbers one by one. Mark the multiples of each prime as "not prime":

1. Keep a flag `composite[x]` for every x from 0 to n. At the start, every flag is false.
2. For i = 2 … n: if `composite[i]` is still false, i is prime. Add it to the answer, then mark i², i² + i, … up to n.
3. Start marking at i², because any smaller multiple k × i (k < i) was already marked by a smaller prime factor of k.

Because we walk i in increasing order, the answer is already sorted.

## Code (C++)

```cpp
class Solution {
public:
    vector<int> primeTillN(int n) {
        vector<bool> composite(n + 1, false);
        vector<int> primes;
        for (long long i = 2; i <= n; i++) {
            if (composite[i]) continue;
            primes.push_back(i);
            for (long long j = i * i; j <= n; j += i) composite[j] = true;
        }
        return primes;
    }
};
```

## Complexity

- Time: O(n log log n).
- Space: O(n) for the flags, plus the output.

## Edge cases

- n itself can be prime (n = 7). The array has size n + 1 and the loops use `<= n`, so n is included.
- `i * i` needs `long long`. With n ≤ 5 × 10⁵, `i * i` can reach 2.5 × 10¹¹.

## Dry run (n = 10)

- i = 2: prime → [2]. Mark 4, 6, 8, 10.
- i = 3: prime → [2, 3]. Mark 9.
- i = 4: marked, skip.
- i = 5: prime → [2, 3, 5]. 25 > 10, nothing to mark.
- i = 6: skip. i = 7: prime → [2, 3, 5, 7]. i = 8, 9, 10: skip.

Answer: **[2, 3, 5, 7]**.
