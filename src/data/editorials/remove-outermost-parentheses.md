# Remove Outermost Parentheses

> Solve it on [LeetCode 1021 · Remove Outermost Parentheses](https://leetcode.com/problems/remove-outermost-parentheses/).

## The problem

s is a valid parentheses string. Split it into **primitive** parts: the smallest balanced pieces that cannot be split further. Remove the outermost pair of every primitive part and return what is left.

Example: "(()())(())" → primitives "(()())" and "(())" → remove their outer pairs → "()()" + "()" = **"()()()"**.

## Brute force

Track the balance. Each time it returns to 0, a primitive part ends: cut it out, drop its first and last character, and append the rest.

That is already O(n), but it builds substrings. We can do it in one pass, character by character.

## The better idea: depth counter

Keep `depth` = how many '(' are open right now.

- On '(': if depth is already > 0, this bracket is **inside** a primitive, so keep it. Then depth++.
- On ')': depth−− first. If depth is still > 0, this ')' is inside, so keep it. If depth hits 0, it is the outer closing bracket, so drop it.

The outer '(' of a primitive is exactly the one seen at depth 0, and the outer ')' is exactly the one that brings depth back to 0.

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

## Complexity

- Time: O(n).
- Space: O(1) besides the output string.

## Edge cases

- "()" → "" (one primitive with nothing inside).
- The order of the check and the update is the whole trick: check **before** incrementing on '(', and **after** decrementing on ')'.

## Dry run ("(()())(())")

| char | depth before | keep? | depth after |
|---|---|---|---|
| ( | 0 | no (outer) | 1 |
| ( | 1 | yes | 2 |
| ) | 2 | yes (after: 1) | 1 |
| ( | 1 | yes | 2 |
| ) | 2 | yes | 1 |
| ) | 1 | no (after: 0) | 0 |

The second primitive works the same way. Answer: **"()()()"**.
