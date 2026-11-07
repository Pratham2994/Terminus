# Insert node before tail in Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* insertBeforeTail(ListNode* head, int X)`.

## The problem

Insert a new node with value X **just before the last node** of a doubly linked list (1 to 100 nodes). Return the head.

Examples: [1, 2, 4], X = 3 → **[1, 2, 3, 4]**. [4], X = 6 → **[6, 4]** (the head changes).

## The idea

Find the tail. The new node goes between `tail->prev` (call it `before`) and `tail`. A new node in the middle needs **four** links:

1. new->prev = before
2. new->next = tail
3. before->next = new
4. tail->prev = new

The constructor `ListNode(X, before, tail)` sets links 1 and 2. Then set 3 and 4.

**Special case:** with one node, the tail **is** the head, and there is no `before`. The new node becomes the new head, in front of it.

## Code (C++)

```cpp
class Solution {
public:
    ListNode* insertBeforeTail(ListNode* head, int X) {
        if (head->next == nullptr) {                       // one node
            ListNode* node = new ListNode(X, nullptr, head);
            head->prev = node;
            return node;                                   // new head
        }
        ListNode* tail = head;
        while (tail->next != nullptr) tail = tail->next;
        ListNode* before = tail->prev;
        ListNode* node = new ListNode(X, before, tail);
        before->next = node;
        tail->prev = node;
        return head;
    }
};
```

## Complexity

- Time: O(n) to find the tail.
- Space: O(1).

## Edge cases

- One node: forgetting `head->prev = node` leaves the old head pointing back at nothing, and the prev links break.
- Set all four links. Tests that walk the prev pointers catch a missing one. (Ours do.)

## Dry run ([1, 2, 4], X = 3)

- tail = 4, before = 2.
- New node 3 (prev = 2, next = 4). Then 2->next = 3 and 4->prev = 3.

Answer: **[1, 2, 3, 4]**.
