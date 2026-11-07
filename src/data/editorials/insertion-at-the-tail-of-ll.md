# Insertion at the tail of Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* insertAtTail(ListNode* &head, int X)`.

## What you need to do

Add a new node with value X at the **end** of a linked list, and return the head. The list may be empty.

## Examples

- [1, 2, 3], X = 7 → **[1, 2, 3, 7]**
- [], X = 0 → **[0]**

## How to solve it, step by step

1. **Make the new node.** Its `next` is `nullptr`.

   **Why:** it will be the last node, so nothing comes after it.

2. **If the list is empty, the new node becomes the head. Return it.**

   **Why:** there is no last node to attach to.

3. **Otherwise walk to the current last node:** keep moving while `cur->next` is not `nullptr`.

   **Why:** you must stop **on** the last node, because that is the one whose `next` you change.

4. **Set `cur->next` to the new node, and return the head.**

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

## How fast is it?

O(n) to walk to the end, O(1) extra memory. (Real lists often keep a `tail` pointer, which makes this O(1).)

## Watch out for

- Skipping the empty-list check makes `cur->next` read through a null pointer and crash.
- The loop condition is `cur->next != nullptr`, not `cur != nullptr`. The second walks one step too far.

## Walk through ([1, 2, 3], X = 7)

Walk 1 → 2 → 3 (3 has no next). Set 3's next to 7. Answer: **[1, 2, 3, 7]**.
