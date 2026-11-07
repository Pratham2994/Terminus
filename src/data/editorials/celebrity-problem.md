# Celebrity Problem

> takeUforward's page needs Plus, and LeetCode 277 is Premium. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int celebrity(vector<vector<int>>& mat)`. One small difference: on GfG, `mat[i][i]` is **1** (everyone "knows" themself); on takeUforward it is 0. The code below ignores that square, so it works on both. The video above explains it too.

## What you need to do

There are n people at a party. `mat[i][j] = 1` means person i knows person j. A **celebrity** is someone **everyone else knows**, who **knows nobody else**. Return the celebrity's number, or −1 if there is none.

## Example

```text
mat = [[0, 1, 0],
       [0, 0, 0],
       [0, 1, 0]]
```

Persons 0 and 2 both know person 1, and person 1 knows nobody. Answer: **1**.

## How to solve it, step by step

1. **The slow idea:** check every person's whole row and column. That is O(n²).

2. **Ask one question about two people a and b: does a know b?**
   - Yes → a knows someone, so **a is not** the celebrity.
   - No → a does not know b, so **b is not** the celebrity.

   **Why:** either answer rules one person out. After n − 1 questions, only one person is left.

3. **Use two pointers:** a starts at the first person, b at the last. If a knows b, move a forward; otherwise move b back. Stop when they meet.

   **Why:** this asks exactly those n − 1 questions.

4. **Check the person who is left:** they must know nobody, and everybody must know them.

   **Why:** the elimination only shows that nobody else can be the celebrity. There may be no celebrity at all, so this last check is required.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    int celebrity(vector<vector<int>>& mat) {
        int n = mat.size();
        int a = 0, b = n - 1;
        while (a < b) {                      // each question removes one person
            if (mat[a][b]) a++;              // a knows b: a is not the celebrity
            else b--;                        // a does not know b: b is not
        }
        int c = a;                           // the only candidate
        for (int k = 0; k < n; k++) {
            if (k == c) continue;            // ignore the diagonal
            if (mat[c][k] || !mat[k][c]) return -1;   // c knows k, or k does not know c
        }
        return c;
    }
};
```

## How fast is it?

n − 1 questions plus one check of a row and a column: O(n) time, no extra memory.

## Watch out for

- Skip the diagonal (`k == c`) in the final check. That is what makes GfG's 1s on the diagonal harmless.
- With 2 people who know each other, a candidate is left, but the final check rejects it → −1.

## Walk through (the example)

- a = 0, b = 2: does 0 know 2? No → b = 1.
- a = 0, b = 1: does 0 know 1? Yes → a = 1. They meet: the candidate is 1.
- Check: person 1 knows nobody, and persons 0 and 2 know 1 → **1**.

(Tested on 5 000 random cases, with 0s and with 1s on the diagonal.)
