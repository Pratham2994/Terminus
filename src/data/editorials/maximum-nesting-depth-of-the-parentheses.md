# Maximum Nesting Depth of the Parentheses

> Solve it on [LeetCode 1614 · Maximum Nesting Depth of the Parentheses](https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/).

## The problem

s is a valid expression with digits, + - * / and parentheses. Return the maximum number of parentheses open at the same time.

Examples: "(1+(2*3)+((8)/4))+1" → **3** (around the 8). "(1)+((2))+(((3)))" → **3**.

## Idea: a running counter

You do not need a stack. A counter is enough:

- '(' → depth + 1, and update the best seen so far.
- ')' → depth − 1.
- Anything else → ignore.

The answer is the highest value depth ever reaches. Because s is valid, depth never goes below 0.

## Code (C++)

```cpp
class Solution {
public:
    int maxDepth(string s) {
        int depth = 0, best = 0;
        for (char c : s) {
            if (c == '(') best = max(best, ++depth);
            else if (c == ')') depth--;
        }
        return best;
    }
};
```

## Complexity

- Time: O(n).
- Space: O(1).

## Edge cases

- No parentheses ("1+2") → 0.
- Update `best` right after the increment, at the moment depth is highest.

## Dry run ("(1+(2*3)+((8)/4))+1")

- ( → 1, best 1. ( → 2, best 2. ) → 1. ( → 2. ( → 3, best **3**. ) → 2. ) → 1. ) → 0.

Answer: **3**.
