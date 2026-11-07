# Minimum and Maximum in BST

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> findMinMax(TreeNode* root)`. Return {min, max}.

## What you need to do

Return the smallest and the biggest value in a Binary Search Tree (BST).

## Example

root = [8, 3, 12, 1, 6, 10, 14] → **[1, 14]**.

## How to solve it, step by step

1. **Remember the BST rule:** everything in a node's left side is smaller, and everything in its right side is bigger.

   **Why:** this rule tells you exactly where the smallest and biggest values must be, so you do not need to visit every node.

2. **For the minimum, keep going left until there is no left child.**

   **Why:** going left always reaches something smaller. When you cannot go left any more, nothing smaller exists.

3. **For the maximum, keep going right until there is no right child.**

4. **Use loops, not recursion.**

   **Why:** a very lopsided tree (like a chain of 100 000 nodes) could overflow the call stack with recursion.

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

## How fast is it?

O(h), the height of the tree: about log n for a balanced tree, up to n for a lopsided one. O(1) memory.

## Watch out for

- The smallest node is not always a leaf: it may still have a **right** child. Stop when there is no **left** child.
- One node → min and max are the same value.

## Walk through ([8, 3, 12, 1, 6, 10, 14])

- Left: 8 → 3 → 1 (no left child) → min **1**.
- Right: 8 → 12 → 14 (no right child) → max **14**.

Answer: **[1, 14]**.
