# Reverse a String II

> Solve it on [LeetCode 344 · Reverse String](https://leetcode.com/problems/reverse-string/). The string is a `vector<char>`, and you must reverse it **in place**, with no second array.

## What you need to do

Reverse the characters of s without making a copy.

## Example

['h','e','l','l','o'] → **['o','l','l','e','h']**.

## How to solve it, step by step

1. **The simple idea:** copy the characters into a new array from the back.

   **Why it is not allowed:** the copy uses O(n) extra memory, and the task says "in place".

2. **Use two pointers instead:** l at the start, r at the end.

   **Why:** in the reversed string, these two characters trade places.

3. **Swap s[l] and s[r], then move l right and r left.**

   **Why:** each swap puts two characters in their final spots, so the pointers walk towards the middle.

4. **Stop when l is no longer less than r.**

   **Why:** by then every pair has been swapped. A middle character (odd length) stays where it is.

## Code (C++)

```cpp
class Solution {
public:
    void reverseString(vector<char>& s) {
        int l = 0, r = (int)s.size() - 1;
        while (l < r) swap(s[l++], s[r--]);
    }
};
```

## How fast is it?

n/2 swaps: O(n) time, O(1) extra memory.

## Watch out for

- One character: l = r = 0 from the start, so nothing happens. That is correct.
- Even length: the pointers cross without meeting, and every character is swapped once.

## Walk through (h e l l o)

- l = 0, r = 4: swap h and o → o e l l h.
- l = 1, r = 3: swap e and l → o l l e h.
- l = 2, r = 2: stop.

Answer: **o l l e h**.
