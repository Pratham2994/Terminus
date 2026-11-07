# Pattern 9

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Diamond Shape Pattern". Its function: `void printDiamond(int n)`. GfG prints the same diamond with a space between stars: row i has n − i − 1 spaces, then i + 1 copies of `* `. That draws the same shape as 2i + 1 plain stars.

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

## Step by step

1. Split the picture: the **top half is Pattern 7** (a pyramid) and the **bottom half is Pattern 8** (an inverted pyramid). 2n rows in all.
2. So write the two loops one after the other. Nothing new is needed.
3. GfG's spaced version: in row i, print n − i − 1 spaces, then "* " i + 1 times. With a space after each star, i + 1 stars take 2i + 1 columns, the same width as takeUforward's 2i + 1 stars.
4. Splitting a pattern into parts you already know is the main skill these patterns teach.

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

## takeUforward's format

On takeUforward the shape is the same; only the spacing differs (see the picture above). Change what you print between the cells, not the loops.

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
