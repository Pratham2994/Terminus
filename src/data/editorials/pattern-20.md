# Pattern 20

> takeUforward's page needs Plus. Solve the same pattern free on Code360 (the Problem link above), "Symmetry".

## What you need to do

Print a butterfly: stars on the left and right edges, growing to the middle row and shrinking again.

## The pattern (n = 5, as takeUforward shows it)

```text
*        *
**      **
***    ***
****  ****
**********
****  ****
***    ***
**      **
*        *
```

## What is different on Code360

Code360 prints every cell followed by a space: a star is `* `, a blank is two spaces.

Code360's function: `void symmetry(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. There are **2n − 1** rows. Each row: stars, a gap, stars.

   **Why:** It is Pattern 19 turned inside out.

2. Stars on each side: **s = i + 1** while i < n, else **2n − 1 − i**.

   **Why:** This is Pattern 10's up-and-down count.

3. The gap is **2n − 2s** cells.

   **Why:** Each row is 2n cells wide, and the stars use 2s of them.

Row by row:

| Row i (from 0) | Stars per side s | Gap |
|---|---|---|
| 0 | 1 | 2n − 2 |
| n − 1 | n | 0 |
| n | n − 1 | 2 |

## Code (C++, for Code360)

```cpp
void symmetry(int n) {
    for (int i = 0; i < 2 * n - 1; i++) {
        int s = (i < n) ? i + 1 : 2 * n - 1 - i;         // stars on each side
        for (int j = 0; j < s; j++) cout << "* ";
        for (int j = 0; j < 2 * n - 2 * s; j++) cout << "  ";   // blank cells
        for (int j = 0; j < s; j++) cout << "* ";
        cout << '\n';
    }
}
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
