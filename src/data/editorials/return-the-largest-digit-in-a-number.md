# Return the Largest Digit in a Number

> No free judge has this exact problem, so Terminus is your judge. Solve it with the tests below, then check it with the self-check program at the bottom. The function here is `int largestDigit(int n)`.

## What you need to do

Return the **biggest digit** in n. n is between 0 and 5000.

## Visible tests

| n | Answer |
|---|---|
| 25 | 5 |
| 99 | 9 |
| 1 | 1 |

## How to solve it, step by step

1. **Walk through the digits:** `n % 10` gives the last digit, and `n /= 10` removes it. Repeat until n is 0.

   **Why:** this is the standard way to visit every digit of a number.

2. **Keep the biggest digit seen so far in `best`.** Compare each new digit with it.

   **Why:** you only need the winner, not all the digits.

3. **Start `best` at 0.**

   **Why:** every digit is at least 0, so 0 never beats a real digit. It also gives the right answer for n = 0, where the loop does not run.

4. **Optional: stop early once `best` is 9.**

   **Why:** no digit can beat 9.

## How fast is it?

One step per digit: O(number of digits). No extra memory.

## Walk through (n = 2999)

Digits from the right: 9 → best 9, then 9, 9, 2. Answer: **9**.

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
