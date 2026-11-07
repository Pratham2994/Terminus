# Check if an array represents a min heap

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above), "Check if Array is Max Heap": the same check for a **max**-heap, `bool isMaxHeap(vector<int>& arr)`. Both versions are below, with a self-check for takeUforward's min-heap version (the self-check uses `bool isHeap(vector<int>& nums)`).

## The problem

Return true if the array, read as a complete binary tree (children of i at 2i + 1 and 2i + 2), is a **min-heap**: every parent ≤ its children.

## Visible tests

| nums | Answer |
|---|---|
| [10, 20, 30, 21, 23] | true |
| [30, 20, 10, 21, 23] | false |
| [1, 1, 1] | true |

## Step by step

1. The heap rule is about **every parent–child pair**. Checking them all is enough: if every parent is ≤ its own children, then (by chaining) every node is ≤ everything below it.
2. Two equivalent loops:
   - for each **parent** i from 0 to n/2 − 1, compare with `2i + 1` and `2i + 2` (when < n);
   - or, simpler, for each **child** j from 1 to n − 1, compare with its parent `(j − 1) / 2`.
3. Return false at the first broken pair; true if none is broken.
4. **Equal values are allowed**: the rule is ≤, not <.
5. For GfG's max-heap, flip the comparison: parent ≥ child.

## Code for GfG (submit this there)

```cpp
class Solution {
  public:
    bool isMaxHeap(vector<int>& arr) {
        for (size_t j = 1; j < arr.size(); j++)
            if (arr[(j - 1) / 2] < arr[j]) return false;   // parent smaller than child
        return true;
    }
};
```

## Complexity

- Time: O(n). Space: O(1).

## Edge cases

- One element: no pairs → true.
- A sorted ascending array is always a min-heap; the reverse is not needed.

## Check takeUforward's version

1. Write `isHeap` first.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. It prints every failed test, then "x / y tests passed".

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    bool isHeap(vector<int>& nums) {
        // Write your solution here.
        return nums.empty();
    }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

int main() {
    vector<pair<vector<int>, bool>> tests = {
        {{10, 20, 30, 21, 23}, true},
        {{30, 20, 10, 21, 23}, false},
        {{1}, true},
        {{1, 1, 1}, true},
        {{1, 2, 1}, true},
        {{2, 1}, false},
        {{1, 2, 3, 4, 5, 6, 0}, false},
        {{-5, -4, -3, -2, -1}, true},
        {{7, 9, -5, -7, 2, -5, 5, 1}, false},
        {{-9, -9, 2, -8, -7, 6, 9, 0, -8, -5, 9}, true},
        {{1, -5, -7, -7, 5, 8, 2}, false},
        {{1, 2, -7, 6, -7}, false},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        vector<int> nums = tests[i].first;
        bool got = Solution().isHeap(nums);
        if (got == tests[i].second) passed++;
        else cout << "Test " << i + 1 << " failed: nums = " << show(tests[i].first) << ", expected "
                  << (tests[i].second ? "true" : "false") << ", got " << (got ? "true" : "false") << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution for takeUforward's version (C++)
```cpp
class Solution {
public:
    bool isHeap(vector<int>& nums) {
        for (size_t j = 1; j < nums.size(); j++)
            if (nums[(j - 1) / 2] > nums[j]) return false;  // parent bigger than child
        return true;
    }
};
```
:::
