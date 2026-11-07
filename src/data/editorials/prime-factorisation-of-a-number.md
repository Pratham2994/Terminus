# Prime factorisation of a Number

> No free judge has this exact problem (many numbers, answered with a sieve), so Terminus is your judge. The video above explains it too. Check your answer with the self-check program at the bottom. The function here is `vector<vector<int>> primeFactors(vector<int>& queries)`. For a single number, GfG has a related free problem: [All Prime Factors in Sorted Order](https://www.geeksforgeeks.org/problems/prime-factorization/1).

## What you need to do

You get up to 100 000 numbers, each between 2 and 200 000. For each one, list its prime factors **with repeats, from small to big**. For example, 12 → [2, 2, 3].

## Visible tests

| queries | Answer |
|---|---|
| [2, 3, 4, 5, 6] | [[2], [3], [2, 2], [5], [2, 3]] |
| [7, 12, 18] | [[7], [2, 2, 3], [2, 3, 3]] |
| [15, 20] | [[3, 5], [2, 2, 5]] |

## How to solve it, step by step

1. **The simple way for one number:** divide by 2, 3, 4, … while the divisor squared is at most the number. Each time it divides, record it and divide. What is left (if above 1) is a prime.

   **Why it is not ideal here:** it costs about √x per number. With 100 000 numbers, that adds up to tens of millions of steps.

2. **Better: build a "smallest prime factor" table (SPF) once,** for every number up to 200 000. `spf[x]` is the smallest prime that divides x.

   **Why:** after this one-time work, each number can be split almost instantly.

3. **Build it like the Sieve of Eratosthenes:** start with `spf[x] = x`. For each i with `spf[i] == i` (i is prime), go through i·i, i·i + i, … and set `spf[j] = i` wherever `spf[j]` still equals j.

   **Why:** the first prime to reach j is its smallest prime factor, and "still equals j" keeps that first one.

4. **To factor x:** while x > 1, record `spf[x]` and divide x by it.

   **Why:** each step divides x by at least 2, so it takes at most about 18 steps for numbers up to 200 000.

5. **The factors come out sorted on their own.**

   **Why:** the smallest prime factor of what is left never goes down.

6. **Build the table once,** not once per number.

## How fast is it?

The table takes about O(N log log N) time and O(N) memory, with N = 200 000. Each number then takes O(log x).

## Walk through (x = 18)

spf[18] = 2 → [2], x = 9. spf[9] = 3 → [2, 3], x = 3. spf[3] = 3 → [2, 3, 3], x = 1. Done.

## Check your solution

1. Write your solution first, and check it on the visible tests.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. It prints every failed test, then "x / y tests passed". The last test has 10⁵ queries, so a slow solution shows up as a long run.

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    vector<vector<int>> primeFactors(vector<int>& queries) {
        // Write your solution here.
        return {};
    }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}
string show2(const vector<vector<int>>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size() && i < 8; i++) s += (i ? ", " : "") + show(v[i]);
    return s + (v.size() > 8 ? ", ...]" : "]");
}

int main() {
    vector<pair<vector<int>, vector<vector<int>>>> tests = {
        {{2, 3, 4, 5, 6}, {{2}, {3}, {2, 2}, {5}, {2, 3}}},
        {{7, 12, 18}, {{7}, {2, 2, 3}, {2, 3, 3}}},
        {{15, 20}, {{3, 5}, {2, 2, 5}}},
        {{200000}, {{2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5}}},
        {{199999}, {{199999}}},
        {{131072}, {{2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2}}},
        {{8633, 30030, 1024, 999, 196418},
         {{89, 97}, {2, 3, 5, 7, 11, 13}, {2, 2, 2, 2, 2, 2, 2, 2, 2, 2}, {3, 3, 3, 37}, {2, 17, 53, 109}}},
    };
    // A big test: 100000 queries, checked by multiplying the factors back.
    vector<int> big;
    for (int i = 0; i < 100000; i++) big.push_back(2 + (int)((i * 7919LL) % 199999));

    int passed = 0, total = tests.size() + 1;
    for (size_t i = 0; i < tests.size(); i++) {
        vector<int> q = tests[i].first;
        auto got = Solution().primeFactors(q);
        if (got == tests[i].second) passed++;
        else cout << "Test " << i + 1 << " failed: queries = " << show(tests[i].first)
                  << "\n  expected " << show2(tests[i].second) << "\n  got      " << show2(got) << "\n";
    }
    auto start = chrono::steady_clock::now();
    vector<int> q = big;
    auto got = Solution().primeFactors(q);
    double secs = chrono::duration<double>(chrono::steady_clock::now() - start).count();
    bool ok = got.size() == big.size();
    for (size_t i = 0; ok && i < big.size(); i++) {
        long long prod = 1;
        for (size_t j = 0; j < got[i].size(); j++) {
            int p = got[i][j];
            if (p < 2 || (j && p < got[i][j - 1])) ok = false;
            for (int d = 2; ok && (long long)d * d <= p; d++) if (p % d == 0) ok = false;
            prod *= p;
        }
        if (prod != big[i]) ok = false;
    }
    if (ok) passed++;
    else cout << "Test " << total << " failed: 100000 queries, some factor list is wrong\n";
    cout << passed << " / " << total << " tests passed (the big test took " << fixed
         << setprecision(2) << secs << " s)\n";
}
```
:::

:::hidden Full solution (C++)
```cpp
class Solution {
public:
    vector<vector<int>> primeFactors(vector<int>& queries) {
        int N = 2;
        for (int x : queries) N = max(N, x);
        vector<int> spf(N + 1);
        iota(spf.begin(), spf.end(), 0);                 // spf[x] = x to start
        for (long long i = 2; i * i <= N; i++)
            if (spf[i] == i)                             // i is prime
                for (long long j = i * i; j <= N; j += i)
                    if (spf[j] == j) spf[j] = i;         // first (smallest) prime wins

        vector<vector<int>> ans;
        ans.reserve(queries.size());
        for (int x : queries) {
            vector<int> f;
            while (x > 1) {                              // at most log2(x) steps
                f.push_back(spf[x]);
                x /= spf[x];
            }
            ans.push_back(f);                            // already sorted
        }
        return ans;
    }
};
```
:::
