# String to Integer (atoi)

> Solve it on [LeetCode 8 · String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/).

## The problem

Turn a string into a 32-bit signed integer, the way C's `atoi` does, in this order:

1. Skip leading **spaces**.
2. Read an optional sign, '+' or '−'. Only one sign is allowed.
3. Read **digits** until the first non-digit. Ignore the rest of the string.
4. No digits read → 0.
5. **Clamp** to the int range: below −2³¹ → −2³¹, above 2³¹ − 1 → 2³¹ − 1.

Examples: "42" → **42**. "   -042" → **−42**. "1337c0d3" → **1337**. "0-1" → **0**. "words and 987" → **0**.

## The approach: follow the steps exactly

There is no clever trick here. The difficulty is doing each step exactly as written, and handling **overflow**.

Overflow: build the number in a `long long`. After each digit, check whether sign × result has already left the int range, and return the limit **right away**. If you only checked at the end, a 30-digit string would overflow even the `long long`.

## Code (C++)

```cpp
class Solution {
public:
    int myAtoi(string s) {
        int i = 0, n = s.size();
        while (i < n && s[i] == ' ') i++;                        // 1. spaces
        int sign = 1;
        if (i < n && (s[i] == '+' || s[i] == '-'))               // 2. sign
            sign = (s[i++] == '-') ? -1 : 1;
        long long result = 0;
        while (i < n && isdigit((unsigned char)s[i])) {          // 3. digits
            result = result * 10 + (s[i++] - '0');
            if (sign * result > INT_MAX) return INT_MAX;         // 5. clamp early
            if (sign * result < INT_MIN) return INT_MIN;
        }
        return (int)(sign * result);
    }
};
```

## Complexity

- Time: O(n).
- Space: O(1).

## Edge cases

- "+-12" → 0. After '+', the next character '−' is not a digit, so reading stops.
- "   " and "" → 0.
- "-2147483648" → exactly INT_MIN, which is allowed (−2³¹ fits). "2147483648" → clamped to INT_MAX.
- "00000000000012345678" → 12345678. Leading zeros never overflow, because the result stays 0.
- Only spaces are skipped, not tabs or other whitespace.

## Dry run ("   -042")

- Skip 3 spaces → i = 3.
- '−' → sign = −1, i = 4.
- '0' → 0, '4' → 4, '2' → 42. End of string.

Return −1 × 42 = **−42**.

(Tested on 20 000 random strings of spaces, signs, digits and letters, against a reference that follows the rules literally.)
