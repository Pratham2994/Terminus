# Pattern 18

> takeUforward's page needs Plus. Practise on Code360 (the **Similar** link above), "Alpha-Triangle". **Code360's version is different.** It prints C, C B, C B A: every row starts at the last letter and counts **down**. takeUforward's rows end at the last letter: E, D E, C D E. Both are below.

## The pattern (n = 5, as takeUforward shows it)

```text
E
D E
C D E
B C D E
A B C D E
```

## Step by step

1. takeUforward: row i (from 0) has i + 1 letters, and it **ends** at the last letter, `'A' + n − 1`.
2. So it **starts** at `'A' + n − 1 − i` and goes up: for n = 5, row 2 starts at C: C D E.
3. Code360: row i also has i + 1 letters, but it **starts** at the last letter and goes **down**: C, C B, C B A for n = 3.
4. Both are the same idea: find the first letter of the row, then count i + 1 letters up or down.

| Row i (from 0) | takeUforward (n = 5) | Code360 (n = 3) |
|---|---|---|
| 0 | E | C |
| 1 | D E | C B |
| 2 | C D E | C B A |

## Code (C++, for Code360)

```cpp
// takeUforward: E, D E, C D E, ...
void alphaTriangleTuf(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (j) cout << ' ';
            cout << (char)('A' + n - 1 - i + j);   // start at A+n-1-i, count up
        }
        cout << '\n';
    }
}

// Code360 (submit this one there): C, C B, C B A
void alphaTriangle(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (j) cout << ' ';
            cout << (char)('A' + n - 1 - j);       // start at the last letter, count down
        }
        cout << '\n';
    }
}
```

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
