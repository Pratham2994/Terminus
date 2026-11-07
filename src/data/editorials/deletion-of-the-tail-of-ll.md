# Deletion of the tail of Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* deleteTail(ListNode* &head)`, and nodes store their value in `data`.

## The problem

Delete the **last** node of a singly linked list (1 to 1000 nodes) and return the head.

Examples: [1, 2, 3] → **[1, 2]**. [1] → **[]** (return nullptr).

## The idea

In a singly linked list you cannot step backwards. To cut off the tail, you must stand on the node **before** it, the second-last node, and set its `next` to nullptr.

So walk while `cur->next->next != nullptr`. When the loop stops, cur is the second-last node.

Handle the one-node list first. There is no second-last node, so the list becomes empty.

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

## Complexity

- Time: O(n), one walk to the end.
- Space: O(1).

## Edge cases

- One node → return nullptr. Without the first check, `cur->next->next` would read through a null pointer and crash.
- `delete` the removed node so it does not leak. The judge does not check this, but interviewers notice.

## Dry run ([1, 2, 3])

- cur = 1: 1→2→3, so cur->next->next = 3 is not null → move.
- cur = 2: 2→3→null → stop. Delete 3, set 2->next = null.

Answer: **[1, 2]**.
