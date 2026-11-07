# Count number of odd digits in a number

> No free judge has this exact problem, so Terminus is your judge. Solve it with the tests below, then check it with the self-check program at the bottom. takeUforward's function is `int countOddDigit(int n)`.

## What you need to do

Count how many digits of n are **odd** (1, 3, 5, 7 or 9). n is between 0 and 5000.

## Visible tests

| n | Answer | Why |
|---|---|---|
| 5 | 1 | 5 is odd |
| 25 | 1 | only 5 is odd |
| 15 | 2 | 1 and 5 are both odd |

## How to solve it, step by step

1. **Get the last digit with `n % 10`.** For 2735, that is 5.

   **Why:** dividing by 10 leaves the last digit as the remainder.

2. **Remove the last digit with `n = n / 10`.** 2735 becomes 273.

   **Why:** integer division by 10 drops the last digit.

3. **Repeat steps 1 and 2 until n is 0.**

   **Why:** this visits every digit, from right to left, and stops when none are left.

4. **Count the digits where `digit % 2 == 1`.**

   **Why:** an odd digit leaves remainder 1 when divided by 2.

5. **Check n = 0 before you code.** The loop does not run, so the answer is 0.

   **Why:** 0 is an even digit, so 0 is the right answer here.

## How fast is it?

One step per digit: O(number of digits). For n ≤ 5000, that is at most 4 steps. No extra memory.

## Walk through (n = 3010)

| n | last digit | odd? | count |
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
