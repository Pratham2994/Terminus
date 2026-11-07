# Traversal Techniques

> No free judge has this exact problem, so Terminus is your judge. The video above explains it too. Check your answer with the self-check program at the bottom. The function here is `vector<vector<int>> dfsAndBfs(int V, vector<vector<int>>& edges)`: return {DFS order, BFS order}. For extra practice, GfG has each half separately: [DFS of Graph](https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1) and [BFS of Graph](https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1). They give an adjacency list instead of edges.

## What you need to do

A connected graph has V vertices (0 to V − 1) and a list of edges [u, v] that go both ways. Starting at vertex 0, return the order in which **DFS** visits the vertices, and the order in which **BFS** visits them.

## Visible tests

| V | edges | DFS | BFS |
|---|---|---|---|
| 4 | [0,1], [0,3], [1,2] | [0, 1, 2, 3] | [0, 1, 3, 2] |
| 3 | [0,1], [0,2] | [0, 1, 2] | [0, 1, 2] |

The order depends on which neighbour you try first. Build the neighbour lists in edge order, as above. The self-check accepts **any** correct DFS and BFS order.

## How to solve it, step by step

1. **Build a neighbour list:** for each edge [u, v], add v to u's list **and** u to v's list.

   **Why:** the edges go both ways, so each end must know about the other.

2. **DFS (go deep first):** visit a vertex and mark it. Then, for each unvisited neighbour, visit it **straight away** (recursion).

   **Why:** DFS follows one path as far as it can before coming back to try the next one.

3. **BFS (go wide first):** use a **queue**. Put 0 in and mark it. Repeatedly take the front vertex, record it, and add each unvisited neighbour to the back, **marking it as you add it**.

   **Why:** a queue serves vertices in the order they were found, so all vertices one step away come before those two steps away.

4. **In BFS, mark a vertex when you add it, not when you take it out.**

   **Why:** otherwise two neighbours can both add the same vertex before it is taken out, and it appears twice.

5. **Use separate "visited" marks for DFS and BFS.**

   **Why:** after DFS, every vertex is marked, so BFS would visit nothing.

## How fast is it?

Each traversal visits every vertex once and looks at every edge twice: O(V + E). Memory: O(V + E) for the neighbour lists.

## Walk through (V = 4, edges [0,1], [0,3], [1,2])

Neighbours: 0 → [1, 3], 1 → [0, 2], 2 → [1], 3 → [0].

- DFS: 0 → 1 → 2, back to 0 → 3. Order **[0, 1, 2, 3]**.
- BFS: queue [0] → take 0, add 1 and 3 → take 1, add 2 → take 3 → take 2. Order **[0, 1, 3, 2]**.

## Check your solution

1. Write your solution first, and check it on the visible tests.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. Each test checks that your DFS order is a real depth-first order and your BFS order a real breadth-first order of that graph.

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    vector<vector<int>> dfsAndBfs(int V, vector<vector<int>>& edges) {
        // Write your solution here. Return {dfs order, bfs order}.
        return {{}, {}};
    }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

// Valid when it is a permutation of 0..V-1 starting at 0, and re-running the traversal
// with every neighbour list sorted by position in `order` gives back `order`.
bool isPerm(int V, const vector<int>& order) {
    if ((int)order.size() != V || order.empty() || order[0] != 0) return false;
    vector<int> seen(V, 0);
    for (int x : order) {
        if (x < 0 || x >= V || seen[x]) return false;
        seen[x] = 1;
    }
    return true;
}
vector<vector<int>> sortedAdj(int V, const vector<vector<int>>& edges, const vector<int>& order) {
    vector<int> pos(V);
    for (int i = 0; i < V; i++) pos[order[i]] = i;
    vector<vector<int>> adj(V);
    for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
    for (auto& l : adj) sort(l.begin(), l.end(), [&](int a, int b) { return pos[a] < pos[b]; });
    return adj;
}
void dfsRef(int u, const vector<vector<int>>& adj, vector<int>& seen, vector<int>& out) {
    seen[u] = 1; out.push_back(u);
    for (int v : adj[u]) if (!seen[v]) dfsRef(v, adj, seen, out);
}
bool validDfs(int V, const vector<vector<int>>& edges, const vector<int>& order) {
    if (!isPerm(V, order)) return false;
    auto adj = sortedAdj(V, edges, order);
    vector<int> seen(V, 0), out;
    dfsRef(0, adj, seen, out);
    return out == order;
}
bool validBfs(int V, const vector<vector<int>>& edges, const vector<int>& order) {
    if (!isPerm(V, order)) return false;
    auto adj = sortedAdj(V, edges, order);
    vector<int> seen(V, 0), out;
    queue<int> q; q.push(0); seen[0] = 1;
    while (!q.empty()) {
        int u = q.front(); q.pop(); out.push_back(u);
        for (int v : adj[u]) if (!seen[v]) { seen[v] = 1; q.push(v); }
    }
    return out == order;
}

int main() {
    vector<pair<int, vector<vector<int>>>> tests = {
        {4, {{0, 1}, {0, 3}, {1, 2}}},
        {3, {{0, 1}, {0, 2}}},
        {5, {{0, 1}, {0, 2}, {0, 3}, {2, 4}}},
        {1, {}},
        {2, {{1, 0}}},
        {5, {{0, 1}, {1, 2}, {2, 3}, {3, 4}}},
        {5, {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 2}}},
        {6, {{0, 5}, {5, 4}, {4, 3}, {0, 1}, {1, 2}, {2, 3}}},
        {7, {{0, 1}, {0, 2}, {1, 3}, {1, 4}, {2, 5}, {2, 6}}},
        {6, {{0, 1}, {0, 2}, {0, 3}, {0, 4}, {0, 5}, {1, 2}, {2, 3}, {3, 4}, {4, 5}}},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        auto [V, edges] = tests[i];
        vector<vector<int>> e = edges;
        vector<vector<int>> got = Solution().dfsAndBfs(V, e);
        vector<int> dfs = got.size() > 0 ? got[0] : vector<int>{};
        vector<int> bfs = got.size() > 1 ? got[1] : vector<int>{};
        bool okD = validDfs(V, edges, dfs), okB = validBfs(V, edges, bfs);
        if (okD && okB) { passed++; continue; }
        cout << "Test " << i + 1 << " failed (V = " << V << ", " << edges.size() << " edges):";
        if (!okD) cout << " DFS " << show(dfs) << " is not a valid DFS order.";
        if (!okB) cout << " BFS " << show(bfs) << " is not a valid BFS order.";
        cout << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution (C++)
```cpp
class Solution {
    void dfs(int u, vector<vector<int>>& adj, vector<int>& seen, vector<int>& out) {
        seen[u] = 1;
        out.push_back(u);
        for (int v : adj[u])
            if (!seen[v]) dfs(v, adj, seen, out);   // go deep at once
    }
public:
    vector<vector<int>> dfsAndBfs(int V, vector<vector<int>>& edges) {
        vector<vector<int>> adj(V);
        for (auto& e : edges) {                     // undirected: both ways
            adj[e[0]].push_back(e[1]);
            adj[e[1]].push_back(e[0]);
        }

        vector<int> seen(V, 0), dfsOrder;
        dfs(0, adj, seen, dfsOrder);

        vector<int> mark(V, 0), bfsOrder;
        queue<int> q;
        q.push(0);
        mark[0] = 1;                                // mark on push, not on pop
        while (!q.empty()) {
            int u = q.front(); q.pop();
            bfsOrder.push_back(u);
            for (int v : adj[u])
                if (!mark[v]) { mark[v] = 1; q.push(v); }
        }
        return {dfsOrder, bfsOrder};
    }
};
```
:::
