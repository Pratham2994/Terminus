# Delete Kth Element of Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode *deleteKthElement(ListNode *&head, int k)`.

## The problem

Remove the k-th node (1-based) of a doubly linked list and return the head.

Examples: [2, 5, 7, 9], k = 2 → **[2, 7, 9]**. [2, 5, 7], k = 1 → **[5, 7]** (the head changes).

## The idea

Walk to the k-th node itself. Removing it from a doubly linked list means fixing **two** links around it:

- its previous node's `next` must skip it → `node->prev->next = node->next`;
- its next node's `prev` must skip it → `node->next->prev = node->prev`.

Each side might not exist:

- No `prev`: the node is the head, so the new head is `node->next`.
- No `next`: the node is the tail, so there is no `prev` link to fix.

Handling the two sides separately covers every case: head, tail, middle, and a single node.

## Code (C++)

```cpp
class Solution {
public:
    ListNode *deleteKthElement(ListNode *&head, int k) {
        ListNode* node = head;
        for (int i = 1; i < k; i++) node = node->next;     // the kth node
        if (node->prev != nullptr) node->prev->next = node->next;
        else head = node->next;                             // removing the head
        if (node->next != nullptr) node->next->prev = node->prev;
        delete node;
        return head;
    }
};
```

## Complexity

- Time: O(k).
- Space: O(1).

## Edge cases

- k = 1 on a one-node list: prev and next are both null, so head becomes null. ✓
- When the head is removed, the new head's `prev` must become null. `node->next->prev = node->prev` sets it to null, because node->prev is null. ✓

## Dry run ([2, 5, 7, 9], k = 2)

- node = 5. 5->prev = 2 → set 2->next = 7. 5->next = 7 → set 7->prev = 2.
- Delete 5.

Answer: **[2, 7, 9]**, with all prev links correct. (Tests check the prev links too, not only the values.)
