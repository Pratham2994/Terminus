# Requirements needed to construct a unique BT

> No free judge has this exact problem, so Terminus is your judge. The free editorial and video above explain it too. Check your answer with the self-check program at the bottom. The function here is `bool uniqueBinaryTree(int a, int b)`.

## What you need to do

You get two traversal types, a and b: **1 = preorder, 2 = inorder, 3 = postorder.** Return true if these two traversals (of a tree with all-different values) are always enough to rebuild **exactly one** tree.

## Visible tests

| a | b | Answer |
|---|---|---|
| 1 | 2 | true (preorder + inorder) |
| 2 | 2 | false (inorder twice) |
| 1 | 3 | false (preorder + postorder) |

## How to solve it, step by step

1. **Preorder tells you the root:** it is the **first** value. Postorder also tells you the root: it is the **last** value.

   **Why:** preorder visits the root before its children; postorder visits it after them.

2. **Inorder tells you the sides:** once you know the root, everything **before** it in inorder is the left side, and everything **after** it is the right side.

   **Why:** inorder visits left, then root, then right.

3. **So preorder + inorder, or postorder + inorder, fixes the whole tree.** Find the root, split into left and right, and repeat on each side.

4. **Preorder + postorder is not enough.** Example: root 1 with one child 2. If 2 is on the left, preorder is 1 2 and postorder is 2 1. If 2 is on the right, you get the same 1 2 and 2 1.

   **Why:** without inorder, nothing tells you which side a single child is on.

5. **The same traversal twice adds nothing new,** so (1,1), (2,2) and (3,3) are false.

6. **The rule:** true exactly when the two types are **different** and **one of them is 2** (inorder).

## How fast is it?

One comparison: O(1).

## All 9 cases

| a \ b | 1 | 2 | 3 |
|---|---|---|---|
| 1 | false | true | false |
| 2 | true | false | true |
| 3 | false | true | false |

## Check your solution

1. Write your solution first, from the rule you worked out (not from the table above).
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. It prints every failed test, then "x / y tests passed".

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    bool uniqueBinaryTree(int a, int b) {
        // Write your solution here.
        return a < 0;
    }
};
// ==================== YOUR CODE END ====================

int main() {
    // {a, b, expected}
    vector<tuple<int, int, bool>> tests = {
        {1, 1, false}, {1, 2, true}, {1, 3, false}, {2, 1, true}, {2, 2, false},
        {2, 3, true}, {3, 1, false}, {3, 2, true}, {3, 3, false},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        auto [a, b, want] = tests[i];
        bool got = Solution().uniqueBinaryTree(a, b);
        if (got == want) passed++;
        else cout << "Test " << i + 1 << " failed: a = " << a << ", b = " << b << ", expected "
                  << (want ? "true" : "false") << ", got " << (got ? "true" : "false") << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution (C++)
```cpp
class Solution {
public:
    bool uniqueBinaryTree(int a, int b) {
        // Unique only with inorder (2) plus one *other* traversal.
        return a != b && (a == 2 || b == 2);
    }
};
```
:::
