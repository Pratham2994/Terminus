# Letter Combinations of a Phone Number

> Solve it on [LeetCode 17 · Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/).

## The problem

Given a string of digits 2–9 (length ≤ 4), return every letter string the digits could spell on an old phone keypad:
2 abc · 3 def · 4 ghi · 5 jkl · 6 mno · 7 pqrs · 8 tuv · 9 wxyz.

Examples: "23" → **["ad","ae","af","bd","be","bf","cd","ce","cf"]**. "" → **[]**.

## The idea: one level per digit

This is a tree. Level i chooses one letter for digit i:

- At position i, loop over the letters of digits[i]. Add each one and recurse to i + 1.
- At i == length, one full string is built. Record it.

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

## Complexity

- Up to 4ⁿ answers (7 and 9 have 4 letters), each of length n.
- Time: O(4ⁿ · n). Space: O(n) recursion depth, plus the output.

## Edge cases

- Empty input must return **[]**, not [""]. Without the check, the recursion would record the empty string once.

## Dry run ("23")

- 'a' → "ad", "ae", "af".
- 'b' → "bd", "be", "bf".
- 'c' → "cd", "ce", "cf".

Answer: 9 strings, in the order shown above.
