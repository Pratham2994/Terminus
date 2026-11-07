# Roman to Integer

> Solve it on [LeetCode 13 · Roman to Integer](https://leetcode.com/problems/roman-to-integer/).

## The problem

Convert a valid Roman numeral (1 to 3999) to an integer. The symbols are I 1, V 5, X 10, L 50, C 100, D 500 and M 1000.

Usually symbols go from large to small and you **add** them: XII = 10 + 1 + 1 = 12. Six special pairs **subtract** instead: IV 4, IX 9, XL 40, XC 90, CD 400, CM 900.

Examples: "III" → **3**. "LVIII" → **58**. "MCMXCIV" → **1994**.

## Key observation

A symbol is subtracted **exactly when a larger symbol comes right after it**. In "IV", I (1) comes before V (5), so the I counts as −1.

So look one step ahead:

- If value(s[i]) < value(s[i+1]) → subtract value(s[i]).
- Otherwise → add it.

The last symbol is always added.

## Code (C++)

```cpp
class Solution {
    int value(char c) {
        switch (c) {
            case 'I': return 1;    case 'V': return 5;    case 'X': return 10;
            case 'L': return 50;   case 'C': return 100;  case 'D': return 500;
            default:  return 1000; // 'M'
        }
    }
public:
    int romanToInt(string s) {
        int total = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            int v = value(s[i]);
            if (i + 1 < (int)s.size() && v < value(s[i + 1])) total -= v;
            else total += v;
        }
        return total;
    }
};
```

## Complexity

- Time: O(n), with n ≤ 15.
- Space: O(1).

## Edge cases

- Equal neighbours ("II", "XX") add, because the rule is strictly smaller.
- Check `i + 1 < size` before looking ahead.

## Dry run ("MCMXCIV")

| symbol | next | action | total |
|---|---|---|---|
| M 1000 | C | add | 1000 |
| C 100 | M | subtract | 900 |
| M 1000 | X | add | 1900 |
| X 10 | C | subtract | 1890 |
| C 100 | I | add | 1990 |
| I 1 | V | subtract | 1989 |
| V 5 | — | add | **1994** |

(Tested: every number from 1 to 3999 converts back correctly.)
