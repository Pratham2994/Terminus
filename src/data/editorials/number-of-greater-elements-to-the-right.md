# Number of Greater Elements to the Right

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> count_NGE(vector<int> &arr, vector<int> &indices)`.

## What you need to do

For each index in `indices`, count how many numbers **after** that position are **strictly bigger** than the number there.

## Example

arr = [3, 4, 2, 7, 5, 8, 10, 6], indices = [0, 5] → **[6, 1]**.

- After 3 (index 0): 4, 7, 5, 8, 10, 6 are bigger → 6.
- After 8 (index 5): only 10 → 1.

## How to solve it, step by step

1. **Check the sizes first:** at most 100 queries and 10 000 numbers.

   **Why:** 100 × 10 000 = 1 000 000 steps is fast, so the direct way is enough. Checking the limits before reaching for a clever method saves time.

2. **For each query index i, look at every number after i and count those bigger than arr[i].**

   **Why:** that is exactly the question, done directly.

3. **Note:** a monotonic stack does not help here, even though this station is on the Stack line. A stack finds the **next** bigger number, not **how many** there are.

## Code (C++)

```cpp
class Solution {
public:
    vector<int> count_NGE(vector<int> &arr, vector<int> &indices) {
        vector<int> ans;
        for (int idx : indices) {
            int count = 0;
            for (int j = idx + 1; j < (int)arr.size(); j++)
                if (arr[j] > arr[idx]) count++;
            ans.push_back(count);
        }
        return ans;
    }
};
```

## How fast is it?

O(q · n) time, about a million steps at most. No extra memory besides the answer.

## If there were many more queries

If every index were a query (100 000 of them), use a **Fenwick tree** (Binary Indexed Tree): walk from right to left, and for each number ask "how many numbers already added are bigger than me?" before adding it. That is O(n log V). The tests compare the simple solution against this version.

## Watch out for

- "Greater" is **strict**: equal numbers do not count.
- The last index always gives 0.

## Walk through (arr = [1, 2, 3, 4, 1], index 0)

The number is 1. After it: 2 ✓, 3 ✓, 4 ✓, 1 ✗ → **3**.
