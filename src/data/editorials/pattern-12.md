# Pattern 12

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Number Bridge Pattern".

## What you need to do

Print numbers going up on the left and back down on the right, with a gap in the middle that shrinks.

## The pattern (n = 5, as takeUforward shows it)

```text
1        1
12      21
123    321
1234  4321
1234554321
```

## What is different on GfG

On GfG you write the whole program (read n with `cin`). No spaces between numbers, like takeUforward.

On GfG you write the **whole program**: read n with `cin`, then print.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. Each row has three parts: **numbers going up, a gap, numbers coming down.**

   **Why:** Splitting a row into parts turns one hard row into three easy loops.

2. Row i (from 1): left part 1 … i, right part i … 1.

   **Why:** Both sides grow by one number each row.

3. The gap is **2(n − i)** spaces.

   **Why:** Every row is 2n characters wide. The numbers use 2i of them, so the gap is the rest.

Row by row:

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
