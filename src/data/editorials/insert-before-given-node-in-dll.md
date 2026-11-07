# Insert before given node in Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `void insertBeforeGivenNode(ListNode* node, int X)`. You get the **node**, not the head.

## The problem

Given a pointer to a node of a doubly linked list (never the head), insert a new node with value X **just before** it.

Examples: [1, 2, 6], node = 6, X = 7 → **[1, 2, 7, 6]**. [7, 5, 15], node = 5, X = 10 → **[7, 10, 5, 15]**.

## The idea

Because the node is not the head, `node->prev` always exists. The new node goes between `before = node->prev` and `node`. Set the four links:

1. fresh->prev = before
2. fresh->next = node
3. before->next = fresh
4. node->prev = fresh

The head never changes, so nothing is returned. The whole operation is O(1), with no search, because the node already knows its neighbour.

## Code (C++)

```cpp
class Solution {
public:
    void insertBeforeGivenNode(ListNode* node, int X) {
        ListNode* before = node->prev;
        ListNode* fresh = new ListNode(X, before, node);
        before->next = fresh;
        node->prev = fresh;
    }
};
```

## Complexity

- Time: O(1).
- Space: O(1).

## Edge cases

- Save `before` **before** changing `node->prev`. If you set node->prev = fresh first, you lose the way back to the node before.

## Dry run ([7, 5, 15], node = 5, X = 10)

- before = 7. fresh = 10 (prev = 7, next = 5).
- 7->next = 10 and 5->prev = 10.

Answer: **[7, 10, 5, 15]**.
