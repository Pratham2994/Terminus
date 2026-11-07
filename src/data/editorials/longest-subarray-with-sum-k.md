# Longest subarray with sum K

> takeUforward's page needs Plus, and LeetCode 325 is Premium. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int longestSubarray(vector<int>& arr, int k)`. Its array can hold **negative** numbers, which decides the method. The video above explains it too.

## The problem

Return the length of the **longest contiguous subarray** whose sum is exactly k, or 0 if there is none.

Examples: [10, 5, 2, 7, 1, 9], k = 15 → **4** ([5, 2, 7, 1]). [10, 5, 2, 7, 1, −10], k = 15 → **6** (the whole array). [−3, 2, 1], k = 6 → **0**.

## Brute force

Try every start i, extend the end j, keep a running sum, and record j − i + 1 when it equals k.

- Time: O(n²). Too slow for n = 10⁵.

## Prefix sums turn "subarray sum" into "difference"

Let `prefix[j]` = sum of the first j elements. The sum of arr[i … j − 1] is **prefix[j] − prefix[i]**.

So we want, for each end j, the **earliest** i with `prefix[i] = prefix[j] − k`. The earlier i is, the longer the subarray.

Walk left to right with a hash map **sum → first index where that prefix sum appeared**:

1. Start with `first[0] = −1` (the empty prefix, before index 0).
2. At index j, add arr[j] to `sum`.
3. If `sum − k` is in the map, a subarray ends here with length `j − first[sum − k]`.
4. If `sum` is **not** in the map yet, store `first[sum] = j`. **Never overwrite** an older index: the oldest one gives the longest subarray.

## Why not the sliding window?

If all numbers are **positive**, a two-pointer window works in O(1) space: grow the right end, shrink the left end while the sum is too big. It fails with negatives (or zeros-plus-negatives): shrinking the window can **raise** the sum, so "too big → shrink" is no longer right. GfG's version has negatives, so use the map.

## Code (C++)

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

## Complexity

- Time: O(n) on average (hash map). Space: O(n).

## Edge cases

- `first[0] = −1` handles a subarray that starts at index 0. Without it, [5, 10], k = 15 would give 0.
- Overwriting `first[sum]` with a newer index gives **shorter** answers. That is the most common bug here.
- Use `long long` for the running sum: 10⁵ values of 10⁴ fit, but larger limits do not.

## Dry run ([10, 5, 2, 7, 1, 9], k = 15)

| j | arr[j] | sum | sum − k | found at | length | store |
|---|---|---|---|---|---|---|
| 0 | 10 | 10 | −5 | – | – | 10 → 0 |
| 1 | 5 | 15 | 0 | −1 | 2 | 15 → 1 |
| 2 | 2 | 17 | 2 | – | – | 17 → 2 |
| 3 | 7 | 24 | 9 | – | – | 24 → 3 |
| 4 | 1 | 25 | 10 | 0 | **4** | 25 → 4 |
| 5 | 9 | 34 | 19 | – | – | 34 → 5 |

Answer: **4**. (Tested on 5 000 random arrays with negatives against the O(n²) brute force.)
