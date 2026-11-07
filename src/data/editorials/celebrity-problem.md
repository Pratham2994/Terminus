# Celebrity Problem

> takeUforward's page needs Plus, and LeetCode 277 is Premium. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int celebrity(vector<vector<int>>& mat)`. One difference: on GfG `mat[i][i]` is **1** (everyone "knows" themself), on takeUforward it is 0. The code below ignores the diagonal, so it works on both. The video above explains it too.

## The problem

n people at a party. `mat[i][j] = 1` means person i knows person j. A **celebrity** is known by **everyone else** and knows **nobody else**. Return the celebrity's index, or −1.

Example: [[0, 1, 0], [0, 0, 0], [0, 1, 0]] → **1** (0 and 2 know 1; 1 knows nobody).

## Brute force

For each person c, check the whole row c (knows nobody) and column c (known by all). O(n²).

## The elimination trick

Ask **one** question about two people, a and b: does a know b?

- **Yes** → a knows someone, so a is **not** the celebrity.
- **No** → b is not known by a, so b is **not** the celebrity.

Either way, **one person is out**. After n − 1 questions, one candidate is left. That candidate is the **only** possible celebrity, but not a sure one (maybe there is none), so check it in O(n).

Two pointers make this easy: `a = 0`, `b = n − 1`. While a < b: if a knows b, a++ (a is out), else b-- (b is out).

## Code (C++)

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

## Complexity

- Time: O(n): n − 1 questions plus 2(n − 1) checks.
- Space: O(1).

## Edge cases

- n = 1: the single person is a celebrity (nobody else exists) → 0. The loop does not run, and the check has nothing to reject.
- The final check is **required**: [[0, 1], [1, 0]] leaves a candidate, but both know each other → −1.
- `if (k == c) continue` is what makes the GfG diagonal of 1s harmless.

## Dry run ([[0, 1, 0], [0, 0, 0], [0, 1, 0]])

- a = 0, b = 2: mat[0][2] = 0 → b = 1.
- a = 0, b = 1: mat[0][1] = 1 → a = 1. Stop. Candidate 1.
- Check: row 1 is all 0; column 1 has mat[0][1] = mat[2][1] = 1 → **1**.

(Tested on 5 000 random matrices, with 0 and with 1 on the diagonal, against the brute force.)
