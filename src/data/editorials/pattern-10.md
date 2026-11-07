# Pattern 10

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Half Diamond Star Pattern".

## What you need to do

Print a sideways arrow: stars grow from 1 to n, then shrink back to 1.

## The pattern (n = 5, as takeUforward shows it)

```text
*
**
***
****
*****
****
***
**
*
```

## What is different on GfG

GfG puts a space after each star: `* * * `.

GfG's function: `void printHalfStar(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. There are **2n − 1** rows: the star count goes 1, 2, …, n and back down to 1.

   **Why:** Count the rows in the picture: up to n, then n − 1 more.

2. For row i (from 0): print **i + 1** stars while i < n, and **2n − 1 − i** after that.

   **Why:** The first half grows like Pattern 2; the second half shrinks like Pattern 5.

3. Check the middle: i = n − 1 gives n stars, and i = n gives n − 1.

   **Why:** The two halves join without a jump.

Row by row:

| Row i (from 0) | Stars |
|---|---|
| 0 | 1 |
| n − 1 | n (the peak) |
| n | n − 1 |
| 2n − 2 | 1 |

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printHalfStar(int n) {
        for (int i = 0; i < 2 * n - 1; i++) {
            int stars = (i < n) ? i + 1 : 2 * n - 1 - i;
            for (int j = 0; j < stars; j++) cout << "* ";
            cout << '\n';
        }
    }
};
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
