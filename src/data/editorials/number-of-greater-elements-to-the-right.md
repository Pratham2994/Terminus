# Number of Greater Elements to the Right

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> count_NGE(vector<int> &arr, vector<int> &indices)`.

## The problem

Given arr (n ≤ 10⁴, values 1…10⁵) and up to 100 query indices, for each query index i count the elements **after** position i that are **strictly greater** than arr[i].

Example: arr = [3, 4, 2, 7, 5, 8, 10, 6], indices = [0, 5] → **[6, 1]**. After 3 come 4, 7, 5, 8, 10, 6 (6 of them). After 8 comes only 10.

## The direct solution is enough here

For each query, scan the rest of the array and count.

- Cost: q × n ≤ 100 × 10⁴ = **10⁶** steps. That is fast.

Do not over-engineer it. Despite its place on the stack line, a monotonic stack does **not** help here: it finds the *next* greater element, not *how many* greater elements there are.

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

## Complexity

- Time: O(q · n).
- Space: O(1) besides the answer.

## If there were many queries

If every index were a query (q = n = 10⁵), you would need the answer for **all** positions at once. Walk from right to left with a **Fenwick tree** (Binary Indexed Tree) over the values:

- before adding arr[i], the elements to its right are already in the tree;
- greater-to-the-right = (elements to the right) − (elements to the right with value ≤ arr[i]).

That is O(n log V). Our tests compare the simple solution against this Fenwick version on random arrays.

## Edge cases

- "Greater" is **strict**. Equal values do not count.
- The last index always gives 0.

## Dry run (arr = [1, 2, 3, 4, 1], index 0)

- arr[0] = 1. Elements after it: 2 ✓, 3 ✓, 4 ✓, 1 ✗ → **3**.
