# Reverse a String II

> Solve it on [LeetCode 344 · Reverse String](https://leetcode.com/problems/reverse-string/). The string arrives as a `vector<char>`, and you must reverse it **in place** with O(1) extra memory.

## The problem

Reverse the characters of the array s. Do not create a second array.

Example: ['h','e','l','l','o'] → **['o','l','l','e','h']**.

## Brute force

Copy the characters into a new array from the back, then copy them back.

- Time O(n), but space O(n). That breaks the "in place" rule.

## The better idea: two pointers

Swap the first and last characters, then the second and second-last, and so on, moving inwards. Stop when the pointers meet: the middle character, if there is one, stays where it is.

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

## Complexity

- Time: O(n). There are n/2 swaps.
- Space: O(1).

## Edge cases

- One character: l = r = 0 from the start, so the loop never runs.
- Even length: the pointers cross without meeting, and every character is swapped exactly once.

## Dry run (h e l l o)

- l = 0, r = 4: swap h and o → o e l l h.
- l = 1, r = 3: swap e and l → o l l e h.
- l = 2, r = 2: stop.

Answer: **o l l e h**.
