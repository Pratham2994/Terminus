# Pattern 17

> takeUforward's page needs Plus. Solve the same pattern free on Code360 (the Problem link above), "Alpha Hill".

## What you need to do

Print a pyramid of letters that go up to the middle and back down: A, A B A, A B C B A.

## The pattern (n = 5, as takeUforward shows it)

```text
    A
   ABA
  ABCBA
 ABCDCBA
ABCDEDCBA
```

## What is different on Code360

Code360 puts a space between letters, so each letter takes 2 columns, and row i starts with 2(n − i − 1) spaces.

Code360's function: `void alphaHill(int n)`.

**In short:** the loops are the same on both sites. Only what you print between the cells changes.

## How to solve it, step by step

1. The shape is Pattern 7's pyramid: spaces, then 2i + 1 letters.

   **Why:** It is a pyramid filled with letters.

2. The middle letter of row i is `'A' + i`.

   **Why:** Row 0 peaks at A, row 1 at B, and so on.

3. For position j (0 … 2i), print `'A' + i − |i − j|`.

   **Why:** |i − j| is the distance from the middle. Subtracting it makes the letters climb to the middle and fall again.

Row by row:

| Row i (from 0) | Letters |
|---|---|
| 0 | A |
| 1 | A B A |
| 2 | A B C B A |

## Code (C++, for Code360)

```cpp
void alphaHill(int n) {
    for (int i = 0; i < n; i++) {
        cout << string(2 * (n - i - 1), ' ');          // each letter is 2 columns wide
        for (int j = 0; j <= 2 * i; j++) {
            if (j) cout << ' ';
            cout << (char)('A' + i - abs(i - j));       // up to the middle, then down
        }
        cout << '\n';
    }
}
```

## How fast is it?

It prints about n² characters, so it takes O(n²) time. That is the size of the picture itself, so no solution can be faster. It uses no extra memory.
