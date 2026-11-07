# Return the Largest Digit in a Number

> No free judge has this exact problem, so Terminus is your judge. Solve it with the visible tests, then run the hidden tests with the self-check program at the bottom in a free online compiler. The function here is `int largestDigit(int n)`.

## The problem

You get a non-negative integer n (0 ≤ n ≤ 5000). Return the **largest digit** in it.

## Visible tests

| n | Answer |
|---|---|
| 25 | 5 |
| 99 | 9 |
| 1 | 1 |

## Step by step

1. Visit every digit with the usual pair: `n % 10` gives the last digit, `n /= 10` removes it.
2. Keep a running maximum, `best`. Compare each digit with it.
3. **What should `best` start at?** Digits are 0 … 9, so 0 is safe. Every digit is ≥ 0.
4. **Edge case: n = 0.** A `while (n > 0)` loop does not run at all, and you return the start value 0. That is the right answer, because the number 0 has one digit, 0. Make sure your start value really is 0 and not −1.
5. Small speed-up (optional): once `best` is 9 you can stop. Nothing beats 9.

## Complexity

- Time: O(number of digits) = O(log₁₀ n).
- Space: O(1).

## Dry run (n = 2999)

Digits seen right to left: 9 → best 9, then 9, 9, 2. Answer: **9**.

## Check your solution

1. Write your solution first, and check it on the visible tests.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. It prints every failed test, then "x / y tests passed".

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    int largestDigit(int n) {
        // Write your solution here.
        return -1;
    }
};
// ==================== YOUR CODE END ====================

int main() {
    // {n, expected answer}
    vector<pair<int, int>> tests = {
        {25, 5}, {99, 9}, {1, 1},
        {0, 0}, {7, 7}, {10, 1}, {100, 1}, {909, 9}, {1234, 4}, {4321, 4},
        {5000, 5}, {3003, 3}, {2999, 9}, {1110, 1}, {8, 8}, {4567, 7}, {2020, 2},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        int got = Solution().largestDigit(tests[i].first);
        if (got == tests[i].second) passed++;
        else cout << "Test " << i + 1 << " failed: n = " << tests[i].first
                  << ", expected " << tests[i].second << ", got " << got << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution (C++)
```cpp
class Solution {
public:
    int largestDigit(int n) {
        int best = 0;                    // digits are >= 0, and n = 0 must give 0
        while (n > 0) {
            best = max(best, n % 10);
            n /= 10;
        }
        return best;
    }
};
```
:::
