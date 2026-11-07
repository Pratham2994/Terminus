# Minimum number of bracket reversals to make an expression balanced

> takeUforward's page needs Plus, and its LeetCode link is a different problem (LeetCode 921 adds brackets instead of flipping them). Practise on GeeksforGeeks (the **Similar** link above): the same problem with curly brackets. The box below shows the difference.

## What you need to do

The string has only `(` and `)`. One **reversal** flips a bracket. Find the fewest reversals that make the string balanced, or return **−1** if it cannot be done.

## What is different on GfG

| | takeUforward | GfG "Minimum Bracket Reversals to Balance" |
|---|---|---|
| Brackets | `(` and `)` | `{` and `}` |
| Function | `int countRev(string s)` | `int countMinReversals(string s)` |

**In short:** identical logic. Only the bracket characters change.

## Example

`)(())(((` → **3**.

## How to solve it, step by step

1. **Odd length → −1.**

   **Why:** a flip never changes the length, and a balanced string always has even length. Every even-length string can be balanced.

2. **Cancel the pairs that already match.** Walk left to right: `(` adds one open bracket; `)` closes an open one if there is any, otherwise it is an unmatched `)`.

   **Why:** matched pairs never need flipping, so set them aside.

3. **What is left looks like `)))…(((`:** some unmatched `)` (call it `close`) followed by some unmatched `(` (call it `open`).

4. **Fix them in pairs:** `))` needs one flip to become `()`, and so does `((`. So the answer is ⌈open / 2⌉ + ⌈close / 2⌉.

   **Why:** when both counts are odd, one `)(` is left over, and it needs 2 flips. The rounding up adds exactly those 2.

## Code for GfG (submit this there)

```cpp
class Solution {
  public:
    int countMinReversals(string s) {
        if (s.size() % 2 == 1) return -1;
        int open = 0, close = 0;
        for (char c : s) {
            if (c == '{') open++;
            else if (open > 0) open--;
            else close++;
        }
        return (open + 1) / 2 + (close + 1) / 2;
    }
};
```

## How fast is it?

One pass: O(n) time, no extra memory.

## Watch out for

- `)(` needs **2** flips: open = 1 and close = 1 gives 1 + 1.
- `(x + 1) / 2` is "x / 2 rounded up" with whole numbers.

## Walk through (`)(())(((`)

- `)` → nothing open → close = 1.
- `(` `(` → open = 2. `)` `)` → open = 0.
- `(` `(` `(` → open = 3.
- Left over: close = 1, open = 3 → ⌈3/2⌉ + ⌈1/2⌉ = 2 + 1 = **3**.

(Tested on 3 000 random strings against trying every set of flips.)

## Check takeUforward's version

1. Write `countRev` yourself first (try it before reading the code above).
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
    int countRev(string s) {
        // Write your solution here.
        return -2;
    }
};
// ==================== YOUR CODE END ====================

int main() {
    vector<pair<string, int>> tests = {
        {")(())(((", 3}, {")(", 2}, {"((", 1}, {"(((", -1}, {")))(((", 4}, {"()()", 0}, {"))((", 2},
        {"(((()", -1}, {")", -1}, {"))))", 2}, {"()))((", 2}, {")))(((()()()", 4}, {")(()()))()", 1},
        {"(()))(()", 2}, {"()))()", 1}, {"())(()((", 3},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        int got = Solution().countRev(tests[i].first);
        if (got == tests[i].second) passed++;
        else cout << "Test " << i + 1 << " failed: s = \"" << tests[i].first << "\", expected "
                  << tests[i].second << ", got " << got << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution for takeUforward's version (C++)
```cpp
class Solution {
public:
    int countRev(string s) {
        if (s.size() % 2 == 1) return -1;
        int open = 0, close = 0;                 // unmatched '(' and ')'
        for (char c : s) {
            if (c == '(') open++;
            else if (open > 0) open--;            // pairs with an earlier '('
            else close++;
        }
        return (open + 1) / 2 + (close + 1) / 2;
    }
};
```
:::
