# Pattern 1

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Print Solid Square". Its function: `void printSolidSquare(int n)`. GfG puts one space between the stars: `* * * * *`.

## The pattern (n = 5, as takeUforward shows it)

```text
*****
*****
*****
*****
*****
```

## Step by step

1. Every pattern is a grid of **rows**. First ask: how many rows? Here **n**.
2. Then ask, for row i: what is printed in it? Here always **n** stars. The row number does not matter.
3. So: an outer loop for the rows, an inner loop for the stars, and a newline after each row.
4. This "outer = rows, inner = what is in a row" frame solves all 22 patterns. Only the inner part changes.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printSolidSquare(int n) {
        for (int i = 0; i < n; i++) {          // n rows
            for (int j = 0; j < n; j++) {      // n stars in every row
                if (j) cout << ' ';            // a space between stars
                cout << '*';
            }
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
