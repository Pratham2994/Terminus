# Pattern 5

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Inverted Right Angle Triangle Pattern". Its function: `void rightPattern(int n)`. GfG prints the stars without spaces, like takeUforward.

## The pattern (n = 5, as takeUforward shows it)

```text
*****
****
***
**
*
```

## Step by step

1. Rows: **n**. The count now **falls**: n stars, then n − 1, … down to 1.
2. Find the formula with a table. Counting rows from i = 0, row i has **n − i** stars.
3. A table of "row → count" is the fastest way to find any count formula. Fill in rows 0, 1, 2 and the pattern shows.

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

## takeUforward's format

On takeUforward the shape is the same; only the spacing differs (see the picture above). Change what you print between the cells, not the loops.

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
