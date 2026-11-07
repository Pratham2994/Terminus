# Sum of Beauty of All Substrings

> Solve it on [LeetCode 1781 · Sum of Beauty of All Substrings](https://leetcode.com/problems/sum-of-beauty-of-all-substrings/).

## The problem

The **beauty** of a string is (frequency of its most frequent letter) − (frequency of its least frequent letter), counting only letters that appear. Return the sum of the beauty of **all substrings** of s. n ≤ 500, lowercase letters.

Example: "aabcb" → **5**. The substrings with beauty 1 are "aab", "aabc", "aabcb", "abcb" and "bcb".

## Brute force

For every substring (O(n²)), count its letters from scratch (O(n)), then take max − min.

- Time: O(n³), about 1.25 × 10⁸ for n = 500. It might pass, but there is easy waste to remove.

## The better idea: extend, do not recount

Fix the start i, then move the end j one step at a time. The substring s[i..j] is s[i..j−1] plus **one** letter, so add 1 to that letter's count instead of recounting everything.

For each (i, j), scan the 26 counts once to find the max and the min over the letters that appear.

## Code (C++)

```cpp
class Solution {
public:
    int beautySum(string s) {
        int total = 0, n = s.size();
        for (int i = 0; i < n; i++) {
            int freq[26] = {0};
            for (int j = i; j < n; j++) {
                freq[s[j] - 'a']++;
                int most = 0, least = INT_MAX;
                for (int f : freq)
                    if (f > 0) { most = max(most, f); least = min(least, f); }
                total += most - least;
            }
        }
        return total;
    }
};
```

## Complexity

- Time: O(n² · 26), about 6.5 × 10⁶ for n = 500. Fast.
- Space: O(26).

## Edge cases

- The minimum must skip letters with count 0. Otherwise every beauty would be "max − 0".
- A substring with one distinct letter has beauty 0 (max = min).

## Dry run ("aab", i = 0)

- j = 0 "a": a=1 → 1 − 1 = 0.
- j = 1 "aa": a=2 → 0.
- j = 2 "aab": a=2, b=1 → 2 − 1 = **1**.

Starts i = 1 and i = 2 add 0. Sum for "aab": **1**.
