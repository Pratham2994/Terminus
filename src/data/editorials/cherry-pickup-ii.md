# Cherry Pickup II

> Solve it on [LeetCode 1463 · Cherry Pickup II](https://leetcode.com/problems/cherry-pickup-ii/). takeUforward's free page has the same problem, under the name `cherryPickup(matrix)`.

## The problem

A rows × cols grid holds cherries. Robot 1 starts at the top-left (0, 0), and robot 2 at the top-right (0, cols − 1). Every step, **both** robots move down one row, to the column left, the same column, or the column right. Each robot collects the cherries in its cell. If both stand on the same cell, the cherries count **once**. Return the maximum total when they reach the bottom row.

Example: [[3,1,1],[2,5,1],[1,5,5],[2,1,1]] → **24**.

## Why do both robots go together?

The robots move down in **lockstep**, so at any time they are on the same row. A state is (row, column of robot 1, column of robot 2). Treating them separately fails: two separate best paths could both grab the same cell's cherries.

## The DP

`dp[r][a][b]` = the most cherries collectable from row r to the bottom, with robot 1 at column a and robot 2 at column b.

- Cherries at row r: grid[r][a] + grid[r][b], or only grid[r][a] when a == b.
- Next: the best of the 3 × 3 = 9 moves (a + da, b + db), da and db ∈ {−1, 0, 1}, staying inside the grid.
- Bottom row: just the cherries there.

Answer: dp[0][0][cols − 1]. Each row depends only on the row below it, so we keep just two layers, `next` and `cur`.

## Code (C++)

```cpp
class Solution {
public:
    int cherryPickup(vector<vector<int>>& grid) {
        int rows = grid.size(), cols = grid[0].size();
        // next[a][b]: best total from the row below, robots at columns a and b
        vector<vector<int>> next(cols, vector<int>(cols, 0)), cur(cols, vector<int>(cols, 0));
        for (int r = rows - 1; r >= 0; r--) {
            for (int a = 0; a < cols; a++)
                for (int b = 0; b < cols; b++) {
                    int here = grid[r][a] + (a == b ? 0 : grid[r][b]);
                    int bestBelow = 0;
                    if (r + 1 < rows) {
                        bestBelow = INT_MIN;
                        for (int da = -1; da <= 1; da++)
                            for (int db = -1; db <= 1; db++) {
                                int na = a + da, nb = b + db;
                                if (na >= 0 && nb >= 0 && na < cols && nb < cols)
                                    bestBelow = max(bestBelow, next[na][nb]);
                            }
                    }
                    cur[a][b] = here + bestBelow;
                }
            swap(cur, next);
        }
        return next[0][cols - 1];
    }
};
```

## Complexity

- Time: O(rows · cols² · 9). For a 70 × 70 grid that is about 3 × 10⁶ steps.
- Space: O(cols²) with the two layers.

## Edge cases

- Same cell → count it once. That is the `a == b` check.
- After the last `swap`, the answer sits in `next`, not `cur`.

## How to build it on the DP line

Write the recursion first: f(r, a, b) = here + max over 9 moves of f(r + 1, ·, ·). Then memoise it. Then turn it into the bottom-up table. The tabulation above is the last step. (Tested on 600 random grids against the plain recursion.)
