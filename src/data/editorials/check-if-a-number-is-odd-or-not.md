# Check if a Number is Odd or Not

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above), "Odd or Even": it asks the **opposite** question, `bool isEven(int n)`, true for even. Both versions are below, with a self-check for takeUforward's version (the self-check uses `bool isOdd(int n)`). The free editorial and video above cover it too.

## The problem

Given a non-negative integer n, return true if n is **odd**.

## Visible tests

| n | Odd? |
|---|---|
| 7 | true |
| 0 | false |
| 10 | false |

## Step by step

1. **The usual way:** n is odd when it leaves remainder 1 on division by 2: `n % 2 == 1`.
2. **The bit way (what this station is about):** in binary, the **last bit** of a number is its remainder mod 2. Odd numbers end in 1, even numbers in 0: 7 = 11**1**, 10 = 101**0**.
3. `n & 1` keeps only the last bit, so **`(n & 1) == 1`** means odd. It is one CPU instruction, and it is also correct for negative numbers in two's complement (`-3 & 1` is 1), while `-3 % 2` is −1 in C++.
4. GfG's version is the negation: even ⇔ `(n & 1) == 0`.

## Code for GfG (submit this there)

```cpp
class Solution {
  public:
    bool isEven(int n) {
        return (n & 1) == 0;      // last bit 0 => even
    }
};
```

## Complexity

O(1) time and space.

## Edge cases

- n = 0 is even, so not odd.
- Write `(n & 1) == 1` with brackets: `n & 1 == 1` means `n & (1 == 1)`, which happens to work, but `n & 1 == 0` means `n & 0`, which is always 0. Always bracket bit operations.

## Check takeUforward's version

1. Write `isOdd` first.
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
    bool isOdd(int n) {
        // Write your solution here.
        return n < 0;
    }
};
// ==================== YOUR CODE END ====================

int main() {
    vector<pair<int, bool>> tests = {
        {7, true}, {0, false}, {10, false}, {1, true}, {2, false}, {99, true}, {100, false},
        {2147483647, true}, {2147483646, false}, {1024, false}, {1023, true}, {65537, true},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        bool got = Solution().isOdd(tests[i].first);
        if (got == tests[i].second) passed++;
        else cout << "Test " << i + 1 << " failed: n = " << tests[i].first << ", expected "
                  << (tests[i].second ? "true" : "false") << ", got " << (got ? "true" : "false") << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution for takeUforward's version (C++)
```cpp
class Solution {
public:
    bool isOdd(int n) {
        return (n & 1) == 1;      // last bit 1 => odd
    }
};
```
:::
