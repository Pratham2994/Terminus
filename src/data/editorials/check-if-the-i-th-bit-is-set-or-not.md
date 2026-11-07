# Check if the i-th bit is Set or Not

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Check K-th Bit". GfG's function is `bool checkKthBit(int n, int k)`; its k is takeUforward's i. Bits are counted from 0 at the right (the least significant bit) on both sites.

## The problem

Return true if bit number i of n (counting from 0 at the right) is **1**.

Examples: n = 5 (101), i = 0 → **true**. n = 10 (1010), i = 2 → **false**. n = 4 (100), i = 2 → **true**.

## Two one-line ways

**Way 1: move the bit to position 0.** `n >> i` shifts every bit i places to the right, so bit i lands at position 0. Then `& 1` keeps only that last bit.

- `(n >> i) & 1` is 1 if the bit is set.

**Way 2: build a mask.** `1 << i` is a number with only bit i set. `n & (1 << i)` keeps bit i of n and clears the rest. It is non-zero exactly when bit i is set.

- `(n & (1 << i)) != 0`.

Both are O(1). Way 1 is safer for i = 31 (in Way 2, `1 << 31` overflows a signed int).

## Code (C++)

```cpp
class Solution {
  public:
    bool checkKthBit(int n, int k) {
        return (n >> k) & 1;      // bring bit k to position 0, keep only it
    }
};
```

## Complexity

- Time: O(1). Space: O(1).

## Edge cases

- Write `(n & (1 << i)) != 0`, not `== 1`. For i = 3 the masked value is 8, not 1.
- Precedence: in C++, `==` binds tighter than `&`. So `n & 1 << i == 0` means `n & ((1 << i) == 0)`. Always use brackets around bit operations.

## Dry run (n = 500, k = 3)

500 in binary is 111110100. `500 >> 3` = 111110 (62). `62 & 1` = 0 → **false**.

(Tested on all n < 2¹⁶ and every k < 16 against a string-of-bits check.)
