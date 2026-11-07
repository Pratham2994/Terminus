# Pattern 9

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Diamond Shape Pattern".

## What you need to do

Print a diamond: the pyramid from Pattern 7, then the upside-down pyramid from Pattern 8.

## The pattern (n = 5, as takeUforward shows it)

```text
    *
   ***
  *****
 *******
*********
*********
 *******
  *****
   ***
    *
```

## What is different on GfG

GfG prints the same diamond with a space between stars: row i has n − i − 1 spaces, then i + 1 copies of `* `. That draws the same shape as 2i + 1 plain stars.

GfG's function: `void printDiamond(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Draw the top half with Pattern 7's loop.

   **Why:** The top of a diamond is a pyramid.

2. Then draw the bottom half with Pattern 8's loop.

   **Why:** The bottom is the same pyramid upside down.

3. GfG prints the stars with a space between them. Row i then has n − i − 1 spaces and i + 1 copies of "* ".

   **Why:** A star plus a space takes 2 columns, so i + 1 of them fill the same width as 2i + 1 plain stars.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printDiamond(int n) {
        for (int i = 0; i < n; i++) {                  // top half: growing
            cout << string(n - i - 1, ' ');
            for (int j = 0; j <= i; j++) cout << "* ";
            cout << '\n';
        }
        for (int i = n - 1; i >= 0; i--) {             // bottom half: shrinking
            cout << string(n - i - 1, ' ');
            for (int j = 0; j <= i; j++) cout << "* ";
            cout << '\n';
        }
    }
};
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
