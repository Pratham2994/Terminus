# Reverse a String I

> Solve it on [LeetCode 344 · Reverse String](https://leetcode.com/problems/reverse-string/). This station is in the **Recursion** line, so practise writing it recursively. LeetCode accepts both ways.

## What you need to do

Reverse a `vector<char>` in place, using **recursion**.

## Example

['H','a','n','n','a','h'] → **['h','a','n','n','a','H']**.

## How to solve it, step by step

1. **Look at the two ends, l and r. Swap them.**

   **Why:** in the reversed string, the first and last characters trade places.

2. **Then reverse the part in between, from l + 1 to r − 1, with the same function.**

   **Why:** after the ends are swapped, what is left is the same problem, just smaller. That is the recursive step.

3. **Stop when l ≥ r.**

   **Why:** a part with 0 or 1 characters is already reversed. This is the base case.

It is the two-pointer loop from "Reverse a String II", written as recursion: each call does one swap and passes the middle on.

## Code (C++)

```cpp
class Solution {
    void rev(vector<char>& s, int l, int r) {
        if (l >= r) return;          // 0 or 1 characters left
        swap(s[l], s[r]);
        rev(s, l + 1, r - 1);
    }
public:
    void reverseString(vector<char>& s) {
        rev(s, 0, (int)s.size() - 1);
    }
};
```

## How fast is it?

n/2 calls, one swap each: O(n) time. The waiting calls use O(n) memory on the call stack; the loop version uses O(1). That is the price of recursion.

## Watch out for

- Pass s **by reference** (`vector<char>&`). Without the `&`, every call swaps a copy and the original never changes.
- One character: the first call already has l = r and stops.

## Walk through (a b c d)

- rev(0, 3): swap a and d → d b c a, then rev(1, 2).
- rev(1, 2): swap b and c → d c b a, then rev(2, 1).
- rev(2, 1): l > r → stop.

Answer: **d c b a**.
