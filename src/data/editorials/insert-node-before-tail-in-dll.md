# Insert node before tail in Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* insertBeforeTail(ListNode* head, int X)`.

## What you need to do

Insert a new node with value X **just before the last node** (1 to 100 nodes), and return the head.

## Examples

- [1, 2, 4], X = 3 → **[1, 2, 3, 4]**
- [4], X = 6 → **[6, 4]** (the head changes)

## How to solve it, step by step

1. **If there is only one node, the new node goes in front and becomes the head.** Link new → old head, and old head → back to new.

   **Why:** with one node, the tail is the head, and there is no node before it.

2. **Otherwise walk to the tail. Call the node before it `before`.**

3. **Make the new node pointing back to `before` and forward to the tail.** (The constructor `ListNode(X, before, tail)` does this.)

4. **Point `before->next` and `tail->prev` at the new node.**

   **Why:** a node in the middle needs four links: two of its own, and one from each neighbour.

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

## How fast is it?

One walk to the end: O(n) time, O(1) memory.

## Watch out for

- In the one-node case, do not forget `head->prev = new node`, or the back links break.
- Set all four links. Tests that walk backwards catch a missing one.

## Walk through ([1, 2, 4], X = 3)

The tail is 4; before it is 2. New node 3 points back to 2 and forward to 4. 2's next and 4's prev now point to 3. Answer: **[1, 2, 3, 4]**.
