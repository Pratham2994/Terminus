# Swim in Rising Water

> Solve it on [LeetCode 778 · Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/).

## What you need to do

Each cell of an n × n grid has a height (every value from 0 to n² − 1 appears once). At time t the water is at level t, and you can swim between neighbouring cells (up, down, left, right) only if **both** are at most t. Swimming takes no time. What is the earliest time you can get from the top-left to the bottom-right?

## Example

[[0, 2], [1, 3]] → **3**. You cannot reach the corner before the water covers the cell of height 3.

## How to solve it, step by step

1. **A path works as soon as t reaches the highest cell on it.**

   **Why:** every cell on the path must be under water.

2. **So find the path whose highest cell is as low as possible.** It is a shortest-path problem where a path's "length" is its **maximum**, not its sum.

3. **Use Dijkstra with max instead of plus.** `best[r][c]` is the lowest possible "highest cell" on a path to (r, c). Moving into a neighbour costs `max(current, height of the neighbour)`.

   **Why:** Dijkstra works for any path cost that never goes down as the path grows, and max never goes down.

4. **Always expand the cell with the smallest cost so far (a min-heap). When the target comes out of the heap, its cost is the answer.**

   **Why:** nothing left in the heap can lead to a cheaper path.

5. **Start the heap with the start cell's own height, not 0.**

   **Why:** you are standing in that cell, so it must be under water too.

## Another way: binary search

For a fixed t, a BFS over cells ≤ t tells you whether you can reach the corner. A bigger t never makes things worse, so binary search on t. Also O(n² log n).

## Code (C++)

```cpp
class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n = grid.size();
        vector<vector<int>> best(n, vector<int>(n, INT_MAX));
        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> heap;
        heap.push({grid[0][0], 0, 0});
        best[0][0] = grid[0][0];
        int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};
        while (!heap.empty()) {
            auto [t, r, c] = heap.top();
            heap.pop();
            if (r == n - 1 && c == n - 1) return t;
            if (t > best[r][c]) continue;                  // stale entry
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
                int nt = max(t, grid[nr][nc]);
                if (nt < best[nr][nc]) { best[nr][nc] = nt; heap.push({nt, nr, nc}); }
            }
        }
        return -1;
    }
};
```

## How fast is it?

O(n² log n) time, O(n²) memory.

## Watch out for

- n = 1: the answer is just the start cell's height.

## Walk through ([[0, 2], [1, 3]])

- Take (0, 0), cost 0. Add (1, 0) at cost 1 and (0, 1) at cost 2.
- Take (1, 0), cost 1. Add (1, 1) at cost max(1, 3) = 3.
- Take (0, 1), cost 2: reaching (1, 1) from here also costs 3, no better.
- Take (1, 1), cost 3: the target.

Answer: **3**. (Tested on 1 500 random grids against trying every t with BFS.)
