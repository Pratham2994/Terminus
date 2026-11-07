# Roman to Integer

> Solve it on [LeetCode 13 · Roman to Integer](https://leetcode.com/problems/roman-to-integer/).

## What you need to do

Turn a Roman numeral (1 to 3999) into a normal number. The symbols are I 1, V 5, X 10, L 50, C 100, D 500 and M 1000.

Usually you **add** the symbols: XII = 10 + 1 + 1 = 12. Six pairs **subtract** instead: IV 4, IX 9, XL 40, XC 90, CD 400, CM 900.

## Examples

- "III" → **3**
- "LVIII" → **58**
- "MCMXCIV" → **1994**

## How to solve it, step by step

1. **A symbol is subtracted exactly when a bigger symbol comes right after it.**

   **Why:** in "IV", I (1) comes before V (5), so that I counts as −1. In "VI", the I comes after, so it adds.

2. **Go left to right and look one step ahead.** If this symbol is smaller than the next one, subtract it; otherwise add it.

3. **The last symbol is always added.**

   **Why:** nothing comes after it.

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

## How fast is it?

One pass over at most 15 symbols: O(n) time, O(1) memory.

## Watch out for

- Equal neighbours ("II", "XX") add, because the rule is "strictly smaller".
- Check that there is a next symbol before looking ahead.

## Walk through ("MCMXCIV")

| symbol | next | action | total |
|---|---|---|---|
| M 1000 | C | add | 1000 |
| C 100 | M | subtract | 900 |
| M 1000 | X | add | 1900 |
| X 10 | C | subtract | 1890 |
| C 100 | I | add | 1990 |
| I 1 | V | subtract | 1989 |
| V 5 | – | add | **1994** |

(Tested: every number from 1 to 3999 converts back correctly.)
