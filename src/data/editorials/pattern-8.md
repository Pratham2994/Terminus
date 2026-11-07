# Pattern 8

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Inverted Triangle of Stars".

## What you need to do

Print the pyramid from Pattern 7 upside down.

## The pattern (n = 5, as takeUforward shows it)

```text
*********
 *******
  *****
   ***
    *
```

## What is different on GfG

On GfG you write the whole program (read n with `cin`). Leading spaces, then stars, no spaces between stars.

On GfG you write the **whole program**: read n with `cin`, then print.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Same two parts as Pattern 7: spaces, then stars.

   **Why:** It is the same pyramid, just flipped.

2. Row i (from 0) has **i** spaces, then **2(n − i) − 1** stars.

   **Why:** The first row is the full width with no spaces; each row after it gets one more space and two fewer stars.

Row by row:

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
