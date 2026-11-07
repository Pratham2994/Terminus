# Set the Rightmost Unset Bit

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int setBit(int n)`.

## What you need to do

Write n in binary, find the **rightmost 0**, and change it to 1. Return the new number.

## Example

- 10 = 1010 → 1011 = **11**.
- 13 = 1101 → 1111 = **15**.
- 15 = 01111 → 11111 = **31**. When all bits are 1, the 0 just above them is the one that changes.

## How to solve it, step by step

1. **Look at what +1 does in binary.** It turns the 1s at the end into 0s, and the rightmost 0 into a 1. Example: 1011 + 1 = 1100.

   **Why:** it is like 199 + 1 = 200 in decimal: the 9s roll over and the next digit goes up. In binary, the 1s roll over.

2. **OR it with the original number:** `n | (n + 1)`. Example: 1011 | 1100 = 1111.

   **Why:** the bits that +1 cleared are still 1 in n, so OR brings them back. The one new 1 (the old rightmost 0) stays. Nothing else changed.

3. **That is the whole answer:** one line.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    int setBit(int n) {
        return n | (n + 1);       // +1 flips the rightmost 0 to 1; OR restores the rest
    }
};
```

## How fast is it?

One addition and one OR: O(1).

## Good to know: the sister tricks

- `n & (n − 1)` **clears** the rightmost 1.
- `n & −n` keeps **only** the rightmost 1.

## Walk through (n = 6 = 110)

n + 1 = 111. 110 | 111 = 111 = **7**.

(Tested on every n below 1 048 576 against checking bit by bit.)
