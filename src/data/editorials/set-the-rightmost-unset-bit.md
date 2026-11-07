# Set the Rightmost Unset Bit

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int setBit(int n)`.

## The problem

Find the **rightmost 0 bit** of n and make it 1. Return the new number.

Examples: 10 (1010) → **11** (1011). 13 (1101) → **15** (1111). 15 (01111) → **31** (11111): when all bits are 1, the next 0 is just above them.

## Brute force

Check bits 0, 1, 2, … until you find a 0, then set it with `n | (1 << i)`.

- Time: O(number of bits). Fine, but there is a one-step trick.

## The trick: n | (n + 1)

Look at what **+1** does in binary. It turns the trailing 1s into 0s and the **rightmost 0 into a 1**:

- 1011 + 1 = 1100. The trailing "11" became "00", and the 0 above them became 1.

Now OR it with n. The bits that n + 1 cleared are still 1 in n, so they come back. The bit that n + 1 set is new. Everything above did not change.

- 1011 | 1100 = **1111**. Only the rightmost 0 changed.

So **`n | (n + 1)`** sets exactly the rightmost unset bit.

Sister tricks worth knowing:

- `n & (n − 1)` **clears** the rightmost **set** bit.
- `n & −n` keeps **only** the rightmost set bit.

## Code (C++)

```cpp
class Solution {
  public:
    int setBit(int n) {
        return n | (n + 1);       // +1 flips the rightmost 0 to 1; OR restores the rest
    }
};
```

## Complexity

- Time: O(1). Space: O(1).

## Edge cases

- n = 0 → 1.
- All ones, like 7 (111) → 15 (1111). The trick handles it with no special case.

## Dry run (n = 6 = 110)

n + 1 = 111. 110 | 111 = **111 = 7**.

(Tested on every n < 2²⁰ against the brute force.)
