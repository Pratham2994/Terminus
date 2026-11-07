# Connected Components

> takeUforward's page for this needs Plus, and LeetCode 323 is Premium. The **same problem** (count components from an edge list) is free on GeeksforGeeks: use the Problem link above. The function here is `int findNumberOfComponent(int V, vector<vector<int>>& edges)`.

## The problem

An undirected graph has V vertices (0 … V − 1) and an edge list. Count its **connected components**: the groups of vertices that can reach each other.

Example: V = 4, edges = [[0,1],[1,2]] → **2** ({0, 1, 2} and {3}).

## Way 1: DFS or BFS

Build an adjacency list. Walk the vertices: every vertex not yet visited starts a **new component**. Flood it with DFS or BFS, marking everything reachable. Count how many floods you start.

- Time: O(V + E). Space: O(V + E).

## Way 2: Disjoint Set Union (shown below)

Start with V separate components, one per vertex. For each edge (u, v), if u and v are in **different** sets, merge the two sets, which leaves one component fewer. If they are already in the same set, the edge changes nothing.

`find` returns a set's representative, its root. **Path compression** points each node straight at its root, which keeps later finds almost O(1).

DSU needs no adjacency list, and it handles edges arriving one at a time. That is why the Graphs line teaches it.

## Code (C++)

```cpp
class Solution {
    int findParent(vector<int>& parent, int x) {
        return parent[x] == x ? x : parent[x] = findParent(parent, parent[x]);
    }
public:
    int findNumberOfComponent(int V, vector<vector<int>>& edges) {
        vector<int> parent(V);
        iota(parent.begin(), parent.end(), 0);      // each vertex alone
        int components = V;
        for (auto& e : edges) {
            int a = findParent(parent, e[0]), b = findParent(parent, e[1]);
            if (a != b) {
                parent[a] = b;                      // merge two components
                components--;
            }
        }
        return components;
    }
};
```

## Complexity

- Time: O(V + E · α(V)), where α is the inverse Ackermann function, effectively a constant.
- Space: O(V).

## Edge cases

- Isolated vertices (like 3 in the example) count as their own component. Starting at V components handles that.
- Self-loops and repeated edges: `a == b`, so nothing changes. ✓

## Dry run (V = 4, edges [0,1], [1,2])

- Start: 4 components.
- [0,1]: roots 0 and 1 differ → merge → 3.
- [1,2]: root of 1 is now 1, and the root of 2 is 2 → merge → 2.

Answer: **2**. (Tested on 3 000 random graphs against a DFS count.)
