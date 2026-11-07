# Insertion at the tail of Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* insertAtTail(ListNode* &head, int X)`.

## The problem

Add a node with value X at the **end** of a singly linked list and return the head. The list may be **empty** (0 nodes).

Examples: [1, 2, 3], X = 7 → **[1, 2, 3, 7]**. [], X = 0 → **[0]**.

## The idea

1. Create the new node. Its `next` is nullptr, because it will be the last node.
2. If the list is empty, the new node **is** the list: it becomes the head.
3. Otherwise walk to the current last node (the one whose `next` is nullptr) and link the new node after it.

## Code (C++)

```cpp
class Solution {
public:
    ListNode* insertAtTail(ListNode* &head, int X) {
        ListNode* node = new ListNode(X);
        if (head == nullptr) {
            head = node;
            return head;
        }
        ListNode* cur = head;
        while (cur->next != nullptr) cur = cur->next;   // last node
        cur->next = node;
        return head;
    }
};
```

## Complexity

- Time: O(n) to find the tail. If you keep a `tail` pointer, as many real implementations do, it becomes O(1).
- Space: O(1) besides the new node.

## Edge cases

- Empty list: without the check, `cur->next` reads through a null pointer.
- The loop condition is `cur->next != nullptr`, not `cur != nullptr`. We need to stop **on** the last node, not after it.

## Dry run ([1, 2, 3], X = 7)

- cur = 1 → 2 → 3, where 3->next is null, so stop.
- Set 3->next = 7.

Answer: **[1, 2, 3, 7]**.
