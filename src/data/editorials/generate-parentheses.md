# Generate Parentheses

> Solve it on [LeetCode 22 · Generate Parentheses](https://leetcode.com/problems/generate-parentheses/).

## The problem

Given n pairs of parentheses, return **every** well-formed combination. n ≤ 8.

Example: n = 3 → **["((()))","(()())","(())()","()(())","()()()"]**.

## Brute force

Generate all 2²ⁿ strings of '(' and ')', and keep the valid ones.

- Time: O(2²ⁿ · n). For n = 8, that is 65 536 strings, so it passes, but almost all of the work is wasted on invalid strings.

## The better idea: only build valid strings

Build the string one character at a time, and only add a character that can still lead to a valid string:

- **Add '('** if fewer than n have been used (`open < n`).
- **Add ')'** only if it closes something (`close < open`). This guarantees no prefix ever has more ')' than '('.

When the length reaches 2n, the string is valid. Record it.

Both rules together mean every branch of the recursion ends in a valid answer: no dead ends.

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

## Complexity

- The number of answers is the n-th **Catalan number**, about 4ⁿ / (n^1.5 √π). Each costs O(n) to copy.
- Time: O(4ⁿ / √n). Space: O(n) recursion depth, plus the output.

## Edge cases

- n = 1 → ["()"].
- `push_back` + `pop_back` (backtracking) reuses one string instead of copying it at every step.

## Dry run (n = 2)

- "(" → "((" → "(()" → "(())" ✓.
- Back to "(" → "()" → "()(" → "()()" ✓.

Answer: **["(())", "()()"]**. (Tested: for n = 1…8, the count equals the Catalan number, with all strings distinct and valid.)
