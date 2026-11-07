# M Coloring Problem

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "M-Coloring Problem". GfG's function is `bool graphColoring(int v, vector<vector<int>>& edges, int m)` with an edge list. The video above explains it too.

## The problem

An undirected graph has V vertices (0-indexed) and an edge list. Can you color every vertex with one of **m** colors so that **no edge joins two vertices of the same color**? Return true or false.

Examples: V = 4, edges [0,1], [1,3], [2,3], [3,0], [0,2], m = 3 → **true**. A triangle (3 vertices, all joined) with m = 2 → **false**.

## Brute force

Try all m^V colorings and check each. Correct, but you check whole colorings that already broke on the first edge.

## Step by step: backtracking

1. Color the vertices **in order**: 0, then 1, then 2, …
2. For vertex u, try each color c = 1 … m. A color is **safe** if no neighbour of u already has c.
3. If safe: give u color c and move on to u + 1. If that leads to a full coloring, return true.
4. If no color works for u, **undo** and return false: the caller tries its next color.
5. When u reaches V, every vertex has a safe color → true.

The difference from brute force: you stop a branch the moment one vertex has no safe color, instead of finishing the coloring first.

## Code (C++)

```cpp
class Solution {
    bool solve(int u, int V, int m, vector<vector<int>>& adj, vector<int>& color) {
        if (u == V) return true;                       // every vertex colored
        for (int c = 1; c <= m; c++) {
            bool safe = true;
            for (int w : adj[u])
                if (color[w] == c) { safe = false; break; }
            if (!safe) continue;
            color[u] = c;
            if (solve(u + 1, V, m, adj, color)) return true;
            color[u] = 0;                              // undo, try the next color
        }
        return false;                                  // no color fits u
    }
  public:
    bool graphColoring(int v, vector<vector<int>>& edges, int m) {
        vector<vector<int>> adj(v);
        for (auto& e : edges) {
            adj[e[0]].push_back(e[1]);
            adj[e[1]].push_back(e[0]);
        }
        vector<int> color(v, 0);                       // 0 = not colored yet
        return solve(0, v, m, adj, color);
    }
};
```

## Complexity

- Time: O(m^V · V) in the worst case. Graph coloring is NP-complete, so no known algorithm is polynomial. The pruning makes typical inputs fast.
- Space: O(V + E) for the graph, O(V) for colors and recursion.

## Edge cases

- A **self-loop** (an edge [u, u]) makes coloring impossible: u would need to differ from itself. The safety check sees u's own color only after it is set, so the code above would miss it. Constraints on GfG exclude self-loops; if you meet them elsewhere, return false when you see one.
- No edges: any m ≥ 1 works.

## Dry run (triangle 0-1-2, m = 2)

- 0 → color 1. 1 → color 1 clashes with 0, color 2 is safe.
- 2 → color 1 clashes with 0, color 2 clashes with 1. No color → back up.
- 1 has no other color → back up. 0 → color 2, and the same thing happens mirrored. → **false**.

(Tested on 3 000 random graphs up to 7 vertices against trying all m^V colorings.)
