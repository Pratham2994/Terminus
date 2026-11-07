# Pattern 2

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Solid Right Angle Triangle Pattern".

## What you need to do

Print a staircase of stars: row 1 has 1 star, row 2 has 2 stars, and so on up to n.

## The pattern (n = 5, as takeUforward shows it)

```text
*
**
***
****
*****
```

## What is different on GfG

GfG asks for a space **after** each star: `* * * `.

GfG's function: `void printPattern(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Outer loop for the rows: i goes from 1 to n.

   **Why:** Every pattern is rows of something, so one loop for the rows and one loop for what goes in a row solves all 22.

2. The inner loop prints **i** stars, not n.

   **Why:** Row 1 has 1 star, row 2 has 2. The count matches the row number, so the inner loop stops at i.

3. Newline after each row.

   **Why:** That starts the next, longer row.

Row by row:

| Row i | Stars |
|---|---|
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| i | i |

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printPattern(int n) {
        for (int i = 1; i <= n; i++) {         // row i
            for (int j = 1; j <= i; j++) cout << "* ";   // i stars
            cout << '\n';
        }
    }
};
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
