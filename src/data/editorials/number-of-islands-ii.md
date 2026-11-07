# Number of islands II

> takeUforward's page needs Plus, and LeetCode 305 is Premium. Solve the same problem free on GeeksforGeeks (the Problem link above), "Count Islands After Every Operation". GfG's function is `vector<int> numOfIslands(int n, int m, vector<vector<int>>& operators)`. The video above explains it too.

## What you need to do

A grid starts as all water. Each operation turns one cell into **land**. After **every** operation, report how many islands there are. An island is a group of land cells joined up, down, left or right.

## Example

4 × 5 grid, land added at (0,0), (0,0), (1,1), (1,0), …

- (0,0) → 1 island.
- (0,0) again → still 1.
- (1,1) → a separate island → 2.
- (1,0) touches both (0,0) and (1,1) → they join into **1**.

## How to solve it, step by step

1. **The slow idea:** after each operation, count the islands from scratch with BFS. That redoes the whole grid every time.

2. **Notice: adding land only ever joins islands, it never splits one.**

   **Why:** this "things only merge" pattern is exactly what a Disjoint Set (DSU) is built for.

3. **Give each cell a number, `r · m + c`, and keep a DSU over all cells, plus a counter `islands`.**

4. **For each new land cell:**
   - If it is already land, nothing changes. Report the same count.
   - Otherwise mark it as land and add 1 to `islands` (it starts as an island of its own).
   - For each of its 4 neighbours that is land: if they are in **different** groups, join them and subtract 1.

   **Why:** joining two separate islands turns them into one. If they are already in the same group, nothing changes.

5. **Report `islands` after every operation.**

## Code (C++, for GfG)

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

## How fast is it?

Each DSU step costs almost O(1), so the total is about O(n·m + number of operations). Memory: O(n·m).

## Watch out for

- The **same cell twice**: the second time, nothing changes.
- A new cell can touch the **same** island from two sides. The "different groups" check makes the count drop only once.

(Tested on 3 000 random grids, recounting with BFS after every operation.)
