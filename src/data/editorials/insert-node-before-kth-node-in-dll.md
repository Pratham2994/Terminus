# Insert node before (kth node) in Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* insertBeforeKthPosition(ListNode* head, int X, int K)`.

## What you need to do

Insert a new node with value X **before the K-th node** (counting from 1) and return the head. K is always between 1 and the list length.

## Examples

- [1, 3, 5], X = 7, K = 2 → **[1, 7, 3, 5]**
- [5], X = 7, K = 1 → **[7, 5]** (the head changes)

## How to solve it, step by step

1. **If K = 1, the new node goes in front and becomes the new head.** Link new → head, and head → back to new.

   **Why:** there is no node before the head to attach to.

2. **Otherwise walk K − 1 steps to the K-th node.** Call the node before it `before`.

   **Why:** the new node goes between `before` and the K-th node.

3. **Set the four links:** new->prev = before, new->next = kth, before->next = new, kth->prev = new.

   **Why:** a node in the middle needs links in both directions, on both sides.

## Code (C++)

```cpp
class Solution {
public:
    ListNode* insertBeforeKthPosition(ListNode* head, int X, int K) {
        if (K == 1) {
            ListNode* node = new ListNode(X, nullptr, head);
            head->prev = node;
            return node;                                  // new head
        }
        ListNode* kth = head;
        for (int i = 1; i < K; i++) kth = kth->next;
        ListNode* before = kth->prev;
        ListNode* node = new ListNode(X, before, kth);
        before->next = node;
        kth->prev = node;
        return head;
    }
};
```

## How fast is it?

At most K steps: O(K) time, O(1) memory.

## Watch out for

- K = 1 is the only case where the head changes.
- K is never past the end, so there is no "add after the tail" case.

## Walk through ([1, 3, 5], X = 7, K = 2)

The 2nd node is 3; before it is 1. New node 7 points back to 1 and forward to 3. 1's next and 3's prev now point to 7. Answer: **[1, 7, 3, 5]**.
