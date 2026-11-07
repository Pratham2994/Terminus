# Pattern 21

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Print Hollow Square". Its function: `void printHollowSquare(int n)`. GfG puts a space between cells: `* * * *` on the edges and `*     *` inside.

## The pattern (n = 5, as takeUforward shows it)

```text
*****
*   *
*   *
*   *
*****
```

## Step by step

1. An n × n grid. Look at each cell (i, j) and ask one question: **is it on the border?**
2. A cell is on the border when i == 0, i == n − 1, j == 0 or j == n − 1. Print a star there, a space everywhere else.
3. This "decide per cell" style is more general than counting stars per row. It works for any shape you can describe with a condition.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printHollowSquare(int n) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j) cout << ' ';
                bool border = (i == 0 || i == n - 1 || j == 0 || j == n - 1);
                cout << (border ? '*' : ' ');
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
