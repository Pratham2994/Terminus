# Generate Parentheses

> Solve it on [LeetCode 22 · Generate Parentheses](https://leetcode.com/problems/generate-parentheses/).

## What you need to do

Given n pairs of brackets, list **every** correctly matched arrangement.

## Example

n = 3 → **["((()))", "(()())", "(())()", "()(())", "()()()"]**.

## How to solve it, step by step

1. **Build the string one bracket at a time.** Keep two counts: `open` (how many `(` used) and `close` (how many `)` used).

   **Why:** these two numbers are all you need to know which bracket is allowed next.

2. **Add `(` if you have not used all n yet** (`open < n`).

   **Why:** you have exactly n of them to place.

3. **Add `)` only if there is an open bracket to close** (`close < open`).

   **Why:** a `)` with nothing to close can never be fixed later.

4. **When the string has 2n brackets, save it.**

   **Why:** both rules held the whole way, so every finished string is valid. There are no dead ends.

5. **Add a bracket, recurse, then remove it again (`push_back`, then `pop_back`).**

   **Why:** this "backtracking" reuses one string instead of copying it at every step.

## Code (C++)

```cpp
class Solution {
    void build(int n, int open, int close, string& cur, vector<string>& out) {
        if ((int)cur.size() == 2 * n) { out.push_back(cur); return; }
        if (open < n) {
            cur.push_back('(');
            build(n, open + 1, close, cur, out);
            cur.pop_back();
        }
        if (close < open) {
            cur.push_back(')');
            build(n, open, close + 1, cur, out);
            cur.pop_back();
        }
    }
public:
    vector<string> generateParenthesis(int n) {
        vector<string> out;
        string cur;
        build(n, 0, 0, cur, out);
        return out;
    }
};
```

## How fast is it?

The number of answers is the n-th Catalan number (42 for n = 5, 1430 for n = 8). The total work is about O(4ⁿ / √n). Recursion depth: 2n.

## Watch out for

- The test is `close < open`, not `close < n`. With `close < n`, strings like "())(" get through.

## Walk through (n = 2)

- "(" → "((" → "(()" → "(())" ✓.
- Back to "(" → "()" → "()(" → "()()" ✓.

Answer: **["(())", "()()"]**. (Tested for n = 1…8: the count matches the Catalan number, and every string is valid and different.)
