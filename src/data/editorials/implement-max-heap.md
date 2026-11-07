# Implement Max Heap

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above). It tests fewer operations; the box below shows the difference.

## What you need to do

Build your own max-heap class, without `priority_queue`: insert, get the biggest, remove the biggest, size, is-empty, and change the value at a position.

## What is different on GfG

| | takeUforward | GfG "Max Heap implementation" |
|---|---|---|
| Operations | insert, getMax, extractMax, heapSize, isEmpty, changeKey | push, pop, peek, size |
| Empty heap | not asked | `peek()` returns **−1**; `pop()` does nothing |
| Class | `Solution` with the methods above (self-check) | `class maxHeap` |

**In short:** the same heap. GfG's push = insert, pop = extractMax, peek = getMax. Add the −1 rule for an empty peek.

## How to solve it, step by step

It is the **min-heap with every comparison flipped**. If you did "Implement Min Heap", change `<` to `>` in the sift functions.

1. **Store the heap in a `vector<int>`;** the biggest value is at position 0.

   **Why:** every parent is ≥ its children, so the top is the biggest.

2. **Insert / push:** add at the end, then sift **up** while the value is **bigger** than its parent.

   **Why:** a big new value must climb above smaller parents.

3. **Extract / pop:** move the last value to the top, remove the last slot, then sift **down**: swap with the **bigger** child while that child is bigger.

   **Why:** the bigger child is the only one that can sit above both children.

4. **changeKey:** bigger than before → sift up; smaller → sift down.

## Code for GfG (submit this there)

```cpp
class maxHeap {
  private:
    vector<int> h;
    void siftUp(int i) {
        while (i > 0 && h[(i - 1) / 2] < h[i]) { swap(h[(i - 1) / 2], h[i]); i = (i - 1) / 2; }
    }
    void siftDown(int i) {
        int n = h.size();
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, b = i;
            if (l < n && h[l] > h[b]) b = l;
            if (r < n && h[r] > h[b]) b = r;
            if (b == i) return;
            swap(h[i], h[b]);
            i = b;
        }
    }
  public:
    void push(int x) { h.push_back(x); siftUp(h.size() - 1); }
    void pop() {
        if (h.empty()) return;
        h[0] = h.back();
        h.pop_back();
        if (!h.empty()) siftDown(0);
    }
    int peek() { return h.empty() ? -1 : h[0]; }
    int size() { return h.size(); }
};
```

## How fast is it?

Insert, extract and changeKey: O(log n). Peek, size, isEmpty: O(1). Memory: O(n).

## Watch out for

- Removing the only value leaves an empty heap: do not sift.
- In sift-down, swap with the **bigger** child.

## Check takeUforward's version

1. Write the full class first. The self-check calls: `initializeHeap`, `insert`, `getMax`, `extractMax`, `heapSize`, `isEmpty`, `changeKey`.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. Each test is a list of operations; it compares everything getMax, heapSize and isEmpty return.

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
    void extractMax() {}
    bool isEmpty() { return true; }
    int getMax() { return 0; }
    int heapSize() { return -1; }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

int main() {
    // Operations: {0, x} insert x, {1} getMax, {2} extractMax, {3} heapSize, {4} isEmpty (1/0),
    // {5, ind, val} changeKey. Expected: what getMax / heapSize / isEmpty return, in order.
    vector<pair<vector<vector<int>>, vector<int>>> tests = {
        {{{4}, {0, 4}, {0, 5}, {0, 10}, {1}, {2}, {1}, {3}}, {1, 10, 5, 2}},
        {{{0, 3}, {0, 1}, {0, 2}, {5, 0, 0}, {1}, {5, 0, 7}, {1}, {2}, {1}, {4}}, {2, 7, 1, 0}},
        {{{3}, {4}, {0, 13}, {1}, {2}, {3}, {0, -15}, {5, 0, 1}, {0, -4}, {3}, {1}, {2}, {0, -16}, {0, 5}, {0, -2}, {4}, {0, -19}, {0, -7}}, {0, 1, 13, 0, 2, 1, 0}},
        {{{0, 10}, {4}, {4}, {4}, {0, 16}, {1}, {2}, {3}, {0, -1}, {3}, {0, 6}, {0, -12}, {1}, {0, -20}}, {0, 0, 0, 16, 1, 2, 10}},
        {{{3}, {3}, {0, 15}, {1}, {5, 0, 21}, {0, 6}, {4}, {0, 5}, {4}}, {0, 0, 15, 0, 0}},
        {{{0, -3}, {2}, {0, -7}, {0, 5}, {0, -18}, {0, -7}, {5, 2, -25}, {3}, {2}, {4}, {0, -16}, {0, -7}, {1}, {0, 18}}, {4, 0, -7}},
        {{{3}, {4}, {3}, {0, 17}, {5, 0, -1}, {0, 20}, {0, -1}, {1}, {1}, {1}, {0, 20}, {1}, {4}, {5, 0, 1}, {0, -14}, {0, -18}, {2}, {1}, {4}}, {0, 1, 0, 20, 20, 20, 20, 0, 1, 0}},
        {{{3}, {4}, {3}, {3}, {4}, {0, -16}, {0, -6}, {5, 0, -8}, {1}, {1}, {0, -16}, {2}, {4}, {5, 0, -22}, {0, -9}, {2}}, {0, 1, 0, 0, 1, -8, -8, 0}},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        Solution h;
        h.initializeHeap();
        vector<int> got;
        for (auto& op : tests[i].first) {
            if (op[0] == 0) h.insert(op[1]);
            else if (op[0] == 1) got.push_back(h.getMax());
            else if (op[0] == 2) h.extractMax();
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
        while (i > 0 && h[(i - 1) / 2] < h[i]) {
            swap(h[(i - 1) / 2], h[i]);
            i = (i - 1) / 2;
        }
    }
    void siftDown(int i) {
        int n = h.size();
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, b = i;
            if (l < n && h[l] > h[b]) b = l;
            if (r < n && h[r] > h[b]) b = r;           // ties go left
            if (b == i) return;
            swap(h[i], h[b]);
            i = b;
        }
    }
public:
    void initializeHeap() { h.clear(); }
    void insert(int key) { h.push_back(key); siftUp(h.size() - 1); }
    void changeKey(int index, int new_val) {
        int old = h[index];
        h[index] = new_val;
        if (new_val > old) siftUp(index);
        else siftDown(index);
    }
    void extractMax() {
        h[0] = h.back();
        h.pop_back();
        if (!h.empty()) siftDown(0);
    }
    bool isEmpty() { return h.empty(); }
    int getMax() { return h[0]; }
    int heapSize() { return h.size(); }
};
```
:::
