# Largest Odd Number in a String

> Solve it on [LeetCode 1903 · Largest Odd Number in String](https://leetcode.com/problems/largest-odd-number-in-string/).

## The problem

`num` is a string of digits that represents a large integer, with no leading zeros. Return the largest-valued odd integer that is a **non-empty substring** of num, as a string. If there is none, return "".

Examples: "52" → **"5"**. "4206" → **""**. "35427" → **"35427"**.

## Brute force

Try every substring. Keep the odd ones (last digit odd), and compare them as numbers to find the largest.

- Time: O(n³) with string comparisons, far too slow for n up to 10⁵.

## The key observation

A number is odd exactly when its **last digit** is odd. Two facts follow:

1. A longer number (with no leading zeros) is always larger than a shorter one.
2. Every substring that starts at index 0 has no leading zeros, because num has none.

So the best answer starts at index 0 and ends at the **rightmost odd digit**. That is the longest odd prefix, and no odd substring can be longer.

Scan from the right. At the first odd digit you meet, return the prefix up to it. If no digit is odd, return "".

## Code (C++)

```cpp
class Solution {
public:
    string largestOddNumber(string num) {
        for (int i = (int)num.size() - 1; i >= 0; i--)
            if ((num[i] - '0') % 2 == 1) return num.substr(0, i + 1);
        return "";
    }
};
```

## Complexity

- Time: O(n). One scan, plus O(n) to build the answer.
- Space: O(1) besides the answer.

## Edge cases

- All digits even ("4206") → "".
- The last digit is already odd → the whole string.
- Do not convert to `int` or `long long`: num can have 10⁵ digits.

## Dry run ("35427")

From the right, '7' is odd → return num[0..4] = **"35427"**.

For "52": '2' is even, '5' is odd → return **"5"**.
