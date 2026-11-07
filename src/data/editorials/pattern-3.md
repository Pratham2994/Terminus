# Pattern 3

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Right-Angled Number Triangle Pattern".

## What you need to do

Print a staircase of numbers: each row counts 1, 2, 3, … up to its row number.

## The pattern (n = 5, as takeUforward shows it)

```text
1
12
123
1234
12345
```

## What is different on GfG

On GfG you write the whole program (read n with `cin`), with a space between the numbers: `1 2 3`.

On GfG you write the **whole program**: read n with `cin`, then print.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Same loops as Pattern 2: row i holds i things.

   **Why:** The shape is the same staircase.

2. In the inner loop, print the **column number j** instead of a star.

   **Why:** Row 3 is 1 2 3: the numbers count along the row, which is exactly what j does.

Row by row:

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
