# Pattern 6

> takeUforward's page needs Plus. Solve it free on Code360 (the Problem link above), "Reverse Number Triangle". Its function: `void nNumberTriangle(int n)`. Code360 puts a space between the numbers: `1 2 3`.

## The pattern (n = 5, as takeUforward shows it)

```text
12345
1234
123
12
1
```

## Step by step

1. Rows: **n**. Row i (from 0) has **n − i** entries, exactly like Pattern 5.
2. Each entry is the **column number** j (1, 2, 3, …), like Pattern 3.
3. So this is Pattern 5's shape with Pattern 3's contents. Mixing two known pieces is how most patterns are built.

| Row i (from 0) | Prints |
|---|---|
| 0 | 1 … n |
| 1 | 1 … n − 1 |
| i | 1 … n − i |

## Code (C++, for Code360)

```cpp
void nNumberTriangle(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 1; j <= n - i; j++) {
            if (j > 1) cout << ' ';
            cout << j;
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
