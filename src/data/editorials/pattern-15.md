# Pattern 15

> takeUforward's page needs Plus. Solve the same pattern free on Code360 (the Problem link above), "Reverse Letter Triangle".

## What you need to do

Print an upside-down staircase of letters: A B C … first, then one letter less in every row.

## The pattern (n = 5, as takeUforward shows it)

```text
ABCDE
ABCD
ABC
AB
A
```

## What is different on Code360

Code360 puts a space between the letters: `A B C`. (It uses the same function name as the increasing triangle.)

Code360's function: `void nLetterTriangle(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. The shape is Pattern 6: row i (from 0) has **n − i** entries.

   **Why:** The rows shrink by one.

2. Print the letters A, B, C, … in each row.

   **Why:** Each row starts again at A, using `(char)('A' + j)`.

Row by row:

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
