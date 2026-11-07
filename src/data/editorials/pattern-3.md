# Pattern 3

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Right-Angled Number Triangle Pattern". Its function: `a full program: read n, print the triangle`. On GfG you write the whole program (read n with `cin`), with a space between the numbers: `1 2 3`.

## The pattern (n = 5, as takeUforward shows it)

```text
1
12
123
1234
12345
```

## Step by step

1. Rows: **n**.
2. Row i has i entries, like Pattern 2. But instead of a star, print the **column number** j.
3. So the inner loop is the same; only what you print changes: `j` instead of `*`.

| Row i | Prints |
|---|---|
| 1 | 1 |
| 2 | 1 2 |
| 3 | 1 2 3 |
| i | 1 … i |

## Code (C++, for GfG)

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            if (j > 1) cout << ' ';
            cout << j;                         // the column number
        }
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
