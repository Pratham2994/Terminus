# Pattern 5

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Inverted Right Angle Triangle Pattern".

## What you need to do

Print an upside-down staircase of stars: n stars first, then one less in every row.

## The pattern (n = 5, as takeUforward shows it)

```text
*****
****
***
**
*
```

## What is different on GfG

GfG prints the stars without spaces, like takeUforward.

GfG's function: `void rightPattern(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Outer loop for the rows, counting i from 0.

   **Why:** Starting at 0 makes the formula below simple.

2. Row i prints **n − i** stars.

   **Why:** Row 0 has n stars, row 1 has n − 1. Each row loses one, so subtract the row number.

3. Tip: write a small table of row → count to find any formula like this.

   **Why:** Rows 0, 1, 2 are usually enough to see the rule.

Row by row:

| Row i (from 0) | Stars |
|---|---|
| 0 | n |
| 1 | n − 1 |
| 2 | n − 2 |
| i | n − i |

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void rightPattern(int n) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i; j++) cout << '*';   // n - i stars
            cout << '\n';
        }
    }
};
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
