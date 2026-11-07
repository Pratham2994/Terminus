# M Coloring Problem

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "M-Coloring Problem". GfG's function is `bool graphColoring(int v, vector<vector<int>>& edges, int m)`, with a list of edges. The video above explains it too.

## What you need to do

You have a graph and **m colours**. Can you colour every vertex so that **no two connected vertices share a colour**? Return true or false.

## Example

- A triangle (3 vertices, all connected) with m = 2 → **false**: two of the three must share a colour.
- The same triangle with m = 3 → **true**.

## How to solve it, step by step

1. **Colour the vertices one by one,** in order: 0, 1, 2, …

   **Why:** a fixed order makes it easy to know what is done and what is left.

2. **For the current vertex, try colour 1, then 2, … up to m.** A colour is allowed if no neighbour already has it.

   **Why:** that is the only rule of the problem.

3. **If a colour is allowed, use it and move on** to the next vertex. If everything after works out, return true.

4. **If no colour works for this vertex, go back** (return false) so the previous vertex tries its next colour. Remove the colour you set first.

   **Why:** this is backtracking. A dead end tells you an earlier choice was wrong, so you undo it and try again.

5. **When every vertex has a colour, return true.**

## Code (C++, for GfG)

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

## How fast is it?

In the worst case it tries up to m^V colourings, so it is exponential. No fast method is known for this problem in general. Stopping at the first clash keeps small graphs fast. Memory: O(V + E).

## Watch out for

- A vertex connected to itself (a self-loop) can never be coloured. GfG does not include them; elsewhere, return false when you see one.
- A graph with no edges works with any m ≥ 1.

## Walk through (triangle, m = 2)

- Vertex 0 → colour 1. Vertex 1 → colour 1 clashes, colour 2 is fine.
- Vertex 2 → colour 1 clashes with 0, colour 2 clashes with 1. Dead end → go back.
- Vertex 1 has no other colour, so go back to 0 → colour 2. The same thing happens the other way round → **false**.

(Tested on 3 000 random graphs up to 7 vertices against trying every colouring.)
