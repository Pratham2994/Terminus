# Disjoint Set

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above). It has one strict rule that changes the code; the box below shows it. The free editorial and video above cover it too.

## What you need to do

Keep track of groups of elements (0 to n − 1) that only ever **merge**. Support: join the groups of u and v (by rank and by size), and answer "are u and v in the same group?".

## What is different on GfG

| | takeUforward | GfG "Design Disjoint Set" |
|---|---|---|
| Methods | `unionByRank`, `unionBySize`, `bool find(u, v)` | `unionSet(x, y)`, `int find(x)` |
| Who becomes the leader | you choose (rank or size decides) | **must** be y's leader: "merge x into y" |
| `find` returns | true/false: same group? | the group's leader |

**In short:** on GfG, always hang x's leader under y's leader, and skip rank and size. GfG's tests check which leader `find` returns, so union by rank would fail there.

## How to solve it, step by step

1. **Each group is a tree. `parent[x]` points towards the group's leader** (its root). A leader points to itself.

   **Why:** two elements are in the same group exactly when they lead to the same root.

2. **To find a leader, follow `parent` until it points to itself.**

3. **Path compression:** on the way back, point every node you passed **straight at the leader**.

   **Why:** the next search from those nodes takes one step instead of many.

4. **To join two groups, find both leaders.** If they differ, hang one under the other.

   **Why:** only leaders need to change; everyone below follows automatically.

5. **Union by rank:** hang the **shorter** tree (smaller rank) under the taller one. If the ranks are equal, pick one and add 1 to its rank.
   **Union by size:** hang the tree with **fewer** elements under the bigger one, and add the sizes.

   **Why:** both keep the trees flat, so finding a leader stays fast.

6. **"Same group?" means: do both elements have the same leader?**

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

## How fast is it?

With path compression plus rank or size, each operation is almost O(1) (the inverse Ackermann function, below 5 for any real n). GfG's version, with path compression only, is O(log n) on average. Memory: O(n).

## Watch out for

- Joining two elements that are already together: do nothing, and do not change rank or size.

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
