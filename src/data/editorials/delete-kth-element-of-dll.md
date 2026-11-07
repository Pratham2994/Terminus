# Delete Kth Element of Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode *deleteKthElement(ListNode *&head, int k)`.

## What you need to do

Remove the k-th node (counting from 1) of a doubly linked list and return the head.

## Examples

- [2, 5, 7, 9], k = 2 → **[2, 7, 9]**
- [2, 5, 7], k = 1 → **[5, 7]** (the head changes)

## How to solve it, step by step

1. **Walk to the k-th node itself.**

   **Why:** in a doubly linked list the node knows both its neighbours, so you can stand on it.

2. **Fix the link coming from the left:** if there is a previous node, set `node->prev->next = node->next`. If there is none, the node is the head, so the new head is `node->next`.

   **Why:** the left neighbour must now skip over the removed node.

3. **Fix the link coming from the right:** if there is a next node, set `node->next->prev = node->prev`.

   **Why:** the right neighbour must now point back past the removed node.

4. **Delete the node.**

Handling each side on its own covers every case: the head, the tail, the middle, and a list of one.

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

## How fast is it?

At most k steps: O(k) time, O(1) memory.

## Watch out for

- When you remove the head, the new head's `prev` must become `nullptr`. Step 3 does that, because the old head's `prev` was `nullptr`.

## Walk through ([2, 5, 7, 9], k = 2)

Stand on 5. Left: 2's next becomes 7. Right: 7's prev becomes 2. Delete 5. Answer: **[2, 7, 9]**, with every back link correct.

(The tests check the back links too, not only the values.)
