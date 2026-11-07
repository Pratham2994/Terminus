# Traversal in Linked List

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Linked List Traversal". GfG's function is `vector<int> printList(Node* head)`, and it returns the values (it does not print them).

## The problem

Given the head of a singly linked list, return its values in order.

Example: 5 → 4 → 3 → 1 → 0 → **[5, 4, 3, 1, 0]**.

## What a linked list is

Each **node** holds a value (`data`) and a pointer to the next node (`next`). The last node's `next` is `nullptr`. You only get `head`, the first node. Unlike an array, there is no `list[i]`: to reach the 5th node you must walk past the first four.

## Step by step

1. Start a pointer `cur` at `head`.
2. While `cur` is not `nullptr`: record `cur->data`, then step: `cur = cur->next`.
3. When `cur` becomes `nullptr`, you have passed the last node.

Use a **separate** pointer `cur`. Moving `head` itself works here, but in later problems you will need the head again, so keep the habit.

## Code (C++)

```cpp
class Solution {
  public:
    vector<int> printList(Node* head) {
        vector<int> values;
        for (Node* cur = head; cur != nullptr; cur = cur->next)
            values.push_back(cur->data);
        return values;
    }
};
```

## Complexity

- Time: O(n). Space: O(1) besides the output.

## Edge cases

- Empty list (`head == nullptr`): the loop does not run → [].
- One node: one step, then `cur` is `nullptr`.

## Dry run (1 → 2 → 3)

cur = 1 → [1], cur = 2 → [1, 2], cur = 3 → [1, 2, 3], cur = nullptr → stop.

(Tested on 2 000 random lists.)
