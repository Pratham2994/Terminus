# Pattern 18

> takeUforward's page needs Plus. Practise on Code360 (the **Similar** link above), "Alpha-Triangle". The box below shows what is different.

## What you need to do

Print a staircase of letters where every row ends at the last letter: E, D E, C D E.

## The pattern (n = 5, as takeUforward shows it)

```text
E
D E
C D E
B C D E
A B C D E
```

## What is different on Code360

**Code360's version is different.** It prints C, C B, C B A: every row starts at the last letter and counts **down**. takeUforward's rows end at the last letter: E, D E, C D E. Both are below.

Code360's function: `void alphaTriangle(int n)`.

## How to solve it, step by step

1. Row i (from 0) has **i + 1** letters.

   **Why:** It is the same staircase as Pattern 16.

2. takeUforward: the row **ends** at the last letter, so it starts at `'A' + n − 1 − i` and counts up.

   **Why:** For n = 5, row 2 starts at C and ends at E.

3. Code360: the row **starts** at the last letter and counts down.

   **Why:** For n = 3: C, C B, C B A. Same staircase, letters in the other direction.

Row by row:

| Row i (from 0) | takeUforward (n = 5) | Code360 (n = 3) |
|---|---|---|
| 0 | E | C |
| 1 | D E | C B |
| 2 | C D E | C B A |

## Code (C++, for Code360)

```cpp
// takeUforward: E, D E, C D E, ...
void alphaTriangleTuf(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (j) cout << ' ';
            cout << (char)('A' + n - 1 - i + j);   // start at A+n-1-i, count up
        }
        cout << '\n';
    }
}

// Code360 (submit this one there): C, C B, C B A
void alphaTriangle(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (j) cout << ' ';
            cout << (char)('A' + n - 1 - j);       // start at the last letter, count down
        }
        cout << '\n';
    }
}
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
