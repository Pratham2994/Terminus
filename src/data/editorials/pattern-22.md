# Pattern 22

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Concentric Number Square Pattern".

## What you need to do

Fill a square grid with rings of numbers: n on the outside ring, going down to 1 in the centre.

## The pattern (n = 5, as takeUforward shows it)

```text
5 5 5 5 5 5 5 5 5
5 4 4 4 4 4 4 4 5
5 4 3 3 3 3 3 4 5
5 4 3 2 2 2 3 4 5
5 4 3 2 1 2 3 4 5
5 4 3 2 2 2 3 4 5
5 4 3 3 3 3 3 4 5
5 4 4 4 4 4 4 4 5
5 5 5 5 5 5 5 5 5
```

## What is different on GfG

On GfG you **return** the grid as a `vector<vector<int>>` instead of printing it.

GfG's function: `vector<vector<int>> pattern(int n)`.

## How to solve it, step by step

1. The grid is **(2n − 1) × (2n − 1)**. Decide each cell (i, j) on its own.

   **Why:** There is no simple row-by-row rule, but each cell has an easy rule.

2. Find the distance to the **nearest edge**: d = min(i, j, size − 1 − i, size − 1 − j).

   **Why:** All cells in the same ring are the same distance from the edge.

3. The cell holds **n − d**.

   **Why:** The outer ring (d = 0) holds n, the next ring n − 1, and the centre (d = n − 1) holds 1.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    vector<vector<int>> pattern(int n) {
        int size = 2 * n - 1;
        vector<vector<int>> grid(size, vector<int>(size));
        for (int i = 0; i < size; i++)
            for (int j = 0; j < size; j++) {
                int d = min({i, j, size - 1 - i, size - 1 - j});   // distance to the nearest edge
                grid[i][j] = n - d;
            }
        return grid;
    }
};
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
