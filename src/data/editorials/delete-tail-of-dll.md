# Delete Tail of Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode *deleteTail(ListNode *&head)`. Nodes have `data`, `prev` and `next`.

## What you need to do

Remove the last node of a doubly linked list (1 to 100 nodes) and return the head.

## Examples

- [1, 2, 3] → **[1, 2]**
- [7] → **[]**

## How to solve it, step by step

1. **If there is only one node, delete it and return `nullptr`.**

   **Why:** the list becomes empty.

2. **Otherwise walk to the last node itself.**

   **Why:** in a doubly linked list every node knows the node before it, so you can stand on the tail and still step back. (In a singly linked list you would have to stop one node early.)

3. **Go back one with `tail->prev`, and set that node's `next` to `nullptr`. Delete the tail.**

   **Why:** only this one link has to change. The new last node's `prev` is already right.

## Code (C++)

```cpp
class Solution {
public:
    ListNode *deleteTail(ListNode *&head) {
        if (head == nullptr || head->next == nullptr) {   // 0 or 1 node
            delete head;
            head = nullptr;
            return head;
        }
        ListNode* tail = head;
        while (tail->next != nullptr) tail = tail->next;
        tail->prev->next = nullptr;
        delete tail;
        return head;
    }
};
```

## How fast is it?

One walk to the end: O(n) time, O(1) memory.

## Watch out for

- The one-node case (step 1): there is no `prev` to step back to.

## Walk through ([1, 2, 3])

Walk to 3. Its prev is 2. Set 2's next to `nullptr` and delete 3. Answer: **[1, 2]**.
