# Pattern 4

> takeUforward's page needs Plus. Solve it free on Code360 (the Problem link above), "Triangle". Its function: `void triangle(int n)`. Code360 puts a space between the numbers: `3 3 3`.

## The pattern (n = 5, as takeUforward shows it)

```text
1
22
333
4444
55555
```

## Step by step

1. Rows: **n**. Row i has **i** entries, like Pattern 3.
2. The difference: print the **row number** i, not the column number j.
3. Patterns 3 and 4 side by side show the key question for number patterns: does the number follow the **row** or the **column**?

| Row i | Prints |
|---|---|
| 1 | 1 |
| 2 | 2 2 |
| 3 | 3 3 3 |
| i | i, i times |

## Code (C++, for Code360)

```cpp
void triangle(int n) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            if (j > 1) cout << ' ';
            cout << i;                         // the row number
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
