# Convert Min Heap to Max Heap

> No free judge has this exact problem, so Terminus is your judge. Solve it with the tests below, then check it with the self-check program at the bottom. takeUforward's function is `vector<int> minToMaxHeap(vector<int> nums)`.

## What you need to do

`nums` is a min-heap in array form. Rearrange it into a **max-heap**: every parent must be **≥** its children (children of i are at 2i + 1 and 2i + 2). Many answers are correct, and **any correct max-heap is accepted.**

## Visible tests

| nums | One correct answer |
|---|---|
| [10, 20, 30, 21, 23] | [30, 23, 10, 21, 20] |
| [-5, -4, -3, -2, -1] | [-1, -2, -3, -4, -5] |

## How to solve it, step by step

1. **Forget that the input is a min-heap.** Treat it as an ordinary array.

   **Why:** a min-heap's order does not help you build a max-heap. The real task is "build a max-heap from an array".

2. **Easy way: sort from big to small.**

   **Why:** a sorted big-to-small array is always a max-heap, because every parent sits before its children. It costs O(n log n).

3. **The heap way (what this station teaches):** go through the positions from the **last parent** (n/2 − 1) back to 0, and **sift each one down**. Sift down here means: while it is smaller than its **bigger** child, swap with that child.

   **Why:** when you fix a position, everything below it is already a max-heap, so sifting down is enough to fix it.

4. **Skip the leaves** (positions n/2 and after).

   **Why:** a position with no children is already a heap.

## How fast is it?

The heap way is O(n); sorting is O(n log n). The heap way is O(n) because most positions are near the bottom and move only a step or two. No extra memory besides the returned array.

## Walk through (heap way on [10, 20, 30, 21, 23])

- n = 5, so the last parent is position 1 (value 20). Its children are 21 and 23; the bigger is 23 > 20 → swap → [10, 23, 30, 21, 20].
- Position 0 (value 10): children 23 and 30; the bigger is 30 → swap → [30, 23, 10, 21, 20]. Position 2 has no children → stop.

Result **[30, 23, 10, 21, 20]**, a correct max-heap.

## Check your solution

1. Write your solution first. Try Option B, it is what this station teaches.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. Each test checks that your array is a max-heap and holds exactly the same numbers.

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    vector<int> minToMaxHeap(vector<int> nums) {
        // Write your solution here.
        return nums;
    }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

int main() {
    vector<vector<int>> tests = {
        {10, 20, 30, 21, 23}, {-5, -4, -3, -2, -1}, {2, 6, 3, 100, 120, 4, 5},
        {1}, {3, 3, 3}, {1, 2},
        {-17, -15, -16, -1, -3, 10, -16, 9, 17, 16},
        {-19, -13, -17, -10, -2, -7, 2, 2, 19, 8, 11, 9, 4},
        {-15, -12, -12, -10, 5, -3, -5, 5, 8, 5, 15, -2, 11, 7, 15},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        vector<int> got = Solution().minToMaxHeap(tests[i]);
        vector<int> a = got, b = tests[i];
        sort(a.begin(), a.end());
        sort(b.begin(), b.end());
        string why;
        if (a != b) why = "the numbers changed";
        else
            for (size_t j = 1; j < got.size() && why.empty(); j++)
                if (got[(j - 1) / 2] < got[j])
                    why = "index " + to_string((j - 1) / 2) + " is smaller than its child at index " + to_string(j);
        if (why.empty()) passed++;
        else cout << "Test " << i + 1 << " failed: nums = " << show(tests[i]) << "\n  got " << show(got)
                  << "  (" << why << ")\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution (C++)
```cpp
class Solution {
    void siftDownMax(vector<int>& h, int i) {
        int n = h.size();
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < n && h[l] > h[largest]) largest = l;
            if (r < n && h[r] > h[largest]) largest = r;
            if (largest == i) return;
            swap(h[i], h[largest]);
            i = largest;
        }
    }
public:
    vector<int> minToMaxHeap(vector<int> nums) {
        // Build-heap: sift down every non-leaf, bottom-up. O(n).
        for (int i = (int)nums.size() / 2 - 1; i >= 0; i--) siftDownMax(nums, i);
        return nums;
    }
};
```
:::
