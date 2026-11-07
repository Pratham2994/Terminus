# Pattern 19

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Mirrored Bridge Pattern". Its function: `void printMirroredBridge(int n)`. GfG prints it like takeUforward: no spaces between stars.

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

## Step by step

1. Every row is 2n wide: **stars, a gap, stars** (Pattern 12's shape, with stars).
2. Top half, row i from 0: **n − i** stars, **2i** spaces, **n − i** stars.
3. Bottom half is the top half upside down: row i from 0 has **i + 1** stars, **2(n − i − 1)** spaces, **i + 1** stars.
4. Check the middle: the last top row has 1 star, 2n − 2 spaces, 1 star; so does the first bottom row. ✓

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

## takeUforward's format

On takeUforward the shape is the same; only the spacing differs (see the picture above). Change what you print between the cells, not the loops.

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
