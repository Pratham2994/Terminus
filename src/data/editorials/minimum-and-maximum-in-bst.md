# Minimum and Maximum in BST

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> findMinMax(TreeNode* root)`. Return {min, max}.

## The problem

Given a valid Binary Search Tree (up to 10⁵ nodes, unique values), return its smallest and largest values.

Example: root = [8, 3, 12, 1, 6, 10, 14] → **[1, 14]**.

## Brute force

Visit every node (any traversal) and track the min and the max.

- Time: O(n). It works, but it ignores the BST property.

## The better idea: use the BST order

In a BST, everything in the left subtree is smaller and everything in the right subtree is larger. So:

- The **minimum** is the **leftmost** node: keep going left until there is no left child.
- The **maximum** is the **rightmost** node: keep going right until there is no right child.

## Code (C++)

```cpp
class Solution {
public:
    vector<int> findMinMax(TreeNode* root) {
        TreeNode* lo = root;
        while (lo->left != nullptr) lo = lo->left;
        TreeNode* hi = root;
        while (hi->right != nullptr) hi = hi->right;
        return {lo->data, hi->data};
    }
};
```

## Complexity

- Time: O(h), where h is the tree's height. That is O(log n) for a balanced tree, and O(n) for a skewed one, like a "linked list" of 10⁵ nodes.
- Space: O(1). Use loops, not recursion. A skewed tree of 10⁵ nodes could overflow the call stack.

## Edge cases

- One node → min = max = that value.
- The minimum is not always a leaf: the leftmost node may still have a **right** child. We only stop when there is no **left** child.

## Dry run ([8, 3, 12, 1, 6, 10, 14])

- Left: 8 → 3 → 1 (no left child) → min **1**.
- Right: 8 → 12 → 14 (no right child) → max **14**.

Answer: **[1, 14]**.
