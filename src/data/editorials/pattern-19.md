# Pattern 19

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Mirrored Bridge Pattern".

## What you need to do

Print two triangles of stars that meet: wide at the top and bottom, a gap in the middle.

## The pattern (n = 5, as takeUforward shows it)

```text
**********
****  ****
***    ***
**      **
*        *
*        *
**      **
***    ***
****  ****
**********
```

## What is different on GfG

GfG prints it like takeUforward: no spaces between stars.

GfG's function: `void printMirroredBridge(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Each row has three parts: **stars, a gap, stars.** Every row is 2n wide.

   **Why:** Like Pattern 12, but with stars.

2. Top half, row i (from 0): **n − i** stars, **2i** spaces, **n − i** stars.

   **Why:** The stars shrink by one on each side, so the gap grows by two.

3. Bottom half, row i (from 0): **i + 1** stars, **2(n − i − 1)** spaces, **i + 1** stars.

   **Why:** It is the top half upside down.

Row by row:

| Top row i | Stars | Gap | Stars |
|---|---|---|---|
| 0 | n | 0 | n |
| 1 | n − 1 | 2 | n − 1 |
| i | n − i | 2i | n − i |

## Code (C++, for GfG)

```cpp
class Solution {
    void row(int stars, int gap) {
        cout << string(stars, '*') << string(gap, ' ') << string(stars, '*') << '\n';
    }
  public:
    void printMirroredBridge(int n) {
        for (int i = 0; i < n; i++) row(n - i, 2 * i);              // top: gap grows
        for (int i = 0; i < n; i++) row(i + 1, 2 * (n - i - 1));    // bottom: gap shrinks
    }
};
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
