# Pattern 12

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Number Bridge Pattern". Its function: `a full program: read n, print the pattern`. On GfG you write the whole program (read n with `cin`). No spaces between numbers, like takeUforward.

## The pattern (n = 5, as takeUforward shows it)

```text
1        1
12      21
123    321
1234  4321
1234554321
```

## Step by step

1. Each row has three parts: **left numbers, middle spaces, right numbers**. The row is always 2n wide.
2. Row i (from 1): left is 1 … i, right is i … 1.
3. Spaces: the total width 2n minus the 2i digits, so **2(n − i)**. The last row has 0.
4. Check row 1 for n = 5: "1", 8 spaces, "1" = 10 = 2n characters. ✓

| Row i | Left | Spaces | Right |
|---|---|---|---|
| 1 | 1 | 2n − 2 | 1 |
| 2 | 1 2 | 2n − 4 | 2 1 |
| i | 1 … i | 2(n − i) | i … 1 |

## Code (C++, for GfG)

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) cout << j;              // left: 1 .. i
        for (int s = 0; s < 2 * (n - i); s++) cout << ' ';   // middle gap
        for (int j = i; j >= 1; j--) cout << j;              // right: i .. 1
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
