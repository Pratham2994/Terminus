# Deletion of the Kth element of Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* deleteKthNode(ListNode* &head, int k)`.

## The problem

Delete the k-th node (1-based, 1 ≤ k ≤ n) of a singly linked list and return the head.

Examples: [3, 4, 5], k = 2 → **[3, 5]**. [1, 2, 3], k = 1 → **[2, 3]** (the head changes).

## The idea

To remove a node, re-link the node **before** it: `prev->next = prev->next->next`.

- **k = 1**: there is no node before the head, so the new head is `head->next`.
- **k ≥ 2**: walk k − 2 steps from the head to reach node k − 1, then skip over node k.

## Code (C++)

```cpp
class Solution {
public:
    ListNode* deleteKthNode(ListNode* &head, int k) {
        if (k == 1) {
            ListNode* old = head;
            head = head->next;
            delete old;
            return head;
        }
        ListNode* prev = head;
        for (int i = 1; i < k - 1; i++) prev = prev->next;   // node k-1
        ListNode* gone = prev->next;
        prev->next = gone->next;
        delete gone;
        return head;
    }
};
```

## Complexity

- Time: O(k).
- Space: O(1).

## Edge cases

- k = 1 with a one-node list → the head becomes nullptr. The first branch handles that.
- k = n (the tail): prev is the second-last node and `gone->next` is nullptr, so prev becomes the new tail. No special code is needed.

## Dry run ([3, 4, 5], k = 2)

- k ≠ 1. The loop runs 0 times, so prev = 3.
- gone = 4. Set 3->next = 5 and delete 4.

Answer: **[3, 5]**.
