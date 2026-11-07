# Check if the i-th bit is Set or Not

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Check K-th Bit". GfG's function is `bool checkKthBit(int n, int k)`; its k is takeUforward's i. Both count bits from 0 on the right.

## What you need to do

Write n in binary. Is the bit at position i a **1**? Positions count from 0, starting at the right.

## Example

- n = 5 is 101. Position 0 (the rightmost) is 1 → **true**.
- n = 10 is 1010. Position 2 is 0 → **false**.

## How to solve it, step by step

1. **Move the bit you want to the far right:** `n >> i`.

   **Why:** `>>` slides every bit i places to the right, so bit i lands at position 0.

2. **Keep only the last bit:** `& 1`.

   **Why:** `x & 1` is 1 when the last bit of x is 1, and 0 otherwise. It hides all the other bits.

3. **So `(n >> i) & 1` is the answer:** 1 means the bit is set.

   **Another way:** `(n & (1 << i)) != 0`. Here `1 << i` is a number with only bit i set, called a mask.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    bool checkKthBit(int n, int k) {
        return (n >> k) & 1;      // bring bit k to position 0, keep only it
    }
};
```

## How fast is it?

One shift and one AND: O(1).

## Watch out for

- With the mask way, compare with `!= 0`, not `== 1`. For i = 3 the masked value is 8, not 1.
- Always put brackets around bit operations. In C++, `n & 1 == 0` means `n & (1 == 0)`, which is not what you meant.

## Walk through (n = 500, i = 3)

500 in binary is 111110100. `500 >> 3` = 111110. Its last bit is 0 → **false**.

(Tested on every n below 65 536 and every i below 16.)
