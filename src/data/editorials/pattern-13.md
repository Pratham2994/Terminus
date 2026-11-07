# Pattern 13

> takeUforward's page needs Plus. Solve it free on GeeksforGeeks (the Problem link above), "Floyd's Triangle". Its function: `void printFloydTriangle(int n)`. GfG puts a space between the numbers, like takeUforward.

## The pattern (n = 5, as takeUforward shows it)

```text
1
2 3
4 5 6
7 8 9 10
11 12 13 14 15
```

## Step by step

1. The shape is Pattern 2: row i has i entries.
2. The numbers do not restart in each row. They just keep counting: 1, 2, 3, …
3. So keep **one counter outside both loops**, print it, and add 1 each time.
4. This is the first pattern where the value depends on neither i nor j alone, only on how many you printed before.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    void printFloydTriangle(int n) {
        int num = 1;                           // keeps counting across rows
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                if (j > 1) cout << ' ';
                cout << num++;
            }
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
