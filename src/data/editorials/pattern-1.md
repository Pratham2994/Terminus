# Pattern 1

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Print Solid Square".

## What you need to do

Print a square of stars: n rows, and n stars in every row.

## The pattern (n = 5, as takeUforward shows it)

```text
*****
*****
*****
*****
*****
```

## What is different on GfG

GfG puts one space between the stars: `* * * * *`.

GfG's function: `void printSolidSquare(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Use an outer loop for the rows. There are **n** rows.

   **Why:** Every pattern is rows of something, so one loop for the rows and one loop for what goes in a row solves all 22.

2. Inside it, use an inner loop that prints **n** stars.

   **Why:** Every row of a square is the same, so the inner loop does not depend on the row.

3. Print a newline after each row.

   **Why:** Without it, all the stars end up on one long line.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printSolidSquare(int n) {
        for (int i = 0; i < n; i++) {          // n rows
            for (int j = 0; j < n; j++) {      // n stars in every row
                if (j) cout << ' ';            // a space between stars
                cout << '*';
            }
            cout << '\n';
        }
    }
};
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
