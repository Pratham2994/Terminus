# Word Search

> Solve it on [LeetCode 79 · Word Search](https://leetcode.com/problems/word-search/).

## The problem

Given an m × n grid of letters (m, n ≤ 6) and a word (length ≤ 15), return true if the word can be traced through **adjacent** cells: up, down, left or right. No cell may be used twice in one path.

Example grid:

```text
A B C E
S F C S
A D E E
```

"ABCCED" → **true**. "SEE" → **true**. "ABCB" → **false**, because it would need the same B twice.

## The idea: DFS from every cell, with backtracking

Try every cell as the starting point. From a cell, `dfs(i, r, c)` asks: "can word[i..] be traced starting at (r, c)?"

1. If i == word length → true. Every letter matched.
2. If (r, c) is outside the grid, or its letter ≠ word[i] → false.
3. **Mark** the cell as used (replace its letter with '#'), so this path cannot step on it again.
4. Try the 4 neighbours with i + 1.
5. **Unmark** the cell (put the letter back). Other paths may still use it.

Step 5 is the backtracking. Without it, a failed path would leave cells blocked for later starts.

## Code (C++)

```cpp
class Solution {
    bool dfs(vector<vector<char>>& b, const string& w, int i, int r, int c) {
        if (i == (int)w.size()) return true;
        if (r < 0 || c < 0 || r >= (int)b.size() || c >= (int)b[0].size() || b[r][c] != w[i])
            return false;
        char keep = b[r][c];
        b[r][c] = '#';                         // used on this path
        bool found = dfs(b, w, i + 1, r + 1, c) || dfs(b, w, i + 1, r - 1, c) ||
                     dfs(b, w, i + 1, r, c + 1) || dfs(b, w, i + 1, r, c - 1);
        b[r][c] = keep;                        // free it for other paths
        return found;
    }
public:
    bool exist(vector<vector<char>>& board, string word) {
        for (int r = 0; r < (int)board.size(); r++)
            for (int c = 0; c < (int)board[0].size(); c++)
                if (dfs(board, word, 0, r, c)) return true;
        return false;
    }
};
```

## Complexity

- Time: O(m · n · 3ᴸ), where L is the word length. After the first step, each step has at most 3 new directions, since the way back is marked.
- Space: O(L) recursion depth. The grid itself is the "visited" set, so no extra array is needed.

## Edge cases

- The board must look exactly the same afterwards. The unmarking guarantees that, even when we return true, because the `||` chain returns only after `b[r][c] = keep` runs.
- '#' must not occur in the word. It never does, since words are letters.

## Speed-ups worth knowing

- If the board has fewer of some letter than the word needs, return false at once.
- If the word's last letter is rarer on the board than its first letter, search for the reversed word. There are fewer starting points.

(Tested on 3 000 random boards against a search that keeps an explicit visited array. It also checks that the board is restored afterwards.)
