# Pattern 10

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Half Diamond Star Pattern". Its function: `void printHalfStar(int n)`. GfG puts a space after each star: `* * * `.

## The pattern (n = 5, as takeUforward shows it)

```text
*
**
***
****
*****
****
***
**
*
```

## Step by step

1. There are **2n − 1** rows: the count goes 1, 2, …, n, then back down to 1.
2. Way 1: two loops, Pattern 2 (growing) then Pattern 5 (shrinking, starting from n − 1).
3. Way 2, one loop: for row i from 0 to 2n − 2, the star count is **i + 1** while i < n, and **2n − 1 − i** after that.
4. Check the middle row, i = n − 1: n stars. The next, i = n: 2n − 1 − n = n − 1. ✓

| Row i (from 0) | Stars |
|---|---|
| 0 | 1 |
| n − 1 | n (the peak) |
| n | n − 1 |
| 2n − 2 | 1 |

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printHalfStar(int n) {
        for (int i = 0; i < 2 * n - 1; i++) {
            int stars = (i < n) ? i + 1 : 2 * n - 1 - i;
            for (int j = 0; j < stars; j++) cout << "* ";
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
