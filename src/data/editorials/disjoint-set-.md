# Disjoint Set

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above), "Design Disjoint Set": same structure, but driven by queries, and it has one strict rule: **merge x into y** (the new root must be y's root). That rule rules out union by rank or size there. Both versions are below, with a self-check for takeUforward's class (`unionByRank`, `unionBySize`, `find`). The free editorial and video above cover it too.

## The problem

Keep track of groups of elements 0 … n − 1 that only ever **merge**:

- `unionByRank(u, v)` and `unionBySize(u, v)`: merge the groups of u and v.
- `find(u, v)`: are u and v in the same group?

## Step by step

1. **Every group is a tree.** `parent[x]` points towards the group's **root**, its representative. A root points to itself.
2. **findRoot(x):** follow `parent` until you reach a node that is its own parent.
3. **Same group?** Two elements are together exactly when they have the same root.
4. **Merge:** find both roots; if different, hang one root under the other.
5. **Keep the trees flat**, or findRoot becomes O(n):
   - **Path compression:** after finding the root, point every node on the way **straight at the root**.
   - **Union by rank:** hang the tree of **smaller rank** (rough height) under the larger. Equal ranks → pick one, and its rank grows by 1.
   - **Union by size:** hang the **smaller** tree (fewer nodes) under the larger, and add the sizes.
6. With path compression plus rank or size, each operation costs α(n), less than 5 for any real n.

## GfG's rule

GfG says `unionSet(x, y)` merges x's group **into** y's group, and the new root **must** be y's root (its tests check which element `find` returns). So on GfG: `parent[find(x)] = find(y)`, always. Path compression alone keeps it fast enough.

## Code for GfG (submit this there)

```cpp
class MyDSU {
    vector<int> parent;
  public:
    MyDSU(int n) {
        parent.resize(n);
        iota(parent.begin(), parent.end(), 0);       // everyone is their own root
    }
    int find(int x) {
        if (parent[x] == x) return x;
        return parent[x] = find(parent[x]);          // path compression
    }
    void unionSet(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx != ry) parent[rx] = ry;               // x's group goes under y's root
    }
};
```

## Complexity

- takeUforward's version: O(α(n)) per operation. GfG's version (path compression only): O(log n) amortized.
- Space: O(n).

## Edge cases

- Union of two elements already together: do nothing (and do not change rank or size).
- `find(u, u)` is always true.

## Check takeUforward's version

1. Write the class first: constructor `DisjointSet(int n)`, `bool find(int u, int v)`, `void unionByRank(int u, int v)`, `void unionBySize(int u, int v)`.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. It compares every `find` answer. The last test has 200 000 operations, so a slow (unbalanced, uncompressed) DSU shows up as a long run.

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class DisjointSet {
public:
    DisjointSet(int n) {}
    bool find(int u, int v) { return false; }
    void unionByRank(int u, int v) {}
    void unionBySize(int u, int v) {}
};
// ==================== YOUR CODE END ====================

int main() {
    // {n, operations, expected find answers}. Operation {1,u,v} unionByRank, {2,u,v} unionBySize, {3,u,v} find.
    vector<tuple<int, vector<vector<int>>, vector<bool>>> tests = {
        {7, {{1, 0, 1}, {1, 1, 2}, {1, 3, 4}, {1, 5, 6}, {1, 4, 5}, {3, 2, 6}, {1, 2, 6}, {3, 2, 6}}, {false, true}},
        {2, {{3, 1, 0}, {2, 1, 1}, {2, 0, 1}, {2, 0, 0}, {1, 1, 0}, {3, 0, 0}, {2, 1, 1}, {2, 0, 1}, {1, 0, 0}, {3, 1, 0}, {3, 0, 0}, {3, 1, 0}, {3, 1, 0}}, {false, true, true, true, true, true}},
        {12, {{3, 8, 9}, {3, 7, 5}, {2, 1, 11}, {1, 3, 3}, {3, 1, 4}}, {false, false, false}},
        {10, {{3, 0, 5}, {1, 0, 7}, {3, 8, 6}, {3, 7, 0}, {2, 1, 6}, {1, 2, 8}, {3, 2, 7}, {2, 8, 8}, {3, 7, 9}, {1, 3, 7}, {3, 8, 2}, {3, 4, 6}, {2, 4, 2}, {3, 9, 7}, {2, 6, 8}}, {false, false, true, false, false, true, false, false}},
        {3, {{1, 2, 1}, {1, 2, 0}, {3, 2, 2}, {1, 1, 0}, {2, 0, 2}, {3, 1, 1}, {3, 0, 1}, {3, 0, 1}, {3, 1, 2}, {3, 0, 0}, {3, 2, 0}, {3, 0, 2}, {1, 0, 0}, {2, 0, 0}, {3, 1, 2}, {3, 0, 2}, {3, 0, 1}, {1, 2, 2}, {3, 2, 0}, {3, 0, 1}, {3, 2, 2}}, {true, true, true, true, true, true, true, true, true, true, true, true, true, true}},
        {4, {{2, 1, 1}, {2, 1, 2}, {2, 2, 2}, {2, 1, 1}, {1, 1, 1}, {2, 0, 2}, {3, 0, 3}, {3, 1, 1}, {3, 0, 0}, {2, 2, 2}, {1, 2, 1}, {1, 3, 0}, {1, 0, 3}, {2, 1, 1}, {1, 1, 1}, {2, 2, 0}, {1, 1, 3}, {1, 0, 2}, {3, 3, 3}, {3, 3, 1}, {3, 0, 0}, {2, 1, 3}}, {false, true, true, true, true, true}},
    };
    int passed = 0, total = tests.size() + 1;
    for (size_t i = 0; i < tests.size(); i++) {
        auto [n, ops, want] = tests[i];
        DisjointSet ds(n);
        vector<bool> got;
        for (auto& o : ops) {
            if (o[0] == 1) ds.unionByRank(o[1], o[2]);
            else if (o[0] == 2) ds.unionBySize(o[1], o[2]);
            else got.push_back(ds.find(o[1], o[2]));
        }
        if (got == want) passed++;
        else cout << "Test " << i + 1 << " failed (n = " << n << ", " << ops.size() << " operations): a find answer is wrong\n";
    }
    // Big test: a long chain, then many finds. Every element ends up in one group.
    int n = 100000;
    DisjointSet ds(n);
    auto start = chrono::steady_clock::now();
    for (int i = 1; i < n; i++) (i % 2 ? ds.unionByRank(i - 1, i) : ds.unionBySize(i, i - 1));
    bool ok = true;
    for (int i = 0; i < n; i++) ok = ok && ds.find(0, i);
    double secs = chrono::duration<double>(chrono::steady_clock::now() - start).count();
    if (ok) passed++;
    else cout << "Test " << total << " failed: after joining a chain of 100000, some find(0, i) is false\n";
    cout << passed << " / " << total << " tests passed (the big test took " << fixed << setprecision(2) << secs << " s)\n";
}
```
:::

:::hidden Full solution for takeUforward's version (C++)
```cpp
class DisjointSet {
    vector<int> parent, rnk, sz;
    int root(int x) {
        if (parent[x] == x) return x;
        return parent[x] = root(parent[x]);          // path compression
    }
public:
    DisjointSet(int n) : parent(n), rnk(n, 0), sz(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    bool find(int u, int v) { return root(u) == root(v); }
    void unionByRank(int u, int v) {
        int a = root(u), b = root(v);
        if (a == b) return;
        if (rnk[a] < rnk[b]) swap(a, b);             // a has the larger rank
        parent[b] = a;
        if (rnk[a] == rnk[b]) rnk[a]++;
    }
    void unionBySize(int u, int v) {
        int a = root(u), b = root(v);
        if (a == b) return;
        if (sz[a] < sz[b]) swap(a, b);               // a is the bigger tree
        parent[b] = a;
        sz[a] += sz[b];
    }
};
```
:::
