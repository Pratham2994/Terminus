# Pattern 2

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Solid Right Angle Triangle Pattern". Its function: `void printPattern(int n)`. GfG asks for a space **after** each star: `* * * `.

## The pattern (n = 5, as takeUforward shows it)

```text
*
**
***
****
*****
```

## Step by step

1. Rows: **n**.
2. Row i (counting from 1) has **i** stars. The count grows with the row, so the inner loop runs up to i, not n.
3. That is the only change from Pattern 1: the inner limit depends on the row.

| Row i | Stars |
|---|---|
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| i | i |

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printPattern(int n) {
        for (int i = 1; i <= n; i++) {         // row i
            for (int j = 1; j <= i; j++) cout << "* ";   // i stars
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
