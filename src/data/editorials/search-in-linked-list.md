# Search in Linked List

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `bool searchKey(Node* head, int key)`. The video above explains it too.

## What you need to do

Return true if any node in the list holds the value `key`.

## Example

- 1 → 2 → 3 → 4, key = 3 → **true**.
- 7 → 8 → 9, key = 4 → **false**.

## How to solve it, step by step

1. **Walk the list from `head`,** one node at a time.

   **Why:** a linked list has no shortcut to the middle, so you have to look at the nodes in order.

2. **At each node, compare its value with `key`. If they match, return true at once.**

   **Why:** once you have found it, there is no need to look further.

3. **If you reach the end (`nullptr`), return false.**

   **Why:** you checked every node and none matched.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    bool searchKey(Node* head, int key) {
        for (Node* cur = head; cur != nullptr; cur = cur->next)
            if (cur->data == key) return true;    // found: stop early
        return false;                             // walked off the end
    }
};
```

## How fast is it?

O(n) in the worst case, when the key is missing or at the end. No extra memory.

## Watch out for

- An empty list returns false.
- Binary search does not help here, even on a sorted list: just finding the middle of a linked list already takes O(n).

(Tested on 2 000 random lists and keys.)
