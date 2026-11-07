# Pattern 14

> takeUforward's page needs Plus. Solve the same pattern free on Code360 (the Problem link above), "Increasing Letter Triangle".

## What you need to do

Print a staircase of letters: A, then A B, then A B C.

## The pattern (n = 5, as takeUforward shows it)

```text
A
AB
ABC
ABCD
ABCDE
```

## What is different on Code360

Code360 puts a space between the letters: `A B C`.

Code360's function: `void nLetterTriangle(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. The shape is Pattern 3: row i has i entries.

   **Why:** It is the same staircase, with letters instead of numbers.

2. Print the letter `(char)('A' + j)` for column j (from 0).

   **Why:** Letters are numbers inside the computer: 'A' + 1 is 'B'. So the column number turns into a letter.

Row by row:

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
