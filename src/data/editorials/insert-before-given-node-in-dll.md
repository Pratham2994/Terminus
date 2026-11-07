# Insert before given node in Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `void insertBeforeGivenNode(ListNode* node, int X)`. You are given the **node**, not the head.

## What you need to do

You get a node of a doubly linked list (never the head). Insert a new node with value X **just before** it.

## Examples

- [1, 2, 6], node = 6, X = 7 → **[1, 2, 7, 6]**
- [7, 5, 15], node = 5, X = 10 → **[7, 10, 5, 15]**

## How to solve it, step by step

1. **Save the node before it:** `before = node->prev`.

   **Why:** the node is never the head, so `before` always exists. You must save it first, because the next steps change `node->prev`.

2. **Make the new node, pointing back to `before` and forward to `node`.**

   **Why:** the new node sits between these two.

3. **Point `before->next` and `node->prev` at the new node.**

   **Why:** a node in the middle of a doubly linked list needs four links in total: two of its own, and one from each neighbour.

The head never changes, so nothing is returned. No search is needed, because the node already knows its neighbour: O(1).

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

## How fast is it?

Four link changes: O(1) time and memory.

## Watch out for

- If you change `node->prev` before saving `before`, you lose the way back to the node in front.

## Walk through ([7, 5, 15], node = 5, X = 10)

before = 7. New node 10 points back to 7 and forward to 5. Then 7's next and 5's prev point to 10. Answer: **[7, 10, 5, 15]**.
