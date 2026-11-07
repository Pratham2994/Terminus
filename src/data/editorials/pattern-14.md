# Pattern 14

> takeUforward's page needs Plus. Solve it free on Code360 (the Problem link above), "Increasing Letter Triangle". Its function: `void nLetterTriangle(int n)`. Code360 puts a space between the letters: `A B C`.

## The pattern (n = 5, as takeUforward shows it)

```text
A
AB
ABC
ABCD
ABCDE
```

## Step by step

1. This is Pattern 3 with letters instead of numbers.
2. Letters are numbers in C++: `'A' + 0` is A, `'A' + 1` is B, and so on. Cast it back with `(char)`.
3. So column j (from 0) prints `(char)('A' + j)`.

| Row i (from 0) | Prints |
|---|---|
| 0 | A |
| 1 | A B |
| i | 'A' … 'A' + i |

## Code (C++, for Code360)

```cpp
void nLetterTriangle(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
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
