# Implement Min Heap

> takeUforward's page needs Plus. Practise on Code360 (the **Similar** link above), "Min Heap": it only needs **insert** and **extract-min**, as `vector<int> minHeap(int n, vector<vector<int>>& q)`. takeUforward wants the full class: insert, getMin, extractMin, heapSize, isEmpty and changeKey. Both are below, with a self-check for the full class.

## The problem

Build a min-heap class **without** `priority_queue`:

- `insert(x)`: add x.
- `getMin()`: return the smallest value.
- `extractMin()`: remove the smallest value.
- `heapSize()`, `isEmpty()`.
- `changeKey(ind, val)`: set the value at heap-array index `ind` (0-based) to `val`, and repair the heap.

## Step by step

1. **Storage:** a `vector<int> h`. Node i has children `2i + 1`, `2i + 2` and parent `(i − 1) / 2`. The root `h[0]` is always the minimum.
2. **Two repair moves** do all the work:
   - **sift up** (a value may be too **small** for its spot): while it is smaller than its parent, swap upward.
   - **sift down** (a value may be too **big**): while it is bigger than its smaller child, swap with that child.
3. **insert(x):** append x at the end (the next free slot of the complete tree), then sift it **up**. O(log n).
4. **getMin():** `h[0]`. O(1).
5. **extractMin():** move the **last** element to the root, remove the last slot, then sift the root **down**. Taking the last element keeps the tree complete. O(log n).
6. **changeKey(ind, val):** compare with the old value. Smaller → sift up; bigger → sift down. (This is the "Heapify Algorithm" station.)
7. The self-check uses the standard rules above, including "on equal children, go **left**", so `changeKey` indices match.

## Code for Code360 (submit this there)

Each query is `[0, x]` (insert x) or `[1]` (print and remove the minimum). Return the removed values in order.

```cpp
#include <bits/stdc++.h>
vector<int> minHeap(int n, vector<vector<int>>& q) {
    vector<int> h, out;
    for (auto& op : q) {
        if (op[0] == 0) {                                   // insert: add at the end, sift up
            h.push_back(op[1]);
            int i = h.size() - 1;
            while (i > 0 && h[(i - 1) / 2] > h[i]) { swap(h[(i - 1) / 2], h[i]); i = (i - 1) / 2; }
        } else {                                            // extract: last to root, sift down
            out.push_back(h[0]);
            h[0] = h.back();
            h.pop_back();
            int i = 0, sz = h.size();
            while (true) {
                int l = 2 * i + 1, r = 2 * i + 2, s = i;
                if (l < sz && h[l] < h[s]) s = l;
                if (r < sz && h[r] < h[s]) s = r;
                if (s == i) break;
                swap(h[i], h[s]);
                i = s;
            }
        }
    }
    return out;
}
```

## Complexity

- insert, extractMin, changeKey: O(log n). getMin, heapSize, isEmpty: O(1).
- Space: O(n).

## Edge cases

- extractMin on a **one-element** heap: the last element *is* the root; after `pop_back` the heap is empty, so sift-down must not touch `h[0]`. The loop's bounds checks (`l < size`) handle it.
- Pick the **smaller** child in sift-down; otherwise the other child ends up below a bigger parent.

## Check takeUforward's version

1. Write the full class first. The self-check calls exactly these methods: `initializeHeap`, `insert`, `getMin`, `extractMin`, `heapSize`, `isEmpty`, `changeKey`.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. Each test is a list of operations; it compares everything getMin, heapSize and isEmpty return.

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    void initializeHeap() {}
    void insert(int key) {}
    void changeKey(int index, int new_val) {}
    void extractMin() {}
    bool isEmpty() { return true; }
    int getMin() { return 0; }
    int heapSize() { return -1; }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

int main() {
    // Operations: {0, x} insert x, {1} getMin, {2} extractMin, {3} heapSize, {4} isEmpty (1/0),
    // {5, ind, val} changeKey. Expected: what getMin / heapSize / isEmpty return, in order.
    vector<pair<vector<vector<int>>, vector<int>>> tests = {
        {{{4}, {0, 4}, {0, 5}, {0, 10}, {1}, {2}, {1}, {3}}, {1, 4, 5, 2}},
        {{{0, 3}, {0, 1}, {0, 2}, {5, 0, 0}, {1}, {5, 0, 7}, {1}, {2}, {1}, {4}}, {0, 2, 3, 0}},
        {{{3}, {4}, {0, 13}, {1}, {2}, {3}, {0, -15}, {5, 0, 1}, {0, -4}, {3}, {1}, {2}, {0, -16}, {0, 5}, {0, -2}, {4}, {0, -19}, {0, -7}}, {0, 1, 13, 0, 2, -4, 0}},
        {{{0, 10}, {4}, {4}, {4}, {0, 16}, {1}, {2}, {3}, {0, -1}, {3}, {0, 6}, {0, -12}, {1}, {0, -20}}, {0, 0, 0, 10, 1, 2, -12}},
        {{{3}, {3}, {0, 15}, {1}, {5, 0, 21}, {0, 6}, {4}, {0, 5}, {4}}, {0, 0, 15, 0, 0}},
        {{{0, -3}, {2}, {0, -7}, {0, 5}, {0, -18}, {0, -7}, {5, 2, -25}, {3}, {2}, {4}, {0, -16}, {0, -7}, {1}, {0, 18}}, {4, 0, -18}},
        {{{3}, {4}, {3}, {0, 17}, {5, 0, -1}, {0, 20}, {0, -1}, {1}, {1}, {1}, {0, 20}, {1}, {4}, {5, 0, 1}, {0, -14}, {0, -18}, {2}, {1}, {4}}, {0, 1, 0, -1, -1, -1, -1, 0, -14, 0}},
        {{{3}, {4}, {3}, {3}, {4}, {0, -16}, {0, -6}, {5, 0, -8}, {1}, {1}, {0, -16}, {2}, {4}, {5, 0, -22}, {0, -9}, {2}}, {0, 1, 0, 0, 1, -8, -8, 0}},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        Solution h;
        h.initializeHeap();
        vector<int> got;
        for (auto& op : tests[i].first) {
            if (op[0] == 0) h.insert(op[1]);
            else if (op[0] == 1) got.push_back(h.getMin());
            else if (op[0] == 2) h.extractMin();
            else if (op[0] == 3) got.push_back(h.heapSize());
            else if (op[0] == 4) got.push_back(h.isEmpty() ? 1 : 0);
            else h.changeKey(op[1], op[2]);
        }
        if (got == tests[i].second) passed++;
        else cout << "Test " << i + 1 << " failed (" << tests[i].first.size() << " operations)\n  expected "
                  << show(tests[i].second) << "\n  got      " << show(got) << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution for takeUforward's version (C++)
```cpp
class Solution {
    vector<int> h;
    void siftUp(int i) {
        while (i > 0 && h[(i - 1) / 2] > h[i]) {
            swap(h[(i - 1) / 2], h[i]);
            i = (i - 1) / 2;
        }
    }
    void siftDown(int i) {
        int n = h.size();
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, s = i;
            if (l < n && h[l] < h[s]) s = l;
            if (r < n && h[r] < h[s]) s = r;           // ties go left
            if (s == i) return;
            swap(h[i], h[s]);
            i = s;
        }
    }
public:
    void initializeHeap() { h.clear(); }
    void insert(int key) { h.push_back(key); siftUp(h.size() - 1); }
    void changeKey(int index, int new_val) {
        int old = h[index];
        h[index] = new_val;
        if (new_val < old) siftUp(index);
        else siftDown(index);
    }
    void extractMin() {
        h[0] = h.back();                               // last element to the root
        h.pop_back();
        if (!h.empty()) siftDown(0);
    }
    bool isEmpty() { return h.empty(); }
    int getMin() { return h[0]; }
    int heapSize() { return h.size(); }
};
```
:::
