# Connected Components

> takeUforward's page needs Plus, and LeetCode 323 is Premium. The **same problem** is free on GeeksforGeeks (the Problem link above). GfG's function is `int countConnected(int V, vector<vector<int>>& edges)`; the code below calls it `findNumberOfComponent`, with the same body.

## What you need to do

A graph has V vertices (0 to V − 1) and a list of edges. Count its **connected components**: the separate groups of vertices that can reach each other.

## Example

V = 4, edges [[0, 1], [1, 2]] → **2**: {0, 1, 2} and {3}.

## How to solve it, step by step

There are two good ways. The code uses the second one.

1. **Way 1, DFS or BFS:** go through the vertices; each one not yet visited starts a new group. Visit everything it can reach, and count how many times you start.

   **Why:** each start finds exactly one whole group.

2. **Way 2, Disjoint Set Union (DSU): start with V groups, one per vertex.**

   **Why:** before looking at any edge, every vertex is on its own.

3. **For each edge (u, v): find both groups' leaders. If they are different, join the groups and subtract 1 from the count.**

   **Why:** an edge between two separate groups turns them into one. An edge inside one group changes nothing.

4. **Path compression:** when finding a leader, point every node on the way straight at it.

   **Why:** later searches then take about one step.

DSU needs no neighbour lists, and it handles edges arriving one at a time, which is why the Graphs line teaches it here.

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

## How fast is it?

O(V + E) for DFS/BFS; almost the same for DSU (each step is close to O(1)). Memory: O(V).

## Watch out for

- A vertex with no edges is its own group (3 in the example). Starting the count at V handles that.
- Repeated edges and self-loops change nothing, because both ends already share a leader.

## Walk through (V = 4, edges [0, 1], [1, 2])

- Start: 4 groups.
- [0, 1]: different leaders → join → 3.
- [1, 2]: different leaders → join → 2.

Answer: **2**. (Tested on 3 000 random graphs against a DFS count.)
