# Pattern 17

> takeUforward's page needs Plus. Solve it free on Code360 (the Problem link above), "Alpha Hill". Its function: `void alphaHill(int n)`. Code360 puts a space between letters, so each letter takes 2 columns, and row i starts with 2(n − i − 1) spaces.

## The pattern (n = 5, as takeUforward shows it)

```text
    A
   ABA
  ABCBA
 ABCDCBA
ABCDEDCBA
```

## Step by step

1. The **shape** is Pattern 7, the pyramid: n − i − 1 spaces, then 2i + 1 characters.
2. The **letters** go up from A to the peak, then back down: A B C B A. The peak of row i is `'A' + i`.
3. Clean way: for position j from 0 to 2i, the letter is A + (i − |i − j|). The distance from the middle, |i − j|, makes it go down on both sides.
4. Simple way: print A … peak going up, then peak − 1 … A going down. Two small loops.

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

## takeUforward's format

On takeUforward the shape is the same; only the spacing differs (see the picture above). Change what you print between the cells, not the loops.

## Complexity

- Time: O(n²): about n² cells are printed (the output itself is that big).
- Space: O(1) besides the output.
