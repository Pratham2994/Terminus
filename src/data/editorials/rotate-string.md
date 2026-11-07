# Rotate String

> Solve it on [LeetCode 796 · Rotate String](https://leetcode.com/problems/rotate-string/).

## The problem

One **shift** moves the first character of s to the end ("abcde" → "bcdea"). Return true if some number of shifts turns s into goal.

Examples: s = "abcde", goal = "cdeab" → **true**. s = "abcde", goal = "abced" → **false**.

## Brute force

Try all n rotations of s and compare each one with goal.

- Time: O(n²). Fine for LeetCode's n ≤ 100, but there is a neater way.

## The better idea: s + s

Write s twice: "abcdeabcde". **Every** rotation of s appears inside this string as a window of length n:

- abcde | bcdea | cdeab | deabc | eabcd

So goal is a rotation of s exactly when:

1. goal has the same length as s, **and**
2. goal appears inside s + s.

The length check matters. Without it, goal = "ab" would pass for s = "abc", since "ab" appears inside "abcabc".

## Code (C++)

```cpp
class Solution {
public:
    bool rotateString(string s, string goal) {
        return s.size() == goal.size() && (s + s).find(goal) != string::npos;
    }
};
```

## Complexity

- Time: O(n²) in the worst case with `find`, but it is one line and fast in practice. With KMP (see the KMP station), the search is O(n).
- Space: O(n) for s + s.

## Edge cases

- Different lengths → false at once.
- goal == s → true, after zero shifts.

## Dry run (abcde, cdeab)

- Lengths match: 5 = 5.
- s + s = "abcdeabcde". Find "cdeab": it starts at index 2.

Answer: **true**.
