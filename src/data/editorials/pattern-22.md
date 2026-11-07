# Pattern 22

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Concentric Number Square Pattern". Its function: `vector<vector<int>> pattern(int n)`. On GfG you **return** the grid as a `vector<vector<int>>` instead of printing it.

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

## Step by step

1. The grid is (2n − 1) × (2n − 1). Use the "decide per cell" idea from Pattern 21.
2. For cell (i, j), how far is it from the **nearest edge**? The distances to the 4 edges are i, j, (2n − 2) − i and (2n − 2) − j. Take the **minimum**, d.
3. The outer ring (d = 0) holds n, the next ring (d = 1) holds n − 1, and so on. So the value is **n − d**.
4. The centre has d = n − 1, so it holds 1. ✓

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

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
