# Heapify Algorithm

> No free judge has this exact problem, so Terminus is your judge. Solve it with the tests below, then check it with the self-check program at the bottom. takeUforward's function is `void heapify(vector<int>& nums, int ind, int val)`.

## What you need to do

`nums` is a **min-heap** stored in an array: the children of position i are at 2i + 1 and 2i + 2, its parent is at (i − 1) / 2, and every parent is ≤ its children. Set `nums[ind] = val`, then move values around until it is a min-heap again.

## Visible tests

| nums | ind | val | Result |
|---|---|---|---|
| [1, 4, 5, 5, 7, 6] | 5 | 2 | [1, 4, 2, 5, 7, 5] |
| [2, 4, 3, 6, 5, 7, 8, 7] | 0 | 7 | [3, 4, 7, 6, 5, 7, 8, 7] |

## How to solve it, step by step

1. **Only the changed spot can be wrong.** Before the change, the whole array was a heap.

   **Why:** so you only need to repair around position `ind`, not the whole array.

2. **Compare the new value with the old one.**
   - **Smaller:** it may now be smaller than its parent → move it **up**.
   - **Bigger:** it may now be bigger than a child → move it **down**.
   - **Equal:** nothing to do.

   **Why:** a smaller value cannot break anything below it, and a bigger value cannot break anything above it. So only one direction needs work.

3. **Moving up (sift up):** while it is not at the top and its parent is bigger, swap them and continue from the parent's spot.

   **Why:** each swap fixes one parent–child pair, and the value climbs until it fits.

4. **Moving down (sift down):** find the **smaller** child. If it is smaller than the value, swap them and continue from that child's spot. Stop when no child is smaller.

   **Why:** the smaller child is the only one that can sit above both children.

5. **If both children are equal, go left.**

   **Why:** either choice gives a correct heap, but the hidden tests follow this usual rule.

## How fast is it?

The value moves along one path of the tree, which is at most log₂ n long: O(log n) time, no extra memory.

## Walk through (example 2: ind 0, val 7)

- [7, 4, 3, 6, 5, 7, 8, 7]. 7 is bigger than the old 2 → move down.
- Position 0: children 4 and 3. The smaller is 3, and 3 < 7 → swap → [3, 4, 7, 6, 5, 7, 8, 7]. Now at position 2.
- Position 2: children 7 and 8. The smaller is 7, which is not < 7 → stop.

Result **[3, 4, 7, 6, 5, 7, 8, 7]**.

## Check your solution

1. Write your solution first, and check it on the visible tests.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. Each failed test says whether your array is not a heap at all, or a heap but not what sift up / sift down gives (for example, if you rebuilt the whole heap).

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    void heapify(vector<int>& nums, int ind, int val) {
        // Write your solution here.
    }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

bool isMinHeap(const vector<int>& h) {
    for (size_t i = 1; i < h.size(); i++)
        if (h[(i - 1) / 2] > h[i]) return false;
    return true;
}

int main() {
    // {heap, ind, val, expected}
    vector<tuple<vector<int>, int, int, vector<int>>> tests = {
        {{1, 4, 5, 5, 7, 6}, 5, 2, {1, 4, 2, 5, 7, 5}},
        {{2, 4, 3, 6, 5, 7, 8, 7}, 0, 7, {3, 4, 7, 6, 5, 7, 8, 7}},
        {{5}, 0, -3, {-3}},
        {{1, 2, 3}, 1, 2, {1, 2, 3}},
        {{1, 2, 3, 4, 5, 6, 7}, 0, 100, {2, 4, 3, 100, 5, 6, 7}},
        {{1, 2, 3, 4, 5, 6, 7}, 6, -1, {-1, 2, 1, 4, 5, 6, 3}},
        {{-27, -12, -19, -4, 24, 9, 8}, 5, 39, {-27, -12, -19, -4, 24, 39, 8}},
        {{-40, 13, -12, 17, 23}, 2, 33, {-40, 13, 33, 17, 23}},
        {{-41, -35, -29, -7, 15, 3, -14, 46, 27}, 2, 59, {-41, -35, -14, -7, 15, 3, 59, 46, 27}},
        {{-45, -41, 21, -10, 47, 35, 23, 3, -7}, 5, 16, {-45, -41, 16, -10, 47, 21, 23, 3, -7}},
        {{3, 3, 3, 3, 3}, 0, 4, {3, 3, 3, 4, 3}},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        auto [heap, ind, val, want] = tests[i];
        vector<int> nums = heap;
        Solution().heapify(nums, ind, val);
        if (nums == want) { passed++; continue; }
        cout << "Test " << i + 1 << " failed: nums = " << show(heap) << ", ind = " << ind
             << ", val = " << val << "\n  expected " << show(want) << "\n  got      " << show(nums)
             << (isMinHeap(nums) ? "  (a valid heap, but not the sift-up / sift-down result)"
                                 : "  (not a min-heap)") << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution (C++)
```cpp
class Solution {
    void siftUp(vector<int>& h, int i) {
        while (i > 0 && h[(i - 1) / 2] > h[i]) {
            swap(h[(i - 1) / 2], h[i]);
            i = (i - 1) / 2;
        }
    }
    void siftDown(vector<int>& h, int i) {
        int n = h.size();
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
            if (l < n && h[l] < h[smallest]) smallest = l;
            if (r < n && h[r] < h[smallest]) smallest = r;   // strict: ties go left
            if (smallest == i) return;
            swap(h[i], h[smallest]);
            i = smallest;
        }
    }
public:
    void heapify(vector<int>& nums, int ind, int val) {
        int old = nums[ind];
        nums[ind] = val;
        if (val < old) siftUp(nums, ind);        // smaller: may beat its parent
        else if (val > old) siftDown(nums, ind); // larger: may lose to a child
    }
};
```
:::
