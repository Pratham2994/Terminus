# Word Search

> Solve it on [LeetCode 79 · Word Search](https://leetcode.com/problems/word-search/).

## What you need to do

You get a grid of letters and a word. Can you trace the word by moving between **neighbouring** cells (up, down, left, right), without using any cell twice? Return true or false.

## Example

```text
A B C E
S F C S
A D E E
```

- "ABCCED" → **true**
- "SEE" → **true**
- "ABCB" → **false** (it would need the same B twice)

## How to solve it, step by step

1. **Try every cell as the starting point.**

   **Why:** the word can start anywhere.

2. **From a cell, `dfs(i, r, c)` asks: can the rest of the word, from letter i, be traced starting here?**

3. **If i equals the word length, return true. If the cell is outside the grid, or its letter is wrong, return false.**

   **Why:** these are the "done" and "dead end" cases.

4. **Mark the cell as used (put '#' in it), then try its 4 neighbours with i + 1.**

   **Why:** marking stops the path from stepping on the same cell twice. Using the grid itself means no extra visited array.

5. **Put the letter back before returning.**

   **Why:** this is the backtracking. A failed path must not leave cells blocked for other starting points.

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

## How fast is it?

For each of the m · n starting cells, the path can branch up to 3 ways per letter (the way back is marked): O(m · n · 3ᴸ) for a word of length L. Memory: O(L) for the recursion.

## Watch out for

- The grid must be unchanged afterwards. The code always puts the letter back, even when it returns true.

## Speed-ups worth knowing

- If the grid has fewer of some letter than the word needs, return false at once.
- If the word's last letter is rarer than its first, search for the reversed word: fewer starting points.

(Tested on 3 000 random grids against a search with a separate visited array, also checking that the grid is restored.)
