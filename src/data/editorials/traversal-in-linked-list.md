# Traversal in Linked List

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Linked List Traversal". GfG's function is `vector<int> printList(Node* head)`. It **returns** the values; it does not print them.

## What you need to do

Walk through a linked list from the first node to the last, and return all the values in order.

## Example

5 → 4 → 3 → 1 → 0 gives **[5, 4, 3, 1, 0]**.

## First, what is a linked list?

Each **node** holds a value (`data`) and a pointer to the next node (`next`). The last node's `next` is `nullptr`, meaning "nothing after me". You are only given `head`, the first node. There is no `list[i]`: to reach a node, you walk past all the nodes before it.

## How to solve it, step by step

1. **Start a pointer `cur` at `head`.**

   **Why:** `cur` marks where you are. Using a separate pointer keeps `head` safe for later.

2. **While `cur` is not `nullptr`: save `cur->data`, then step forward with `cur = cur->next`.**

   **Why:** `next` is the only way to reach the following node.

3. **When `cur` becomes `nullptr`, stop.**

   **Why:** you have just walked past the last node.

## Code (C++, for GfG)

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

## How fast is it?

Each node is visited once: O(n) time. No extra memory besides the answer.

## Watch out for

- An empty list (`head` is `nullptr`): the loop never runs and you return [].

(Tested on 2 000 random lists.)
