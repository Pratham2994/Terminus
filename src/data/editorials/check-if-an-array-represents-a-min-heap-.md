# Check if an array represents a min heap

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above). It checks for a **max**-heap instead; the box below shows the difference.

## What you need to do

Read the array as a tree (the children of position i are at 2i + 1 and 2i + 2). Return true if every parent is **≤** its children: a **min-heap**.

## What is different on GfG

| | takeUforward | GfG "Check if Array is Max Heap" |
|---|---|---|
| Rule | every parent ≤ its children (min-heap) | every parent **≥** its children (max-heap) |
| Function | `bool isHeap(vector<int>& nums)` in the self-check | `bool isMaxHeap(vector<int>& arr)` |

**In short:** the same loop; only the comparison flips.

## Example

- [10, 20, 30, 21, 23] → **true**: 10 ≤ 20 and 10 ≤ 30; 20 ≤ 21 and 20 ≤ 23.
- [30, 20, 10, 21, 23] → **false**: 30 is bigger than its child 20.

## How to solve it, step by step

1. **Check every parent–child pair.**

   **Why:** if every parent is ≤ its own children, then every node is ≤ everything below it, so the whole array is a heap.

2. **Easiest loop: go through every child j from 1 to n − 1,** and compare it with its parent `(j − 1) / 2`.

   **Why:** every position except the root has exactly one parent, so this checks each pair once.

3. **Return false at the first broken pair; true if none is broken.**

4. **Equal values are fine:** the rule is ≤, not <.

5. **For GfG, flip the comparison:** a parent smaller than its child breaks a max-heap.

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

## How fast is it?

One look per position: O(n). No extra memory.

## Watch out for

- One value alone is always a heap.

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
