# Count number of odd digits in a number

> No free judge has this exact problem, so Terminus is your judge. Solve it with the visible tests, then run the hidden tests with the self-check program at the bottom in a free online compiler. takeUforward's function is `int countOddDigit(int n)`.

## The problem

You get a non-negative integer n (0 ≤ n ≤ 5000). Return how many of its digits are **odd** (1, 3, 5, 7 or 9).

## Visible tests

| n | Answer | Why |
|---|---|---|
| 5 | 1 | 5 is odd |
| 25 | 1 | only 5 is odd |
| 15 | 2 | 1 and 5 are odd |

## Step by step

1. **How do you get the last digit of a number?** `n % 10`. For 2735 that is 5.
2. **How do you drop that digit?** `n / 10` (integer division). 2735 becomes 273.
3. So repeat: look at `n % 10`, then do `n = n / 10`, until n is 0. That visits every digit, right to left.
4. A digit d is odd when `d % 2 == 1`. Count those.
5. **Check the edge case before you code:** n = 0. The loop `while (n > 0)` never runs, so the count is 0. That is correct: 0 is an even digit. (In "count all digits", n = 0 needs care. Here it does not.)

## Complexity

- Time: O(number of digits) = O(log₁₀ n). For n ≤ 5000, at most 4 steps.
- Space: O(1).

## Dry run (n = 3010)

| n | n % 10 | odd? | count |
|---|---|---|---|
| 3010 | 0 | no | 0 |
| 301 | 1 | yes | 1 |
| 30 | 0 | no | 1 |
| 3 | 3 | yes | 2 |

Answer: **2**.

## Check your solution

1. Write your solution first, and test it by hand on the visible tests.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between the `YOUR CODE START` and `YOUR CODE END` lines with your own class.
5. Press Run. It prints every failed test (input, expected, what you returned), then "x / y tests passed".

Try not to read the tests before you run them. They hold the edge cases.

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    int countOddDigit(int n) {
        // Write your solution here.
        return -1;
    }
};
// ==================== YOUR CODE END ====================

int main() {
    // {n, expected answer}
    vector<pair<int, int>> tests = {
        {5, 1}, {25, 1}, {15, 2},
        {0, 0}, {1, 1}, {2, 0}, {10, 1}, {100, 1}, {7, 1}, {999, 3}, {1111, 4},
        {2468, 0}, {3010, 2}, {4321, 2}, {4999, 3}, {5000, 1}, {1357, 4}, {2000, 0},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        int got = Solution().countOddDigit(tests[i].first);
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
    int countOddDigit(int n) {
        int count = 0;
        while (n > 0) {
            int digit = n % 10;          // last digit
            if (digit % 2 == 1) count++;
            n /= 10;                     // drop it
        }
        return count;                    // n = 0 gives 0: 0 is even
    }
};
```
:::
