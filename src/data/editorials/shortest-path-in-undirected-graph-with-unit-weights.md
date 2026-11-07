# Shortest path in undirected graph with unit weights

> takeUforward's page needs Plus. Practise on GeeksforGeeks (the **Similar** link above). It asks for one distance instead of all of them; the box below shows the difference. The free editorial and video above cover it too.

## What you need to do

Every edge has length 1. Find the shortest distance from vertex 0 to **every** vertex. Write −1 for a vertex you cannot reach.

## What is different on GfG

| | takeUforward | GfG "Shortest Path in Unweighted Graph" |
|---|---|---|
| Start | vertex 0 | any vertex `src` |
| Answer | distances to **all** vertices | the distance to **one** vertex, `dest` |
| Function | `vector<int> shortestPath(vector<vector<int>>& edges, int N, int M)` in the self-check | `int shortestPath(int V, vector<vector<int>>& edges, int src, int dest)` |

**In short:** both are the same BFS. On GfG, start at `src` and return `dist[dest]`.

## Example

N = 3, edges [1,2] → **[0, −1, −1]**: vertex 0 has no edges, so nothing else is reachable.

## How to solve it, step by step

1. **When every edge has length 1, BFS gives the shortest distances.**

   **Why:** BFS visits vertices in order of how many edges away they are, and here that number is the distance.

2. **Build the neighbour lists** (both directions for each edge).

3. **Start: `dist` is −1 everywhere, `dist[0] = 0`, and the queue holds 0.**

   **Why:** −1 means "not reached yet", and it is also the answer for vertices you never reach.

4. **Take a vertex u from the front. For each neighbour v still at −1: set `dist[v] = dist[u] + 1` and add v to the queue.**

   **Why:** the first time BFS reaches a vertex is along a shortest path, so that distance is final.

5. **When the queue is empty, return `dist`.**

## Why not DFS?

DFS follows one path deep first, so the first time it reaches a vertex is not always the shortest way.

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

## How fast is it?

Every vertex and edge is handled once: O(N + M) time and memory.

## Watch out for

- The graph may be split into parts: unreachable vertices stay −1.

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
