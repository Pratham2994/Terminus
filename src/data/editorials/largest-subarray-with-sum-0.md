# Largest Subarray with Sum 0

> takeUforward's page needs Plus, and its LeetCode link is Premium. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int maxLength(vector<int>& arr)`. The video above explains it too.

## The problem

The array holds positive and negative integers. Return the length of the **longest contiguous subarray with sum 0**, or 0 if none exists.

Examples: [15, −2, 2, −8, 1, 7, 10, 23] → **5** ([−2, 2, −8, 1, 7]). [2, 10, 4] → **0**. [1, 0, −4, 3, 1, 0] → **5**.

## Brute force

Every start i, every end j, running sum. O(n²).

## The prefix-sum idea

Let `sum` be the running total. If the total is the **same** at two points, everything **between** them adds to 0:

prefix after index i = prefix after index j  ⟹  arr[i + 1 … j] sums to 0.

So for each j, find the **first** index where this prefix value appeared. That gives the longest zero-sum subarray ending at j.

This is "Longest subarray with sum K" with **k = 0**: we look for `sum − 0 = sum` in the map.

## Step by step

1. Map `first`: prefix sum → first index where it appeared. Put `first[0] = −1` (the empty prefix).
2. For each j: add arr[j] to sum.
3. If sum is in the map: candidate length `j − first[sum]`.
4. Else: store `first[sum] = j`. Never overwrite.

## Code (C++)

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

## Complexity

- Time: O(n) on average. Space: O(n).

## Edge cases

- A single 0 is a zero-sum subarray of length 1. The map finds it: sum repeats right away.
- Without `first[0] = −1`, a zero-sum prefix such as [3, −3] would give 0 instead of 2.

## Dry run ([15, −2, 2, −8, 1, 7, 10, 23])

Prefix sums: 15, 13, 15, 7, 8, 15, 25, 48.

- j = 2: 15 seen at 0 → length 2.
- j = 5: 15 seen at 0 → length **5** ([−2, 2, −8, 1, 7]).

Answer: **5**. (Tested on 5 000 random arrays against the brute force.)
