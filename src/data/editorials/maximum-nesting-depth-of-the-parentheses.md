# Maximum Nesting Depth of the Parentheses

> Solve it on [LeetCode 1614 · Maximum Nesting Depth of the Parentheses](https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/).

## What you need to do

s is a valid maths expression with brackets. Find the **most brackets open at the same time**.

## Examples

- "(1+(2*3)+((8)/4))+1" → **3** (around the 8)
- "(1)+((2))+(((3)))" → **3**

## How to solve it, step by step

1. **Keep a counter `depth`,** starting at 0.

   **Why:** you only need to know how many brackets are open, not which ones, so a counter is enough. No stack needed.

2. **On `(`, add 1, and remember the biggest depth seen so far.**

   **Why:** the moment right after opening a bracket is when depth is highest.

3. **On `)`, subtract 1. Ignore every other character.**

4. **Return the biggest depth seen.**

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

## How fast is it?

One pass: O(n) time, O(1) memory.

## Watch out for

- No brackets at all ("1+2") → 0.

## Walk through ("(1+(2*3)+((8)/4))+1")

( → 1, ( → 2, ) → 1, ( → 2, ( → **3**, ) → 2, ) → 1, ) → 0. Answer: **3**.
