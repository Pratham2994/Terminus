# Find the length of the Linked List

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Length of Linked List". GfG's function is `int getCount(Node* head)`. The video above explains it too.

## What you need to do

Count the nodes in a linked list.

## Example

1 → 2 → 3 → 4 → 5 has **5** nodes. 8 → 6 has **2**.

## How to solve it, step by step

1. **Start a counter at 0 and a pointer `cur` at `head`.**

   **Why:** a linked list does not store its own size, so the only way to know is to walk it and count.

2. **While `cur` is not `nullptr`: add 1, then move with `cur = cur->next`.**

   **Why:** each loop visits one node, so the counter ends equal to the number of nodes.

3. **Return the counter.**

It is the same walk as "Traversal in Linked List", with a counter instead of a list of values.

## Code (C++, for GfG)

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

## How fast is it?

O(n) time, one step per node. No extra memory.

## Watch out for

- Check `cur != nullptr`, not `cur->next != nullptr`. The second stops one node too early, and crashes on an empty list.
- An empty list has length 0.

(Tested on 2 000 random lists.)
