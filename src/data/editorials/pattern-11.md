# Pattern 11

> takeUforward's page needs Plus. Solve the same pattern free on Code360 (the Problem link above), "Binary Number Triangle".

## What you need to do

Print a staircase of 1s and 0s where the digits take turns.

## The pattern (n = 5, as takeUforward shows it)

```text
1
0 1
1 0 1
0 1 0 1
1 0 1 0 1
```

## What is different on Code360

Code360 puts a space between the digits, like takeUforward.

Code360's function: `void nBinaryTriangle(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. The shape is Pattern 2: row i has i + 1 digits (counting rows from 0).

   **Why:** It is the same staircase.

2. Print **1 when (i + j) is even**, else 0.

   **Why:** Moving one step along a row or down a row flips the digit, and adding 1 to i or j flips whether i + j is even. Row 0 starts with 1 because 0 + 0 is even.

Row by row:

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
