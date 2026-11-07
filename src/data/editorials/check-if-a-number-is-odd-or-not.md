# Check if a Number is Odd or Not

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above). It asks the opposite question; the box below shows the difference. The free editorial and video above cover it too.

## What you need to do

Return true if n is **odd**.

## What is different on GfG

| | takeUforward | GfG "Odd or Even" |
|---|---|---|
| Question | is n **odd**? | is n **even**? |
| Returns true for | 7, 1, 99 | 0, 10, 44 |
| Function | `bool isOdd(int n)` in the self-check | `bool isEven(int n)` |

**In short:** the same idea, with the answer flipped. Check the last bit; on GfG return true when it is 0.

## Example

- 7 → odd → **true** (GfG: false).
- 10 → even → **false** (GfG: true).
- 0 → even → **false** (GfG: true).

## How to solve it, step by step

1. **The usual way:** n is odd when `n % 2 == 1`.

   **Why:** odd numbers leave remainder 1 when divided by 2.

2. **The bit way (what this station is about):** look at the **last binary bit**. `(n & 1) == 1` means odd.

   **Why:** in binary, the last bit is the remainder when dividing by 2. 7 is 11**1**, 10 is 101**0**.

3. **For GfG, flip it:** even means `(n & 1) == 0`.

## Code for GfG (submit this there)

```cpp
class Solution {
  public:
    bool isEven(int n) {
        return (n & 1) == 0;      // last bit 0 => even
    }
};
```

## How fast is it?

One operation: O(1).

## Watch out for

- Put brackets around bit operations: `n & 1 == 0` means `n & (1 == 0)`, which is always 0.

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
