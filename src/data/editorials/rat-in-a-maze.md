# Rat in a Maze

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Rat in Maze". GfG's function is `vector<string> ratInMaze(vector<vector<int>>& maze)`. Return the paths **in sorted order**, or an empty list if there are none. The video above explains it too.

## What you need to do

A square grid has 1 (open) and 0 (wall). A rat starts at the top-left and must reach the bottom-right. It can move **D**own, **L**eft, **R**ight or **U**p, only through open cells, and it never visits the same cell twice in one path. List every path as a string of moves.

## Example

```text
1 0 0 0
1 1 0 1
1 1 0 0
0 1 1 1
```

Answer: **["DDRDRR", "DRDDRR"]**.

## How to solve it, step by step

1. **Stand on a cell and try all four moves.** For each move, check that the next cell is inside the grid, open, and not already on this path.

   **Why:** these are the only rules for a legal move.

2. **Mark the cell before going deeper, and unmark it when you come back.**

   **Why:** marking stops the rat from walking in circles. Unmarking (the "backtrack") lets a different path use that cell later.

3. **When you reach the bottom-right, save the path.**

   **Why:** that path is complete.

4. **Try the moves in alphabetical order: D, L, R, U.**

   **Why:** then the paths come out already sorted, so you do not need to sort at the end.

5. **Check the start first:** if the top-left (or bottom-right) is a wall, there are no paths.

## Code (C++, for GfG)

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

## How fast is it?

In the worst case, each step has up to 3 new directions, so it is exponential. Walls cut most branches early, so real mazes run quickly. Memory: O(n²) for the path and the recursion.

## Watch out for

- A 1 × 1 maze with [[1]]: the rat is already there, so the answer is one empty path, "".
- The code unmarks every cell, so the maze you were given is unchanged afterwards.

(Tested on 3 000 random mazes up to 5 × 5 against listing every path and sorting.)
