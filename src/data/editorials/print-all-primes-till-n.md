# Print all primes till N

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> primeTillN(int n)`.

## What you need to do

Return every prime from 2 up to **and including** n, smallest first. n can be up to 500 000.

## Examples

- n = 7 → **[2, 3, 5, 7]**
- n = 2 → **[2]**

## How to solve it, step by step

1. **The slow idea:** test each number on its own. That is about 350 million steps for n = 500 000: too slow.

2. **Use the Sieve of Eratosthenes.** Keep a flag `composite[x]` for every x from 0 to n, all false at the start.

   **Why:** crossing out multiples is far cheaper than testing every number.

3. **Walk i from 2 to n. If `composite[i]` is still false, i is prime: add it to the answer.**

   **Why:** any non-prime was crossed out by a smaller prime before you reached it.

4. **Then mark i², i² + i, … up to n as composite.**

   **Why start at i²:** smaller multiples were already marked by smaller primes.

5. **The answer comes out sorted,** because i only goes up.

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

## How fast is it?

O(n log log n), almost linear. Memory: n + 1 flags, plus the answer.

## Watch out for

- n itself can be prime. Size the array n + 1 and loop with `<= n`.
- `i * i` can reach 2.5 × 10¹¹ here, so use `long long`.

## Walk through (n = 10)

- 2: prime → [2]. Mark 4, 6, 8, 10.
- 3: prime → [2, 3]. Mark 9.
- 4: marked. 5: prime → [2, 3, 5].
- 6: marked. 7: prime → [2, 3, 5, 7]. 8, 9, 10: marked.

Answer: **[2, 3, 5, 7]**.
