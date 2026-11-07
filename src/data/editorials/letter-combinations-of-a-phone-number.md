# Letter Combinations of a Phone Number

> Solve it on [LeetCode 17 · Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/).

## What you need to do

Old phones put letters on the number keys: 2 abc · 3 def · 4 ghi · 5 jkl · 6 mno · 7 pqrs · 8 tuv · 9 wxyz. Given a string of digits (2 to 9, at most 4 of them), list every word the digits could type.

## Examples

- "23" → **["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]**
- "" → **[]**

## How to solve it, step by step

1. **Work through the digits one at a time.** At digit i, try each of its letters.

   **Why:** each digit needs exactly one letter, and every choice is allowed.

2. **For each letter: add it to the word, move on to digit i + 1, then remove it again.**

   **Why:** removing it ("backtracking") lets the next letter take its place, using one shared string.

3. **When you have used every digit, save the word.**

4. **If the input is empty, return [] straight away.**

   **Why:** otherwise the recursion would save one empty word and return [""], which is wrong.

## Code (C++)

```cpp
class Solution {
    const string keys[10] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    void build(const string& digits, int i, string& cur, vector<string>& out) {
        if (i == (int)digits.size()) { out.push_back(cur); return; }
        for (char c : keys[digits[i] - '0']) {
            cur.push_back(c);
            build(digits, i + 1, cur, out);
            cur.pop_back();
        }
    }
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        vector<string> out;
        string cur;
        build(digits, 0, cur, out);
        return out;
    }
};
```

## How fast is it?

Up to 4 letters per digit, so up to 4ⁿ words of length n: O(4ⁿ · n). With n ≤ 4 that is at most 256 words.

## Watch out for

- The empty input case (step 4).

## Walk through ("23")

- 'a' → "ad", "ae", "af".
- 'b' → "bd", "be", "bf".
- 'c' → "cd", "ce", "cf".

Nine words, in the order shown above.
