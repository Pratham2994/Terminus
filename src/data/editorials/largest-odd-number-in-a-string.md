# Largest Odd Number in a String

> Solve it on [LeetCode 1903 · Largest Odd Number in String](https://leetcode.com/problems/largest-odd-number-in-string/).

## What you need to do

`num` is a very long number written as a string (no leading zeros). Find the **biggest odd number** you can cut out of it as one connected piece, and return it as a string. Return "" if there is none.

## Examples

- "52" → **"5"**
- "4206" → **""** (no odd digit at all)
- "35427" → **"35427"**

## How to solve it, step by step

1. **A number is odd exactly when its last digit is odd.**

   **Why:** only the last digit decides odd or even.

2. **A longer number is bigger than a shorter one,** as long as it has no leading zeros.

   **Why:** more digits means a bigger value.

3. **Any piece that starts at index 0 has no leading zeros,** because num has none.

4. **So the best piece starts at index 0 and ends at the rightmost odd digit.**

   **Why:** that is the longest piece that still ends in an odd digit, so nothing odd can be longer, and longer means bigger.

5. **Scan from the right. At the first odd digit, return everything up to it. If there is none, return "".**

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

## How fast is it?

One scan, plus building the answer: O(n). No extra memory besides the answer.

## Watch out for

- Do not turn num into an `int` or `long long`: it can have 100 000 digits.
- If the last digit is already odd, the answer is the whole string.

## Walk through ("52")

From the right: '2' is even, '5' is odd → return **"5"**.
