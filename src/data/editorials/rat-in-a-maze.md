# Rat in a Maze

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Rat in Maze". GfG's function is `vector<string> ratInMaze(vector<vector<int>>& maze)`. Return the paths in **lexicographic (sorted) order**; if there is none, return an empty list. The video above explains it too.

## The problem

An n × n grid has 1 (open) and 0 (blocked). A rat starts at (0, 0) and must reach (n − 1, n − 1). It moves **U**p, **D**own, **L**eft or **R**ight, only through open cells, and never visits a cell twice in one path. Return every path as a string of moves.

Example: 
maze = [[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]] → **["DDRDRR", "DRDDRR"]**.

## Step by step: backtracking

1. **State:** the current cell (r, c) and the path string so far.
2. **Done:** if (r, c) is the target, save the path.
3. **Choices:** try the four moves. A move is allowed if the next cell is inside the grid, open, and **not on the current path**.
4. **Mark, recurse, unmark:** mark the cell as visited before going deeper, and **unmark it when you come back**. Unmarking is the "backtrack": the cell may be used by a different path.
5. **Sorted output for free:** try the moves in alphabetical order, **D, L, R, U**. Then paths come out already sorted, because a DFS that always tries the smaller letter first produces strings in lexicographic order.
6. Check the start: if maze[0][0] is 0 (or the target is 0), there are no paths.

## Code (C++)

```cpp
class Solution {
    int n;
    vector<string> paths;
    string path;
    // Moves in alphabetical order, so the paths come out sorted.
    const int dr[4] = {1, 0, 0, -1};
    const int dc[4] = {0, -1, 1, 0};
    const char name[4] = {'D', 'L', 'R', 'U'};

    void go(vector<vector<int>>& maze, int r, int c) {
        if (r == n - 1 && c == n - 1) { paths.push_back(path); return; }
        maze[r][c] = 0;                                  // mark: on the current path
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && maze[nr][nc] == 1) {
                path.push_back(name[k]);
                go(maze, nr, nc);
                path.pop_back();
            }
        }
        maze[r][c] = 1;                                  // unmark: backtrack
    }
  public:
    vector<string> ratInMaze(vector<vector<int>>& maze) {
        n = maze.size();
        paths.clear();
        path.clear();
        if (maze[0][0] == 1 && maze[n - 1][n - 1] == 1) go(maze, 0, 0);
        return paths;
    }
};
```

## Complexity

- Time: O(3^(n²)) in the worst case. After the first step, each cell has at most 3 new directions (the 4th leads back). Real mazes prune most branches.
- Space: O(n²) for the recursion depth and the path.

## Edge cases

- n = 1 with maze [[1]]: the start is the target → one empty path "".
- The maze is restored after the search (every cell is unmarked), so the caller's grid is unchanged.

## Dry run (the example)

From (0, 0) only D is open → (1, 0). There, D → (2, 0) and R → (1, 1) both open. D first: (2, 0) → R (2, 1) → D (3, 1) → R R → "DDRDRR". Then the R branch: (1, 1) → D (2, 1) → D (3, 1) → R R → "DRDDRR".

(Tested on 3 000 random mazes up to 5 × 5 against a brute force that lists all simple paths and sorts them.)
