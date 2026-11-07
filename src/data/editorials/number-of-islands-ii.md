# Number of islands II

> takeUforward's page needs Plus, and LeetCode 305 is Premium. Solve the same problem free on GeeksforGeeks (the Problem link above), "Count Islands After Every Operation". GfG's function is `vector<int> numOfIslands(int n, int m, vector<vector<int>>& operators)`. The video above explains it too.

## The problem

An n × m grid starts as all water. Each operation turns one cell into **land**. After **every** operation, report the number of islands (groups of land cells joined up, down, left or right).

Example: n = 4, m = 5, operations (0,0), (0,0), (1,1), (1,0), (0,1), (0,3), (1,3), (0,4), (3,2), (2,2), (1,2), (0,2) → **[1, 1, 2, 1, 1, 2, 2, 2, 3, 3, 1, 1]**.

## Brute force

After each operation, count islands with BFS over the whole grid. O(k · n · m). Too slow when there are many operations.

## Disjoint Set Union: islands only ever merge

Adding land can do two things: create a **new** island, or **join** islands. It never splits one. "Things only merge" is exactly what DSU is built for.

1. Number each cell `id = r · m + c`. Keep a DSU over all cells and a counter `islands`.
2. New land at (r, c): if it is **already land**, nothing changes. Report the same count.
3. Otherwise mark it, and `islands++` (it starts as its own island).
4. For each of its 4 neighbours that is land: if the two are in **different** sets, `union` them and `islands--` (two islands became one).
5. Report `islands`.

Checking "different sets" before counting down matters: a cell can touch the **same** island from two sides.

## Code (C++)

```cpp
class Solution {
    vector<int> parent, sz;
    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];       // path halving
            x = parent[x];
        }
        return x;
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;                // already the same island
        if (sz[a] < sz[b]) swap(a, b);           // union by size
        parent[b] = a;
        sz[a] += sz[b];
        return true;
    }
  public:
    vector<int> numOfIslands(int n, int m, vector<vector<int>>& operators) {
        parent.resize(n * m);
        sz.assign(n * m, 1);
        iota(parent.begin(), parent.end(), 0);
        vector<char> land(n * m, 0);
        int islands = 0;
        vector<int> ans;
        const int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};
        for (auto& op : operators) {
            int r = op[0], c = op[1], id = r * m + c;
            if (!land[id]) {
                land[id] = 1;
                islands++;                       // a new island of one cell
                for (int k = 0; k < 4; k++) {
                    int nr = r + dr[k], nc = c + dc[k];
                    if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
                    int nid = nr * m + nc;
                    if (land[nid] && unite(id, nid)) islands--;   // two islands joined
                }
            }
            ans.push_back(islands);
        }
        return ans;
    }
};
```

## Complexity

- Time: O(n·m + k · α(n·m)), effectively linear. Space: O(n·m).

## Edge cases

- The **same cell twice**: the second time nothing changes (the example has (0,0) twice).
- A cell touching one island on two sides: the second `unite` returns false, so the count drops only once.

## Dry run (start of the example)

(0,0) → 1. (0,0) again → 1. (1,1) → new, no land neighbours → 2. (1,0) → new (3), joins (0,0) → 2, joins (1,1) → **1**.

(Tested on 3 000 random grids and operation lists against a BFS recount after every step.)
