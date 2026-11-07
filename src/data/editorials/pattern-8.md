# Pattern 8

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Inverted Triangle of Stars". Its function: `a full program: read n, print the triangle`. On GfG you write the whole program (read n with `cin`). Leading spaces, then stars, no spaces between stars.

## The pattern (n = 5, as takeUforward shows it)

```text
*********
 *******
  *****
   ***
    *
```

## Step by step

1. This is Pattern 7 upside down. Rows: **n**.
2. Row i (from 0): **i** leading spaces, then **2(n − i) − 1** stars.
3. Check: row 0 has 0 spaces and 2n − 1 stars (full width); the last row, i = n − 1, has n − 1 spaces and 1 star. ✓
4. Trick: you can also reuse Pattern 7 with the row index reversed, i → n − 1 − i.

| Row i (from 0) | Spaces | Stars |
|---|---|---|
| 0 | 0 | 2n − 1 |
| 1 | 1 | 2n − 3 |
| i | i | 2(n − i) − 1 |

## Code (C++, for GfG)

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        for (int s = 0; s < i; s++) cout << ' ';
        for (int j = 0; j < 2 * (n - i) - 1; j++) cout << '*';
        cout << '\n';
    }
    return 0;
}
```

## takeUforward's format

On takeUforward the shape is the same; only the spacing differs (see the picture above). Change what you print between the cells, not the loops.

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
