# Removing given node in Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `void deleteGivenNode(ListNode *node)`. You are given the **node**, not the head.

## What you need to do

You get a node of a doubly linked list (never the head). Remove it from the list.

## Examples

- [1, 3, 5], node = 3 → **[1, 5]**
- [1, 3, 7], node = 7 → **[1, 3]**

## How to solve it, step by step

1. **Make the node before it skip over it:** `node->prev->next = node->next`.

   **Why:** the node is never the head, so `node->prev` always exists.

2. **If there is a node after it, make that node point back past it:** `node->next->prev = node->prev`.

   **Why:** if the removed node was the tail, there is no next node, and nothing needs fixing on that side.

3. **Delete the node.**

This is why doubly linked lists are useful: the node knows both neighbours, so you can remove it without walking from the head.

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

## How fast is it?

Two link changes: O(1) time and memory.

## Watch out for

- Removing the tail: only step 1 runs, and the node before it becomes the new tail.
- In a singly linked list this would take a walk from the head, because you could not reach the node before.

## Walk through ([1, 3, 5], node = 3)

1's next becomes 5. 5's prev becomes 1. Answer: **[1, 5]**.
