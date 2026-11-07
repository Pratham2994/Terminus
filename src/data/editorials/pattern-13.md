# Pattern 13

> takeUforward's page needs Plus. Solve the same pattern free on GeeksforGeeks (the Problem link above), "Floyd's Triangle".

## What you need to do

Print a staircase of numbers that keeps counting: 1, then 2 3, then 4 5 6.

## The pattern (n = 5, as takeUforward shows it)

```text
1
2 3
4 5 6
7 8 9 10
11 12 13 14 15
```

## What is different on GfG

GfG puts a space between the numbers, like takeUforward.

GfG's function: `void printFloydTriangle(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. The shape is Pattern 2: row i has i numbers.

   **Why:** It is the same staircase.

2. Keep **one counter outside both loops**, starting at 1. Print it, then add 1.

   **Why:** The numbers never restart: row 2 continues from where row 1 stopped, so the counter must live outside the row loop.

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

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
