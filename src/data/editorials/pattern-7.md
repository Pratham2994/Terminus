# Pattern 7

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Pyramid Pattern". Its function: `void printPyramid(int n)`. GfG prints leading spaces, then the stars, with no spaces between stars (no trailing spaces needed).

## The pattern (n = 5, as takeUforward shows it)

```text
    *
   ***
  *****
 *******
*********
```

## Step by step

1. Rows: **n**. Each row has two parts now: **leading spaces**, then **stars**.
2. Stars: 1, 3, 5, … The odd numbers, so row i (from 0) has **2i + 1** stars.
3. Spaces: the last row has none, and each row above has one more. Row i has **n − i − 1** spaces.
4. Check with the last row, i = n − 1: 0 spaces and 2n − 1 stars. That is the full width. ✓
5. takeUforward also prints the same spaces **after** the stars, so each row is a full rectangle. Judges usually ignore trailing spaces, so you can skip them on GfG.

| Row i (from 0) | Spaces | Stars |
|---|---|---|
| 0 | n − 1 | 1 |
| 1 | n − 2 | 3 |
| i | n − i − 1 | 2i + 1 |

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printPyramid(int n) {
        for (int i = 0; i < n; i++) {
            for (int s = 0; s < n - i - 1; s++) cout << ' ';   // leading spaces
            for (int j = 0; j < 2 * i + 1; j++) cout << '*';   // odd number of stars
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
