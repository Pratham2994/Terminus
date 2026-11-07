# Insert node before (kth node) in Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* insertBeforeKthPosition(ListNode* head, int X, int K)`.

## The problem

Insert a new node with value X **before the K-th node** (1-based, 1 ≤ K ≤ n) of a doubly linked list, and return the head.

Examples: [1, 3, 5], X = 7, K = 2 → **[1, 7, 3, 5]**. [5], X = 7, K = 1 → **[7, 5]** (the head changes).

## The idea

- **K = 1**: the new node goes in front of the head and becomes the new head. Link new->next = head and head->prev = new.
- **K ≥ 2**: walk K − 1 steps to the K-th node. The new node goes between `kth->prev` (before) and `kth`. Set the four links, as in any middle insertion:
  new->prev = before, new->next = kth, before->next = new, kth->prev = new.

Because K ≤ n, the K-th node always exists, so there is no "after the tail" case.

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

## Complexity

- Time: O(K).
- Space: O(1).

## Edge cases

- K = n inserts before the tail. That is the same as "Insert node before tail".
- K = 1 is the only case where the head changes.

## Dry run ([1, 3, 5], X = 7, K = 2)

- kth = 3, before = 1.
- New node 7 (prev = 1, next = 3). 1->next = 7 and 3->prev = 7.

Answer: **[1, 7, 3, 5]**.
