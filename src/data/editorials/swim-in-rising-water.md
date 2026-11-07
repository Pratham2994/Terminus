# Swim in Rising Water

> Solve it on [LeetCode 778 · Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/).

## The problem

grid is n × n (n ≤ 50) and holds every value 0 … n² − 1 once. At time t, the water level is t, and you may move to a neighbouring cell (4 directions) only if **both** cells have elevation ≤ t. Moving takes no time. Return the earliest time you can get from (0, 0) to (n − 1, n − 1).

Example: [[0,2],[1,3]] → **3**. You cannot reach the corner before the water covers cell 3.

## Restating it

Any path works once t reaches the **highest cell on that path**. So the answer is the path whose maximum cell is as small as possible. It is a shortest path where a path's "length" is its **max**, not its sum.

## Way 1: Dijkstra with max instead of sum (shown below)

Dijkstra works for any path cost that never decreases as the path grows, and max qualifies:

- `best[r][c]` = the lowest possible max-height on a path to (r, c).
- Moving into a neighbour costs `max(current, grid[nr][nc])`.
- Always expand the cell with the smallest cost so far (min-heap). The first time you pop the target, its cost is the answer.

## Way 2: binary search + BFS

The answer is some t in [0, n² − 1]. For a fixed t, a BFS over cells ≤ t tells you whether the target is reachable. Reachability only improves as t grows, so binary search on t. That is O(n² log n²).

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

## Complexity

- Time: O(n² log n²).
- Space: O(n²).

## Edge cases

- The start cell's own height counts: you are standing in it. That is why the heap starts with `grid[0][0]`, not 0.
- n = 1 → grid[0][0].

## Dry run ([[0,2],[1,3]])

- Pop (0, 0) at cost 0. Push (1, 0) at cost 1 and (0, 1) at cost 2.
- Pop (1, 0) at cost 1. Push (1, 1) at cost max(1, 3) = 3.
- Pop (0, 1) at cost 2. (1, 1) via here also costs 3, not better.
- Pop (1, 1) at cost 3 → the target.

Answer: **3**. (Tested on 1 500 random grids against trying every t with BFS.)
