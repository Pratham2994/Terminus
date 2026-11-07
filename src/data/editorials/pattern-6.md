# Pattern 6

> takeUforward's page needs Plus. Solve the same pattern free on Code360 (the Problem link above), "Reverse Number Triangle".

## What you need to do

Print an upside-down staircase of numbers: 1 to n first, then one number less in every row.

## The pattern (n = 5, as takeUforward shows it)

```text
12345
1234
123
12
1
```

## What is different on Code360

Code360 puts a space between the numbers: `1 2 3`.

Code360's function: `void nNumberTriangle(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Use Pattern 5's shape: row i (from 0) has **n − i** entries.

   **Why:** The rows shrink the same way.

2. Print the column number j (1, 2, 3, …) in each entry.

   **Why:** Each row starts again at 1, like Pattern 3.

Row by row:

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
