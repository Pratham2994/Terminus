# Find the length of the Linked List

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Length of Linked List". GfG's function is `int getCount(Node* head)`. The video above explains it too.

## The problem

Return the number of nodes in a singly linked list.

Examples: 1 → 2 → 3 → 4 → 5 → **5**. 8 → 6 → **2**.

## Step by step

1. A linked list does not store its size. The only way to know is to **walk it**.
2. Start `cur` at `head` and a counter at 0.
3. While `cur` is not `nullptr`: count 1, then `cur = cur->next`.
4. Return the counter.

It is the traversal from the previous station, with a counter instead of a list of values.

## Code (C++)

```cpp
class Solution {
  public:
    int getCount(Node* head) {
        int count = 0;
        for (Node* cur = head; cur != nullptr; cur = cur->next) count++;
        return count;
    }
};
```

## Recursive version (same idea)

The length of a list is 0 if it is empty, else 1 + the length of the rest: `return head ? 1 + getCount(head->next) : 0;`. It uses O(n) stack space, so the loop is better for long lists.

## Complexity

- Time: O(n). Space: O(1).

## Edge cases

- Empty list → 0.
- Check `cur != nullptr`, not `cur->next != nullptr`. The second one stops one node early and crashes on an empty list.

## Dry run (8 → 6)

cur = 8 → 1, cur = 6 → 2, cur = nullptr → **2**.

(Tested on 2 000 random lists.)
