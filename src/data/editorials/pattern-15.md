# Pattern 15

> takeUforward's page needs Plus. Solve it free on Code360 (the Problem link above), "Reverse Letter Triangle". Its function: `void nLetterTriangle(int n)`. Code360 puts a space between the letters: `A B C`. (It uses the same function name as the increasing triangle.)

## The pattern (n = 5, as takeUforward shows it)

```text
ABCDE
ABCD
ABC
AB
A
```

## Step by step

1. This is Pattern 6 (shrinking rows) with letters, or Pattern 14 upside down.
2. Row i (from 0) has **n − i** letters, starting from A.

| Row i (from 0) | Prints |
|---|---|
| 0 | A … (n letters) |
| 1 | A … (n − 1 letters) |
| i | n − i letters |

## Code (C++, for Code360)

```cpp
void nLetterTriangle(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i; j++) {
            if (j) cout << ' ';
            cout << (char)('A' + j);
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
