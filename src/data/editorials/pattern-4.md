# Pattern 4

> takeUforward's page needs Plus. Solve the same pattern free on Code360 (the Problem link above), "Triangle".

## What you need to do

Print a staircase where every row repeats its own row number: 1, then 2 2, then 3 3 3.

## The pattern (n = 5, as takeUforward shows it)

```text
1
22
333
4444
55555
```

## What is different on Code360

Code360 puts a space between the numbers: `3 3 3`.

Code360's function: `void triangle(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Same loops as Pattern 2: row i holds i things.

   **Why:** The shape is the same staircase.

2. Print the **row number i** in every position.

   **Why:** Row 3 is 3 3 3: the number never changes inside a row, so it must come from the row, not the column. Compare with Pattern 3, which prints j.

Row by row:

| Row i | Prints |
|---|---|
| 1 | 1 |
| 2 | 2 2 |
| 3 | 3 3 3 |
| i | i, i times |

## Code (C++, for Code360)

```cpp
void triangle(int n) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            if (j > 1) cout << ' ';
            cout << i;                         // the row number
        }
        cout << '\n';
    }
}
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
