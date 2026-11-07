# Reverse a String I

> Solve it on [LeetCode 344 · Reverse String](https://leetcode.com/problems/reverse-string/). This station is in the **Recursion** line, so write it recursively. LeetCode accepts both versions.

## The problem

Reverse a `vector<char>` in place.

Example: ['H','a','n','n','a','h'] → **['h','a','n','n','a','H']**.

## Thinking recursively

Reversing s[l..r] is the same as:

1. swapping the two ends, s[l] and s[r], and then
2. reversing the inside part, s[l+1..r−1].

Base case: when l ≥ r, the part has 0 or 1 characters. It is already reversed, so stop.

This is the two-pointer loop written as recursion. Each call does one swap and hands the smaller middle to the next call.

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

## Complexity

- Time: O(n). There are n/2 calls, each doing one swap.
- Space: O(n) for the call stack, about n/2 frames. The loop version uses O(1). That is the price of recursion.

## Edge cases

- Pass s **by reference** (`vector<char>&`). By value, every call would swap a copy, and the original would never change.
- One character: the first call already has l = r and returns.

## Dry run (a b c d)

- rev(0, 3): swap a and d → d b c a, then call rev(1, 2).
- rev(1, 2): swap b and c → d c b a, then call rev(2, 1).
- rev(2, 1): l > r, return.

Answer: **d c b a**.
