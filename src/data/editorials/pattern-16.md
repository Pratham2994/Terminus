# Pattern 16

> takeUforward's page needs Plus. Solve it free on Code360 (the Problem link above), "Alpha-Ramp". Its function: `void alphaRamp(int n)`. Code360 puts a space between the letters: `C C C`.

## The pattern (n = 5, as takeUforward shows it)

```text
A
BB
CCC
DDDD
EEEEE
```

## Step by step

1. This is Pattern 4 with letters: the letter follows the **row**, not the column.
2. Row i (from 0) prints the letter `'A' + i`, i + 1 times.

| Row i (from 0) | Prints |
|---|---|
| 0 | A |
| 1 | B B |
| 2 | C C C |

## Code (C++, for Code360)

```cpp
void alphaRamp(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (j) cout << ' ';
            cout << (char)('A' + i);           // the row's letter
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
