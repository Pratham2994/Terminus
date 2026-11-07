# Expression Add Operators

> Solve it on [LeetCode 282 · Expression Add Operators](https://leetcode.com/problems/expression-add-operators/).

## The problem

Given a digit string num (length ≤ 10) and a target, insert '+', '−' or '*' between digits, or nothing (which joins digits into a longer number). Return every expression that evaluates to target, with normal precedence: * before + and −. Numbers may not have leading zeros ("05" is not allowed, "0" is).

Examples: "123", 6 → `["1*2*3","1+2+3"]`. "105", 5 → `["1*0+5","10-5"]`. "3456237490", 9191 → **[]**.

## The idea: backtracking over the next number

At position i, choose where the **next number** ends (j = i … n−1). That number is num[i..j]. Then choose the operator in front of it.

The hard part is `*`, because it binds tighter. Track two values while building:

- `value`: what the expression so far evaluates to.
- `last`: the last **term** that was added. It is +x for '+', −x for '−', or the running product for '*'.

Then:

- '+' x → value + x, last = x.
- '−' x → value − x, last = −x.
- '*' x → **value − last + last × x**, last = last × x. Remove the last term, and add it back multiplied by x.

Example: "2+3*4". After "2+3", value = 5, last = 3. Then "*4" → 5 − 3 + 3 × 4 = 14 ✓.

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

## Complexity

- Time: O(4ⁿ · n). Each gap between digits has 4 choices (+, −, *, join), and building each expression costs O(n).
- Space: O(n) recursion depth, plus the output.

## Edge cases

- `long long` is required. A 10-digit number like 9999999999 does not fit in `int`.
- Leading zeros: once num[i] is '0', "0" alone is allowed, but nothing longer. The `break` handles that.
- `expr.resize(len)` undoes each choice before trying the next one.

## Dry run ("105", 5)

- First number "1": then "0" → "1+0", "1-0", "1*0" … then "5": "1*0+5" = 0 + 5 = 5 ✓.
- First number "10": then "5": "10-5" = 5 ✓. "10+5" = 15, "10*5" = 50.
- First number "105" = 105 ✗.

Answer: `["1*0+5", "10-5"]`. (Tested on 400 random inputs against trying every operator combination and evaluating it.)
