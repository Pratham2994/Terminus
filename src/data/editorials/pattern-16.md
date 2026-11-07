# Pattern 16

> takeUforward's page needs Plus. Solve the same pattern free on Code360 (the Problem link above), "Alpha-Ramp".

## What you need to do

Print a staircase where every row repeats its own letter: A, then B B, then C C C.

## The pattern (n = 5, as takeUforward shows it)

```text
A
BB
CCC
DDDD
EEEEE
```

## What is different on Code360

Code360 puts a space between the letters: `C C C`.

Code360's function: `void alphaRamp(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. The shape is Pattern 2: row i (from 0) has i + 1 entries.

   **Why:** It is the same staircase.

2. Print the letter `'A' + i` in every position.

   **Why:** The letter belongs to the row, not the column, like the number in Pattern 4.

Row by row:

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
