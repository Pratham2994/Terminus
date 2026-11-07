# Removing given node in Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `void deleteGivenNode(ListNode *node)`. You get the **node**, not the head.

## The problem

You are given a pointer to one node of a doubly linked list (2 to 100 nodes). It is guaranteed **not to be the head**. Remove it from the list.

Examples: [1, 3, 5], node = 3 → **[1, 5]**. [1, 3, 7], node = 7 → **[1, 3]**.

## The idea

This is why doubly linked lists are useful: a node knows **both** neighbours, so you can unlink it without searching from the head.

- `node->prev` always exists, because the node is never the head. Make it skip the node: `node->prev->next = node->next`.
- `node->next` exists unless the node is the tail. If it exists, make it skip back: `node->next->prev = node->prev`.

The head never changes, which is why the function returns nothing.

## Code (C++)

```cpp
class Solution {
public:
    void deleteGivenNode(ListNode *node) {
        node->prev->next = node->next;
        if (node->next != nullptr) node->next->prev = node->prev;
        delete node;
    }
};
```

## Complexity

- Time: O(1).
- Space: O(1).

## Edge cases

- The tail (node = 7 in [1, 3, 7]): next is null, so only the first line runs, and 3 becomes the tail. ✓
- With a singly linked list you could not do this in O(1). You would need the node before it, and finding that takes a walk from the head.

## Dry run ([1, 3, 5], node = 3)

- 3->prev = 1 → set 1->next = 5.
- 3->next = 5 → set 5->prev = 1.

Answer: **[1, 5]**.
