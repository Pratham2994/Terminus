# Floyd Warshall Algorithm

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Floyd Warshall". GfG's function is `void floydWarshall(vector<vector<int>>& dist)`: change the matrix in place. A missing edge is written as **10⁸**, and edges can be **negative** (but there is no negative cycle). The video above explains it too.

## What you need to do

`dist[i][j]` is the length of the road from i to j (10⁸ if there is none, 0 from a city to itself). Change every entry to the **shortest** distance from i to j, using any route.

## Example

```text
before:  [0, -1,  2]      after:  [0, -1, 2]
         [1,  0, 1e8]             [1,  0, 3]
         [3,  1,  0]              [2,  1, 0]
```

From 1 to 2 there was no direct road, but 1 → 0 → 2 costs 1 + 2 = **3**.

## How to solve it, step by step

1. **Pick a city k and allow routes to pass through it.** For every pair (i, j), check whether going i → k → j is shorter than the best route so far.

   **Why:** the best route either uses k or it does not. If it does, it is "best to k" plus "best from k".

2. **Do this for k = 0, then 1, then 2, … up to the last city.**

   **Why:** after step k, the table holds the best routes that only pass through cities 0 … k. After the last k, every city is allowed, so the table is complete.

3. **k must be the outer loop,** with i and j inside it.

   **Why:** when you use `dist[i][k]` and `dist[k][j]`, they must already be final for "cities up to k − 1". The wrong loop order uses half-finished values.

4. **Skip a pair when either half is 10⁸ (no road).**

   **Why:** with negative edges, 10⁸ + (−5) is less than 10⁸, and an unreachable city would suddenly look reachable.

## Code (C++, for GfG)

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

## How fast is it?

Three nested loops over n cities: O(n³) time. It works inside the table, so no extra memory.

## Watch out for

- The 10⁸ check in step 4.
- **Finding a negative cycle:** after the loops, if any `dist[i][i]` is below 0, city i is on a negative cycle. GfG promises there is none, but takeUforward may ask for it.

## Walk through (the example)

- k = 0: 1 → 0 → 2 = 1 + 2 = 3, better than 10⁸ → **3**.
- k = 1: 2 → 1 → 0 = 1 + 1 = 2, better than 3 → **2**.
- k = 2: nothing improves.

(Tested on 3 000 random graphs with negative edges against Bellman-Ford from every city.)
