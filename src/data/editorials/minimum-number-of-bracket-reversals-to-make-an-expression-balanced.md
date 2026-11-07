# Minimum number of bracket reversals to make an expression balanced

> takeUforward's page for this needs Plus. Its LeetCode link points to a **different** problem (LeetCode 921 adds brackets instead of reversing them). GeeksforGeeks has the same problem with `{ }` instead of `( )` (the **Similar** link above), as `int countMinReversals(string s)`. Both versions are below, with a self-check for takeUforward's `int countRev(string s)`.

## The problem

s contains only '(' and ')'. One **reversal** flips a bracket. Return the minimum number of reversals that make s balanced, or **−1** if it is impossible.

Example: ")(())(((" → **3**.

## Step 1: when is it impossible?

A reversal never changes the length, and a balanced string has even length. So **odd length → −1**. Every even-length string can be balanced.

## Step 2: cancel what already matches

Scan left to right, like checking valid parentheses:

- '(' → one more unmatched open.
- ')' → if there is an unmatched '(', pair them. Otherwise it is an unmatched close.

What is left has the shape `)))…(((`: `close` unmatched ')' followed by `open` unmatched '('. Matched pairs never need a reversal.

## Step 3: fix the leftover

- Every **two** ')' can be fixed with one reversal: "))" → "()". So ⌈close / 2⌉.
- Every **two** '(' likewise: "((" → "()". So ⌈open / 2⌉.
- Since the length is even, open and close are both even or both odd. When both are odd, the last ")(" needs 2 reversals → "()". The ceilings add exactly those 2.

**Answer = ⌈open / 2⌉ + ⌈close / 2⌉.**

## Code for GfG (submit this there)

Same logic; only the characters change: `{` plays `(` and `}` plays `)`.

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

## Code for takeUforward's version (C++)

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

## Complexity

- Time: O(n).
- Space: O(1).

## Edge cases

- ")(" → open = 1, close = 1 → 1 + 1 = **2**. Both must flip.
- Already balanced → 0.
- `(x + 1) / 2` is ⌈x / 2⌉ in integer arithmetic.

## Dry run (")(())(((")

- ')' → no open → close = 1.
- '(' '(' → open = 2. ')' ')' → open = 0.
- '(' '(' '(' → open = 3.
- Leftover: close = 1, open = 3 → ⌈3/2⌉ + ⌈1/2⌉ = 2 + 1 = **3**.

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
