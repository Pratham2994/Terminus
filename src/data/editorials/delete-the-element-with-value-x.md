# Delete the element with value X

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode* deleteNodeWithValueX(ListNode* &head, int X)`.

## What you need to do

Remove the node whose value is X and return the head. **At most one** node has value X. If none does, leave the list as it is.

## Examples

- [3, 4, 5], X = 5 → **[3, 4]**
- [3, 4, 5], X = 7 → **[3, 4, 5]**

## How to solve it, step by step

1. **If the head holds X, the new head is `head->next`.**

   **Why:** there is no node before the head to re-link.

2. **Otherwise walk with `prev`, and look one node ahead:** stop when `prev->next` holds X, or when there is no next node.

   **Why:** once you stand **on** the X node, you can no longer reach the node before it. Looking ahead keeps you one step behind, where the re-linking happens.

3. **If you found it, skip over it:** `prev->next = prev->next->next`, and delete it.

4. **If you reached the end without finding X, change nothing.**

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

## How fast is it?

At most one walk through the list: O(n) time, O(1) memory.

## Watch out for

- X in the last node: the node before it becomes the new last node, with no extra code.
- If X could appear several times, you would keep going instead of stopping. Here it appears at most once.

## Walk through ([3, 4, 5], X = 5)

The head holds 3, not 5. At 3, the next holds 4; move on. At 4, the next holds 5: stop. Set 4's next to `nullptr` and delete 5. Answer: **[3, 4]**.
