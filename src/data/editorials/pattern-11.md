# Pattern 11

> takeUforward's page needs Plus. Solve it free on Code360 (the Problem link above), "Binary Number Triangle". Its function: `void nBinaryTriangle(int n)`. Code360 puts a space between the digits, like takeUforward.

## The pattern (n = 5, as takeUforward shows it)

```text
1
0 1
1 0 1
0 1 0 1
1 0 1 0 1
```

## Step by step

1. The shape is Pattern 2: row i has i entries.
2. The **first digit flips** every row: 1, 0, 1, 0, … So row i (from 0) starts with 1 when i is even.
3. Inside a row, the digit flips at every step.
4. Neat formula: with i and j both from 0, the digit is **1 when (i + j) is even**. Row 0: j = 0 → 1. Row 1: 0 1. Row 2: 1 0 1. ✓

| Row i (from 0) | Prints |
|---|---|
| 0 | 1 |
| 1 | 0 1 |
| 2 | 1 0 1 |
| 3 | 0 1 0 1 |

## Code (C++, for Code360)

```cpp
void nBinaryTriangle(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (j) cout << ' ';
            cout << ((i + j) % 2 == 0 ? 1 : 0);
        }
        cout << '\n';
    }
}
```

## takeUforward's format

On takeUforward the shape is the same; only the spacing differs (see the picture above). Change what you print between the cells, not the loops.

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
