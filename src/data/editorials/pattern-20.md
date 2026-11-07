# Pattern 20

> takeUforward's page needs Plus. Solve it free on Code360 (the Problem link above), "Symmetry". Its function: `void symmetry(int n)`. Code360 prints every cell followed by a space: a star is `* `, a blank is two spaces.

## The pattern (n = 5, as takeUforward shows it)

```text
*        *
**      **
***    ***
****  ****
**********
****  ****
***    ***
**      **
*        *
```

## Step by step

1. This is Pattern 19 turned inside out: **2n − 1 rows**, each 2n cells wide: stars, gap, stars.
2. Star count per side: 1, 2, …, n, then n − 1, …, 1. That is Pattern 10's count: for row i from 0, **s = i + 1** while i < n, else **2n − 1 − i**.
3. The gap is the rest of the width: **2n − 2s** cells.
4. Check the middle row: s = n, gap 0, so 2n stars. ✓

| Row i (from 0) | Stars per side s | Gap |
|---|---|---|
| 0 | 1 | 2n − 2 |
| n − 1 | n | 0 |
| n | n − 1 | 2 |

## Code (C++, for Code360)

```cpp
void symmetry(int n) {
    for (int i = 0; i < 2 * n - 1; i++) {
        int s = (i < n) ? i + 1 : 2 * n - 1 - i;         // stars on each side
        for (int j = 0; j < s; j++) cout << "* ";
        for (int j = 0; j < 2 * n - 2 * s; j++) cout << "  ";   // blank cells
        for (int j = 0; j < s; j++) cout << "* ";
        cout << '\n';
    }
}
```

## takeUforward's format

On takeUforward the shape is the same; only the spacing differs (see the picture above). Change what you print between the cells, not the loops.

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
