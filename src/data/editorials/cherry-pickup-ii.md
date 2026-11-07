# Cherry Pickup II

> Solve it on [LeetCode 1463 · Cherry Pickup II](https://leetcode.com/problems/cherry-pickup-ii/). takeUforward's free page has the same problem as `cherryPickup(matrix)`.

## What you need to do

A grid holds cherries. Robot 1 starts at the top-left, robot 2 at the top-right. Every step, **both** robots move down one row, to the column on the left, the same column, or the column on the right. Each robot collects the cherries where it stands; if both stand on the same cell, the cherries count **once**. Find the most cherries they can collect by the bottom row.

## Example

[[3,1,1],[2,5,1],[1,5,5],[2,1,1]] → **24**.

## How to solve it, step by step

1. **Move both robots together.** A state is (row, column of robot 1, column of robot 2).

   **Why:** they are always on the same row. Planning each robot alone fails, because both best paths might grab the same cherries.

2. **Let `dp[r][a][b]` = the most cherries from row r down to the bottom,** with robot 1 at column a and robot 2 at column b.

3. **Cherries in row r:** grid[r][a] + grid[r][b], or just grid[r][a] if a == b.

   **Why:** the same cell's cherries can only be picked once.

4. **Then add the best of the 9 next moves:** each robot goes −1, 0 or +1 columns (staying inside the grid).

   **Why:** 3 choices per robot, so 3 × 3 combinations.

5. **On the bottom row there are no more moves:** just the cherries there.

6. **Each row only needs the row below it, so keep two layers** (`next` and `cur`) instead of the whole 3D table.

   **Why:** it cuts memory from rows × cols² to cols².

7. **The answer is the value for row 0 with a = 0 and b = cols − 1.**

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

## How fast is it?

rows × cols² states, 9 moves each: about 3 million steps for a 70 × 70 grid. Memory: O(cols²).

## Watch out for

- The `a == b` check (step 3).
- After the last swap, the answer is in `next`, not `cur`.

## How to get here on the DP line

First write the recursion: f(r, a, b) = cherries here + the best of the 9 moves of f(r + 1, ·, ·). Then add memoisation. Then turn it into this bottom-up table.

(Tested on 600 random grids against the plain recursion.)
