# Largest Subarray with Sum 0

> takeUforward's page needs Plus, and its LeetCode link is Premium. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int maxLength(vector<int>& arr)`. The video above explains it too.

## What you need to do

The array has positive and negative numbers. Find the **longest run of neighbouring numbers that adds up to 0**, and return its length (0 if there is none).

## Example

[15, −2, 2, −8, 1, 7, 10, 23] → **5**, from [−2, 2, −8, 1, 7]: −2 + 2 − 8 + 1 + 7 = 0.

## How to solve it, step by step

1. **Keep a running total** (prefix sum) as you walk the array.

   **Why:** it turns "does this run add to 0?" into a simple comparison.

2. **If the running total is the same at two points, everything between them adds to 0.**

   **Why:** the total did not change, so whatever was added in between must cancel out.

3. **Store the first index where each total appeared,** in a hash map. Never overwrite it.

   **Why:** at each index j, if the total was seen before at index i, the run i + 1 … j adds to 0. The earliest i gives the longest run.

4. **Start with total 0 at index −1.**

   **Why:** it handles runs that start at the very first number, like [3, −3].

This is "Longest subarray with sum K" with k = 0.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    int maxLength(vector<int>& arr) {
        unordered_map<long long, int> first;
        first[0] = -1;                          // sum 0 "before" the array
        long long sum = 0;
        int best = 0;
        for (int j = 0; j < (int)arr.size(); j++) {
            sum += arr[j];
            auto it = first.find(sum);
            if (it != first.end()) best = max(best, j - it->second);   // same sum seen before
            else first[sum] = j;                                       // remember the first time
        }
        return best;
    }
};
```

## How fast is it?

One pass: O(n) time on average, O(n) memory for the map.

## Watch out for

- A single 0 is a run of length 1 that adds to 0. The map catches it, because the total repeats right away.
- Without the starting entry (step 4), [3, −3] would give 0 instead of 2.

## Walk through ([15, −2, 2, −8, 1, 7, 10, 23])

Running totals: 15, 13, 15, 7, 8, 15, 25, 48.

- Index 2: total 15 was first seen at index 0 → length 2.
- Index 5: total 15 again, first seen at 0 → length **5**.

Answer: **5**. (Tested on 5 000 random arrays against trying every run.)
