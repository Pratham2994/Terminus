# Shortest path in undirected graph with unit weights

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above), "Shortest Path in Unweighted Graph": the same BFS, but it asks for **one** distance, from `src` to `dest`: `int shortestPath(int V, vector<vector<int>>& edges, int src, int dest)`. takeUforward asks for the distance from vertex 0 to **every** vertex. Both are below, with a self-check for takeUforward's version (the self-check uses `vector<int> shortestPath(vector<vector<int>>& edges, int N, int M)`). The free editorial and video above cover it too.

## The problem

An undirected graph has N vertices and M edges, all of length 1. Return the shortest distance from vertex 0 to every vertex, or −1 for a vertex you cannot reach.

## Visible tests

| N | edges | Answer |
|---|---|---|
| 9 | [0,1] [0,3] [3,4] [4,5] [5,6] [1,2] [2,6] [6,7] [7,8] [6,8] | [0, 1, 2, 1, 2, 3, 3, 4, 4] |
| 3 | [1,2] | [0, -1, -1] |

## Step by step

1. **When every edge costs 1, BFS is Dijkstra.** BFS visits vertices in order of the number of edges from the start, which here **is** the distance.
2. Build the adjacency list (both directions).
3. `dist` = −1 for all, `dist[0] = 0`, queue = [0].
4. Pop u. For every neighbour v with `dist[v] == −1`: set `dist[v] = dist[u] + 1` and push v.
5. The first time a vertex gets a distance, it is final: anything reaching it later comes from the same level or a later one.
6. Vertices never reached keep −1, which is what the answer wants.
7. For GfG's single pair: run the same BFS from `src` and return `dist[dest]` (you can stop as soon as you pop `dest`).

## Why not DFS?

DFS goes deep along one path first, so the first time it reaches a vertex is not necessarily by the shortest route. Fixing that needs revisiting vertices, which is much slower.

## Code for GfG (submit this there)

```cpp
class Solution {
  public:
    int shortestPath(int V, vector<vector<int>>& edges, int src, int dest) {
        vector<vector<int>> adj(V);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
        vector<int> dist(V, -1);
        queue<int> q;
        dist[src] = 0;
        q.push(src);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (u == dest) return dist[u];               // first pop = shortest
            for (int v : adj[u])
                if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
        }
        return -1;                                      // dest not reachable
    }
};
```

## Complexity

- Time: O(N + M). Space: O(N + M).

## Edge cases

- The graph can be **disconnected**: unreached vertices stay −1.
- N = 1: [0].

## Check takeUforward's version

1. Write the all-vertices version first.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. It prints every failed test, then "x / y tests passed".

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    vector<int> shortestPath(vector<vector<int>>& edges, int N, int M) {
        // Write your solution here.
        return {};
    }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

int main() {
    // {N, edges, expected distances from 0}
    vector<tuple<int, vector<vector<int>>, vector<int>>> tests = {
        {9, {{0, 1}, {0, 3}, {3, 4}, {4, 5}, {5, 6}, {1, 2}, {2, 6}, {6, 7}, {7, 8}, {6, 8}}, {0, 1, 2, 1, 2, 3, 3, 4, 4}},
        {8, {{1, 0}, {2, 1}, {0, 3}, {3, 7}, {3, 4}, {7, 4}, {7, 6}, {4, 5}, {4, 6}, {6, 5}}, {0, 1, 2, 1, 2, 3, 3, 2}},
        {1, {}, {0}},
        {3, {{1, 2}}, {0, -1, -1}},
        {4, {{0, 1}, {1, 2}, {2, 3}, {3, 0}}, {0, 1, 2, 1}},
        {8, {}, {0, -1, -1, -1, -1, -1, -1, -1}},
        {9, {{0, 4}, {0, 6}, {0, 7}, {0, 8}, {1, 3}, {1, 4}, {1, 7}, {1, 8}, {2, 3}, {2, 8}, {4, 5}, {4, 6}, {5, 6}, {5, 7}, {7, 8}}, {0, 2, 2, 3, 1, 2, 1, 1, 1}},
        {9, {{2, 3}, {2, 7}, {3, 4}, {3, 5}, {3, 6}, {5, 6}}, {0, -1, -1, -1, -1, -1, -1, -1, -1}},
        {7, {{0, 3}, {0, 5}, {0, 6}, {1, 2}, {1, 3}, {2, 3}, {2, 4}, {2, 5}, {3, 4}, {3, 5}, {4, 5}}, {0, 2, 2, 1, 2, 1, 1}},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        auto [N, edges, want] = tests[i];
        vector<vector<int>> e = edges;
        vector<int> got = Solution().shortestPath(e, N, (int)edges.size());
        if (got == want) passed++;
        else cout << "Test " << i + 1 << " failed (N = " << N << ", " << edges.size() << " edges)\n  expected "
                  << show(want) << "\n  got      " << show(got) << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution for takeUforward's version (C++)
```cpp
class Solution {
public:
    vector<int> shortestPath(vector<vector<int>>& edges, int N, int M) {
        vector<vector<int>> adj(N);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
        vector<int> dist(N, -1);
        queue<int> q;
        dist[0] = 0;
        q.push(0);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u])
                if (dist[v] == -1) {                    // first visit = shortest
                    dist[v] = dist[u] + 1;
                    q.push(v);
                }
        }
        return dist;                                    // unreached stay -1
    }
};
```
:::
