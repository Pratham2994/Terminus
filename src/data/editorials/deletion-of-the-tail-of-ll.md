# Deletion of the tail of Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* deleteTail(ListNode* &head)`. Nodes keep their value in `data`.

## What you need to do

Remove the **last** node of a linked list (1 to 1000 nodes) and return the head.

## Examples

- [1, 2, 3] → **[1, 2]**
- [1] → **[]** (return `nullptr`)

## How to solve it, step by step

1. **If there is only one node, delete it and return `nullptr`.**

   **Why:** the list becomes empty, and there is no node before the tail to fix.

2. **Otherwise walk to the second-last node:** move while `cur->next->next` is not `nullptr`.

   **Why:** in a singly linked list you cannot step back. To cut off the tail, you must stand on the node **before** it.

3. **Delete the tail and set `cur->next = nullptr`.**

   **Why:** the second-last node is now the last, so nothing comes after it.

## Code (C++)

```cpp
class Solution {
public:
    ListNode* deleteTail(ListNode* &head) {
        if (head == nullptr || head->next == nullptr) {   // 0 or 1 node
            delete head;
            head = nullptr;
            return head;
        }
        ListNode* cur = head;
        while (cur->next->next != nullptr) cur = cur->next; // second-last node
        delete cur->next;
        cur->next = nullptr;
        return head;
    }
};
```

## How fast is it?

One walk to the end: O(n) time, O(1) memory.

## Watch out for

- Without step 1, `cur->next->next` crashes on a one-node list.
- `delete` the removed node so its memory is freed. The judge does not check this, but interviewers notice.

## Walk through ([1, 2, 3])

- At 1: 1 → 2 → 3, so keep going.
- At 2: 2 → 3 → nothing, so stop. Delete 3 and set 2's next to `nullptr`.

Answer: **[1, 2]**.
