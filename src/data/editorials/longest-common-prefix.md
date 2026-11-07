# Longest Common Prefix

> Solve it on [LeetCode 14 · Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/).

## The problem

Given an array of strings, return the longest string that is a prefix of **all** of them. If there is none, return "".

Examples: ["flower","flow","flight"] → **"fl"**. ["dog","racecar","car"] → **""**.

## Brute force

Try every prefix of the first string, longest first, and check it against every other string.

- Time: O(L² · n), where L is the first string's length and n the number of strings.

## The better idea: shrink the prefix

The answer can never be longer than the first string. Start with the full first string as the candidate, with length `len`. For each other string, count how many leading characters match the candidate, and cut `len` down to that count. After all strings, the first `len` characters are the answer.

Once `len` becomes 0, it stays 0, and every later comparison stops at once.

## Code (C++)

```cpp
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        string first = strs[0];
        int len = first.size();
        for (const string& s : strs) {
            int i = 0;
            while (i < len && i < (int)s.size() && s[i] == first[i]) i++;
            len = i;
        }
        return first.substr(0, len);
    }
};
```

## Complexity

- Time: O(S), where S is the total number of characters. Each character is compared at most once.
- Space: O(1) besides the answer (and the copy of the first string).

## Edge cases

- One string → the string itself.
- An empty string in the list → "", because `i < s.size()` stops at once.
- Always check `i < s.size()` before reading `s[i]`. A shorter string must cut the prefix, not read past its end.

## Another way: sort

Sort the strings. The common prefix of the whole list equals the common prefix of the **first and last** strings after sorting, since they differ the most. That takes O(S log n), slower but neat.

## Dry run (flower, flow, flight)

- Start: len = 6 ("flower").
- "flower": all 6 match → len = 6.
- "flow": f, l, o, w match, then "flow" ends → len = 4.
- "flight": f, l match, o ≠ i → len = 2.

Answer: **"fl"**.
