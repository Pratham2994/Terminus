# Longest Common Prefix

> Solve it on [LeetCode 14 · Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/).

## What you need to do

Find the longest beginning (prefix) that **all** the strings share. Return "" if they share nothing.

## Examples

- ["flower", "flow", "flight"] → **"fl"**
- ["dog", "racecar", "car"] → **""**

## How to solve it, step by step

1. **Start with the whole first string as your guess.** Keep its length in `len`.

   **Why:** the answer can never be longer than any one string, including the first.

2. **For each other string, count how many first characters match the guess, and cut `len` down to that count.**

   **Why:** a prefix that one string does not have cannot be shared by all.

3. **After the last string, the first `len` characters of the first string are the answer.**

4. **If `len` reaches 0, it stays 0,** and every later comparison stops at once.

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

## How fast is it?

Each character is compared at most once: O(S), where S is the total number of characters. No extra memory besides the answer.

## Watch out for

- Check `i < s.size()` before reading `s[i]`. A shorter string must cut the guess, not read past its end.
- One string → the answer is that string. An empty string in the list → "".

## Another neat way: sort

After sorting, the first and last strings differ the most. Their common prefix is the answer for the whole list. It costs O(S log n), a bit slower.

## Walk through (flower, flow, flight)

- Guess "flower", len = 6.
- "flow": f, l, o, w match, then "flow" ends → len = 4.
- "flight": f, l match, then o ≠ i → len = 2.

Answer: **"fl"**.
