# Pattern 7

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Pyramid Pattern".

## What you need to do

Print a pyramid of stars that grows by 2 stars per row and stays centred.

## The pattern (n = 5, as takeUforward shows it)

```text
    *
   ***
  *****
 *******
*********
```

## What is different on GfG

GfG prints leading spaces, then the stars, with no spaces between stars (no trailing spaces needed).

GfG's function: `void printPyramid(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Each row has two parts: **spaces first, then stars.**

   **Why:** The spaces push the stars to the middle, which makes the pyramid shape.

2. Row i (from 0) has **2i + 1** stars: 1, 3, 5, …

   **Why:** Each row adds one star on each side, so two more than the row above.

3. Row i has **n − i − 1** spaces in front.

   **Why:** The bottom row has no spaces, and every row above it needs one more.

4. Check with the last row (i = n − 1): 0 spaces, 2n − 1 stars.

   **Why:** That is the full width, so the formulas agree.

Row by row:

| Row i (from 0) | Spaces | Stars |
|---|---|---|
| 0 | n − 1 | 1 |
| 1 | n − 2 | 3 |
| i | n − i − 1 | 2i + 1 |

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printPyramid(int n) {
        for (int i = 0; i < n; i++) {
            for (int s = 0; s < n - i - 1; s++) cout << ' ';   // leading spaces
            for (int j = 0; j < 2 * i + 1; j++) cout << '*';   // odd number of stars
            cout << '\n';
        }
    }
};
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
