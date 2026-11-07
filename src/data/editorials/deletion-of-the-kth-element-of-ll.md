# Deletion of the Kth element of Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* deleteKthNode(ListNode* &head, int k)`.

## What you need to do

Remove the k-th node (counting from 1) and return the head.

## Examples

- [3, 4, 5], k = 2 → **[3, 5]**
- [1, 2, 3], k = 1 → **[2, 3]** (the head changes)

## How to solve it, step by step

1. **To remove a node, re-link the node before it** so it skips over: `prev->next = prev->next->next`.

   **Why:** nothing points to the removed node any more, so it is out of the list.

2. **If k = 1, there is no node before the head. The new head is `head->next`.**

   **Why:** removing the first node means the second one becomes the first.

3. **Otherwise walk k − 2 steps from the head.** That puts you on node k − 1, the one before the node to remove.

   **Why:** you start on node 1, so k − 2 steps reach node k − 1.

4. **Skip over node k and delete it.**

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

## How fast is it?

At most k steps: O(k) time, O(1) memory.

## Watch out for

- Removing the last node (k = n) needs no special code: the node before it simply points to `nullptr`.
- k = 1 on a one-node list gives an empty list.

## Walk through ([3, 4, 5], k = 2)

k is not 1. Walk 0 steps: prev = 3. Skip 4 (3's next becomes 5) and delete 4. Answer: **[3, 5]**.
