# Sum of Beauty of All Substrings

> Solve it on [LeetCode 1781 · Sum of Beauty of All Substrings](https://leetcode.com/problems/sum-of-beauty-of-all-substrings/).

## What you need to do

The **beauty** of a string is: (count of its most common letter) − (count of its least common letter), counting only letters that appear. Add up the beauty of **every** connected piece of s. s has at most 500 lowercase letters.

## Example

"aabcb" → **5**. The pieces with beauty 1 are "aab", "aabc", "aabcb", "abcb" and "bcb"; all others have beauty 0.

## How to solve it, step by step

1. **Fix a start i, then grow the end j one letter at a time.**

   **Why:** this visits every piece exactly once.

2. **Keep 26 letter counts, and when j moves, add 1 to just the new letter.**

   **Why:** the piece s[i..j] is the previous piece plus one letter. Recounting everything from scratch would waste time.

3. **For each piece, look at the 26 counts once: find the biggest, and the smallest that is above 0.** Add biggest − smallest to the total.

   **Why:** letters with count 0 are not in the piece, so they must not count as the smallest.

4. **When i moves on, reset the counts.**

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

## How fast is it?

About n² pieces, 26 checks each: O(26 · n²), around 6.5 million steps for n = 500. Memory: 26 counters.

## Watch out for

- Skipping zero counts (step 3) is the main trap. Without it, every beauty becomes "biggest − 0".
- A piece made of one kind of letter has beauty 0.

## Walk through ("aab", start i = 0)

- "a": a = 1 → 0.
- "aa": a = 2 → 0.
- "aab": a = 2, b = 1 → 2 − 1 = **1**.

The pieces starting at i = 1 and i = 2 add 0. Total for "aab": **1**.
