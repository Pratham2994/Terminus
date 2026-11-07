# Heapify Algorithm

> No free judge has this exact problem, so Terminus is your judge. Solve it with the visible tests, then run the hidden tests with the self-check program at the bottom in a free online compiler. takeUforward's function is `void heapify(vector<int>& nums, int ind, int val)`.

## The problem

`nums` is a **min-heap** stored in an array: for every index i, its children are at `2i + 1` and `2i + 2`, and its parent is at `(i − 1) / 2`. Every parent is ≤ its children.

Set `nums[ind] = val`, then repair the array so it is a min-heap again. Change the array in place.

## Visible tests

| nums | ind | val | Result |
|---|---|---|---|
| [1, 4, 5, 5, 7, 6] | 5 | 2 | [1, 4, 2, 5, 7, 5] |
| [2, 4, 3, 6, 5, 7, 8, 7] | 0 | 7 | [3, 4, 7, 6, 5, 7, 8, 7] |

## Step by step

1. **Only one place can be wrong.** Before the change, the whole array was a heap. After the change, only the edges touching `ind` can break: `ind` with its parent, or `ind` with its children.
2. **Which way?** Compare `val` with the **old** value at `ind`:
   - `val` **smaller** → it may now be smaller than its parent. Move it **up** (sift up / heapify up). Its children are still fine, because they were ≥ the old value, which is > val.
   - `val` **larger** → it may now be larger than a child. Move it **down** (sift down / heapify down). The parent is still fine, because parent ≤ old value < val.
   - equal → nothing to do.
3. **Sift up:** while `i > 0` and `nums[parent] > nums[i]`, swap them and set `i = parent`.
4. **Sift down:** find the **smaller** child (the one that must become the parent). If it is smaller than `nums[i]`, swap and continue from that child. Stop when no child is smaller.
5. **Why the smaller child?** After the swap, that child becomes the parent of the other child. Only the smaller of the two is ≤ both.
6. **Tie rule:** if both children are equal and smaller, go to the **left** one. Any choice keeps a valid heap, but the hidden tests follow this standard rule.

## Complexity

- Time: O(log n). The value moves along one path of the tree, whose height is log₂ n.
- Space: O(1) with loops (O(log n) if you write it recursively).

## Dry run (example 2: ind 0, val 7)

- [7, 4, 3, 6, 5, 7, 8, 7]. 7 is larger than the old 2 → sift down.
- i = 0: children 4 and 3. Smaller is 3 (index 2), 3 < 7 → swap → [3, 4, 7, 6, 5, 7, 8, 7], i = 2.
- i = 2: children at 5 and 6 are 7 and 8. Smaller is 7, not < 7 → stop.

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
