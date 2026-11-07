# Requirements needed to construct a unique BT

> No free judge has this exact problem, so Terminus is your judge. The free editorial and video above explain it too. Run the hidden tests with the self-check program at the bottom in a free online compiler. The function here is `bool uniqueBinaryTree(int a, int b)`.

## The problem

You get two traversal types, a and b. Each is a number: **1 = preorder, 2 = inorder, 3 = postorder.** Return true if those two traversals (of a tree with **distinct** values) are always enough to build exactly one binary tree.

## Visible tests

| a | b | Answer |
|---|---|---|
| 1 | 2 | true (preorder + inorder) |
| 2 | 2 | false (two inorders) |
| 1 | 3 | false (preorder + postorder) |

## Step by step: why inorder is the key

1. **Preorder** is root, left, right. Its **first** element is the root.
2. **Postorder** is left, right, root. Its **last** element is the root.
3. **Inorder** is left, root, right. Once you know the root, everything **before** it in inorder is the left subtree, and everything **after** it is the right subtree.
4. So preorder (or postorder) tells you the root, and inorder splits the rest into left and right. Repeat on each side and the whole tree is fixed. **Preorder + inorder** and **postorder + inorder** give a unique tree.
5. **Why does preorder + postorder fail?** Take a root 1 with one child 2. If 2 is the left child: preorder 1 2, postorder 2 1. If 2 is the right child: preorder 1 2, postorder 2 1. Same traversals, two different trees. Nothing tells you which side a single child is on. Inorder would: 2 1 versus 1 2.
6. **Two copies of the same traversal** add no information, and one traversal alone is never enough (except for tiny trees). So (1,1), (2,2), (3,3) are all false.
7. **Rule:** true exactly when the two types are **different** and **one of them is 2** (inorder). The order of a and b does not matter.

## Complexity

O(1) time and space.

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
