# Remove Outermost Parentheses

> Solve it on [LeetCode 1021 · Remove Outermost Parentheses](https://leetcode.com/problems/remove-outermost-parentheses/).

## What you need to do

s is a valid bracket string. Split it into its smallest balanced pieces (called **primitive** pieces). From each piece, remove its outer pair of brackets, and return what is left.

## Example

"(()())(())" splits into "(()())" and "(())". Removing their outer pairs leaves "()()" and "()". Answer: **"()()()"**.

## How to solve it, step by step

1. **Keep a counter `depth`:** how many `(` are open right now.

   **Why:** the outer brackets of a piece are exactly the ones at depth 0.

2. **On `(`: if depth is already above 0, keep this bracket. Then add 1 to depth.**

   **Why:** a `(` seen at depth 0 opens a new piece, so it is an outer bracket. Any other `(` is inside a piece.

3. **On `)`: first subtract 1 from depth. If depth is still above 0, keep this bracket.**

   **Why:** the `)` that brings depth back to 0 closes the piece, so it is the outer bracket. Any other `)` is inside.

4. **The order is the whole trick:** check before adding on `(`, and check after subtracting on `)`.

## Code (C++)

```cpp
class Solution {
public:
    string removeOuterParentheses(string s) {
        string out;
        int depth = 0;
        for (char c : s) {
            if (c == '(') {
                if (depth > 0) out += c;
                depth++;
            } else {
                depth--;
                if (depth > 0) out += c;
            }
        }
        return out;
    }
};
```

## How fast is it?

One pass: O(n) time. No extra memory besides the answer.

## Watch out for

- "()" → "": one piece with nothing inside.

## Walk through (the first piece, "(()())")

| bracket | depth before | keep? | depth after |
|---|---|---|---|
| ( | 0 | no (outer) | 1 |
| ( | 1 | yes | 2 |
| ) | 2 | yes | 1 |
| ( | 1 | yes | 2 |
| ) | 2 | yes | 1 |
| ) | 1 | no (back to 0) | 0 |

Kept: "()()". The second piece works the same way. Answer: **"()()()"**.
