# Delete the element with value X

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* deleteNodeWithValueX(ListNode* &head, int X)`.

## The problem

Delete the node whose value is X from a singly linked list and return the head. **At most one** node has value X. If none does, return the list unchanged.

Examples: [3, 4, 5], X = 5 → **[3, 4]**. [3, 4, 5], X = 7 → **[3, 4, 5]**.

## The idea

Like deleting by position, but the search is by value:

1. If the **head** holds X, the new head is `head->next`.
2. Otherwise walk with `prev`, and look one node ahead: stop when `prev->next` holds X, or when there is nothing left.
3. If found, skip it: `prev->next = prev->next->next`.

Looking ahead is what lets us re-link. Once we stand **on** the X node, we can no longer reach the node before it.

## Code (C++)

```cpp
class Solution {
public:
    ListNode* deleteNodeWithValueX(ListNode* &head, int X) {
        if (head == nullptr) return head;
        if (head->data == X) {
            ListNode* old = head;
            head = head->next;
            delete old;
            return head;
        }
        ListNode* prev = head;
        while (prev->next != nullptr && prev->next->data != X) prev = prev->next;
        if (prev->next != nullptr) {                 // found it
            ListNode* gone = prev->next;
            prev->next = gone->next;
            delete gone;
        }
        return head;
    }
};
```

## Complexity

- Time: O(n).
- Space: O(1).

## Edge cases

- X not present → the loop ends at the tail, and nothing changes.
- X at the tail → prev is the second-last node, and it becomes the new tail.
- If X could appear **several** times, you would keep going instead of stopping after the first. This problem promises at most one.

## Dry run ([3, 4, 5], X = 5)

- The head holds 3 ≠ 5.
- prev = 3: next holds 4 ≠ 5 → move. prev = 4: next holds 5 → stop.
- Set 4->next = null and delete 5.

Answer: **[3, 4]**.
