# Longest subarray with sum K

> takeUforward's page needs Plus, and LeetCode 325 is Premium. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int longestSubarray(vector<int>& arr, int k)`. Its numbers can be **negative**, and that decides the method. The video above explains it too.

## What you need to do

Find the **longest run of neighbouring numbers** (a subarray) that adds up to exactly k. Return its length, or 0 if there is none.

## Example

[10, 5, 2, 7, 1, 9], k = 15. The runs that add to 15 are [10, 5] (length 2) and [5, 2, 7, 1] (length 4). Answer: **4**.

## How to solve it, step by step

1. **The slow idea:** try every start and every end, and add up. That is O(n²): too slow for 100 000 numbers.

2. **Keep a running total, called the prefix sum.** After index j, `sum` is the total of everything so far.

   **Why:** the total of a run from i + 1 to j is just "sum at j" minus "sum at i". So a run adds to k when an earlier prefix sum equals **sum − k**.

3. **Remember where each prefix sum first appeared,** in a hash map: `first[sum] = index`.

   **Why:** at index j, look up `sum − k`. If it is there, the run between that index and j adds to k.

4. **Keep only the first (oldest) index for each sum.** Never overwrite it.

   **Why:** the earlier the start, the longer the run. Overwriting with a newer index gives shorter answers.

5. **Start the map with `first[0] = −1`.**

   **Why:** it stands for "nothing taken yet", before index 0. Without it, a run that starts at index 0 is never found.

## Why not two pointers (a sliding window)?

With only positive numbers, a window works: grow it on the right, shrink it on the left while the total is too big. With **negative** numbers, shrinking can make the total go **up**, so the window gets lost. GfG's version has negatives, so use the map.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    int longestSubarray(vector<int>& arr, int k) {
        unordered_map<long long, int> first;   // prefix sum -> first index it appeared
        first[0] = -1;                         // empty prefix
        long long sum = 0;
        int best = 0;
        for (int j = 0; j < (int)arr.size(); j++) {
            sum += arr[j];
            auto it = first.find(sum - k);
            if (it != first.end()) best = max(best, j - it->second);
            if (!first.count(sum)) first[sum] = j;   // keep the OLDEST index
        }
        return best;
    }
};
```

## How fast is it?

One pass with a hash map: O(n) time on average, O(n) memory for the map.

## Watch out for

- The `first[0] = −1` line (step 5). Without it, [5, 10] with k = 15 would return 0.
- Overwriting old indexes (step 4) is the most common bug here.
- Use `long long` for the running total if the numbers can be large.

## Walk through ([10, 5, 2, 7, 1, 9], k = 15)

| j | number | sum | look for sum − 15 | found at | length |
|---|---|---|---|---|---|
| 0 | 10 | 10 | −5 | – | – |
| 1 | 5 | 15 | 0 | −1 | 2 |
| 2 | 2 | 17 | 2 | – | – |
| 3 | 7 | 24 | 9 | – | – |
| 4 | 1 | 25 | 10 | 0 | **4** |
| 5 | 9 | 34 | 19 | – | – |

Answer: **4**. (Tested on 5 000 random arrays with negative numbers against the slow idea.)
