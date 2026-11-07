# Rotate String

> Solve it on [LeetCode 796 · Rotate String](https://leetcode.com/problems/rotate-string/).

## What you need to do

One **shift** moves the first character of s to the end ("abcde" → "bcdea"). Return true if some number of shifts turns s into goal.

## Examples

- s = "abcde", goal = "cdeab" → **true**
- s = "abcde", goal = "abced" → **false**

## How to solve it, step by step

1. **The simple idea:** make every rotation of s and compare each one with goal.

   **Why it works but is clumsy:** n rotations of length n each is O(n²) work.

2. **Write s twice: s + s.** For "abcde" that is "abcdeabcde".

   **Why:** every rotation of s appears inside s + s as a piece of length n: abcde, bcdea, cdeab, deabc, eabcd.

3. **So goal is a rotation exactly when it has the same length as s, and it appears inside s + s.**

   **Why the length check matters:** without it, goal = "ab" would pass for s = "abc", because "ab" appears inside "abcabc".

## Code (C++)

```cpp
class Solution {
public:
    bool rotateString(string s, string goal) {
        return s.size() == goal.size() && (s + s).find(goal) != string::npos;
    }
};
```

## How fast is it?

`find` is O(n²) in the worst case, but this is one line and fast in practice. With KMP (see the KMP station) the search is O(n). It uses O(n) memory for s + s.

## Watch out for

- Different lengths → false straight away.
- goal == s → true: zero shifts.

## Walk through (abcde, cdeab)

Lengths match (5 = 5). s + s = "abcdeabcde", and "cdeab" starts at index 2 → **true**.
