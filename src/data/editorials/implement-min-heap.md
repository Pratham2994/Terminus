# Implement Min Heap

> takeUforward's page needs Plus. Practise on Code360 (the **Similar** link above). It only tests two of the operations; the box below shows the difference.

## What you need to do

Build your own min-heap class, without `priority_queue`. It must support: insert a value, get the smallest, remove the smallest, get the size, check if empty, and change the value at a position.

## What is different on Code360

| | takeUforward | Code360 "Min Heap" |
|---|---|---|
| Operations | insert, getMin, extractMin, heapSize, isEmpty, changeKey | only insert and "print and remove the smallest" |
| Shape | a class with those methods | one function: `vector<int> minHeap(int n, vector<vector<int>>& q)` |
| Query format | method calls | `[0, x]` = insert x, `[1]` = remove the smallest and add it to the answer |

**In short:** write insert and extract-min (they are the heart of a heap), and you can submit on Code360. The other takeUforward methods are small extras, checked by the self-check below.

## How to solve it, step by step

1. **Store the heap in a `vector<int> h`.** The children of position i are at 2i + 1 and 2i + 2; its parent is at (i − 1) / 2.

   **Why:** a heap is a complete tree, so it fits in an array with no gaps and no pointers.

2. **The smallest value is always at `h[0]`.** So getMin is just `h[0]`.

   **Why:** every parent is ≤ its children, so the top is ≤ everything.

3. **Insert:** add the value at the end, then **sift it up** (swap with its parent while the parent is bigger).

   **Why:** adding at the end keeps the tree complete; sifting up puts the value where it belongs.

4. **Extract-min:** move the **last** value to the top, remove the last slot, then **sift the top down** (swap with its smaller child while that child is smaller).

   **Why:** taking the last value keeps the tree complete; sifting down repairs the order.

5. **changeKey(i, val):** smaller than before → sift up; bigger → sift down.

   **Why:** a smaller value can only break things above it, a bigger value only below it.

6. **On equal children, go left.**

   **Why:** both choices are correct heaps, but the self-check's changeKey tests expect this usual rule.

## Code for Code360 (submit this there)

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

## How fast is it?

insert, extract-min and changeKey move one value along one path: O(log n). getMin, size and isEmpty are O(1). Memory: O(n).

## Watch out for

- Extracting from a one-value heap leaves it empty: do not sift.
- In sift-down, always pick the **smaller** child.

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
