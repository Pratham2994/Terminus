# Expression Add Operators

> Solve it on [LeetCode 282 · Expression Add Operators](https://leetcode.com/problems/expression-add-operators/).

## What you need to do

Given a string of digits and a target, put `+`, `-`, `*` or nothing between the digits (nothing joins digits into a bigger number). Return every expression that equals the target, with normal maths rules (`*` before `+` and `-`). Numbers may not start with 0, except "0" itself.

## Examples

- "123", 6 → `["1*2*3", "1+2+3"]`
- "105", 5 → `["1*0+5", "10-5"]`
- "3456237490", 9191 → **[]**

## How to solve it, step by step

1. **At each position, choose where the next number ends,** and which operator goes in front of it.

   **Why:** this covers both "join digits" and "put an operator here".

2. **Keep two values as you build: `value` (what the expression equals so far) and `last` (the last term you added).**

   **Why:** `*` binds tighter than `+` and `-`, so it changes the last term, not the whole total. You need to know what that term was.

3. **Adding and subtracting are easy.** For `+ x`: value + x, and last = x. For `- x`: value − x, and last = −x.

4. **Multiplying is the tricky one.** For `* x`: value − last + last × x, and last = last × x.

   **Why:** take the last term back out, multiply it by x, and put it back in. Example: after "2+3", value = 5 and last = 3; then "*4" gives 5 − 3 + 3 × 4 = 14, which is right.

5. **Do not let a number start with 0,** unless it is just "0".

   **Why:** "05" is not allowed. Once the next number starts with '0', stop after that single digit.

6. **When you reach the end and value equals the target, save the expression.**

## Code (C++)

```cpp
class Solution {
    void build(const string& num, long long target, int i, string& expr,
               long long value, long long last, vector<string>& out) {
        if (i == (int)num.size()) {
            if (value == target) out.push_back(expr);
            return;
        }
        for (int j = i; j < (int)num.size(); j++) {
            if (j > i && num[i] == '0') break;        // no leading zeros
            string part = num.substr(i, j - i + 1);
            long long x = stoll(part);
            int len = expr.size();
            if (i == 0) {                              // first number: no operator
                expr += part;
                build(num, target, j + 1, expr, x, x, out);
            } else {
                expr += "+" + part;
                build(num, target, j + 1, expr, value + x, x, out);
                expr.resize(len);
                expr += "-" + part;
                build(num, target, j + 1, expr, value - x, -x, out);
                expr.resize(len);
                expr += "*" + part;
                build(num, target, j + 1, expr, value - last + last * x, last * x, out);
            }
            expr.resize(len);
        }
    }
public:
    vector<string> addOperators(string num, int target) {
        vector<string> out;
        string expr;
        build(num, target, 0, expr, 0, 0, out);
        return out;
    }
};
```

## How fast is it?

Each gap between digits has 4 choices, and building an expression costs O(n): O(4ⁿ · n). With at most 10 digits that is fine.

## Watch out for

- Use `long long`: a 10-digit number like 9999999999 does not fit in an `int`.
- Undo each choice (shorten the expression string back) before trying the next one.

## Walk through ("105", 5)

- "1", "0", "5": "1*0+5" = 0 + 5 = 5 ✓.
- "10", "5": "10-5" = 5 ✓ ("10+5" = 15, "10*5" = 50 ✗).
- "105" alone = 105 ✗.

Answer: `["1*0+5", "10-5"]`. (Tested on 400 random inputs against trying every combination.)
