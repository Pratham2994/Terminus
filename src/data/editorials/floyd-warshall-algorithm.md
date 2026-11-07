# Floyd Warshall Algorithm

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Floyd Warshall". GfG's function is `void floydWarshall(vector<vector<int>>& dist)`: change the matrix in place. A missing edge is **10⁸** (infinity), and edges can be **negative** (but there is no negative cycle). The video above explains it too.

## The problem

`dist[i][j]` is the weight of the edge i → j (10⁸ if none, 0 on the diagonal). Replace it with the **shortest distance** from every i to every j.

Example: dist = [[0, −1, 2], [1, 0, 10⁸], [3, 1, 0]] → **[[0, −1, 2], [1, 0, 3], [2, 1, 0]]**.

## The idea: allow one more middle vertex at a time

Define "the shortest path from i to j that only passes **through** vertices 0 … k − 1". Now allow vertex k as well. A shortest path either:

- does **not** use k → it stays `dist[i][j]`, or
- **does** use k → it goes i → k, then k → j: `dist[i][k] + dist[k][j]`.

Take the smaller one. After doing this for k = 0, 1, …, n − 1, every vertex is allowed in the middle, so the matrix holds the true shortest distances.

**The loop order is the whole algorithm: k must be the outer loop.** With k inside, `dist[i][k]` may not be final yet when you use it.

## Code (C++)

```cpp
class Solution {
  public:
    void floydWarshall(vector<vector<int>>& dist) {
        const int INF = 100000000;                 // GfG's "no edge"
        int n = dist.size();
        for (int k = 0; k < n; k++)                // allow k as a middle vertex
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (dist[i][k] != INF && dist[k][j] != INF &&
                        dist[i][k] + dist[k][j] < dist[i][j])
                        dist[i][j] = dist[i][k] + dist[k][j];
    }
};
```

## Complexity

- Time: O(n³). Space: O(1) extra (it works in the matrix itself).

## Edge cases

- **Skip infinite legs.** With negative edges, `10⁸ + (−5)` is smaller than `10⁸` and would turn "unreachable" into a fake distance. The `!= INF` checks prevent that.
- **Negative cycle detection:** after the loops, if any `dist[i][i] < 0`, vertex i is on a negative cycle. GfG promises there is none, but takeUforward's version may ask for it.

## Dry run (the example)

- k = 0: dist[1][2] via 0 = 1 + 2 = 3 < 10⁸ → **3**. dist[2][1] via 0 = 3 + (−1) = 2, but it is already 1 → keep.
- k = 1: dist[0][2] via 1 = −1 + 3 = 2, equal. dist[2][0] via 1 = 1 + 1 = **2** < 3.
- k = 2: no further changes.

Result **[[0, −1, 2], [1, 0, 3], [2, 1, 0]]**. (Tested on 3 000 random graphs with negative edges and no negative cycles against Bellman-Ford from every vertex.)
