# Pattern 21

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Print Hollow Square".

## What you need to do

Print the outline of a square: stars on the edges, spaces inside.

## The pattern (n = 5, as takeUforward shows it)

```text
*****
*   *
*   *
*   *
*****
```

## What is different on GfG

GfG puts a space between cells: `* * * *` on the edges and `*     *` inside.

GfG's function: `void printHollowSquare(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Go through every cell (i, j) of the n × n square.

   **Why:** Here it is easier to decide cell by cell than to count stars per row.

2. Print a star when the cell is on the edge: i == 0, i == n − 1, j == 0 or j == n − 1. Otherwise print a space.

   **Why:** The edge is exactly the first and last row and column.

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
