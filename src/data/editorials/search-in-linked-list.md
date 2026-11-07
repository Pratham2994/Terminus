# Search in Linked List

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `bool searchKey(Node* head, int key)`. The video above explains it too.

## The problem

Return true if some node of the list holds `key`.

Examples: 1 → 2 → 3 → 4, key = 3 → **true**. 7 → 8 → 9, key = 4 → **false**.

## Step by step

1. Walk the list from `head` with a pointer `cur`.
2. At each node, compare `cur->data` with `key`. Equal → return true **at once**; there is no need to look further.
3. If you fall off the end (`cur == nullptr`), the key is not there → false.

Binary search does not help, even on a sorted list: you cannot jump to the middle of a linked list, so finding the middle already costs O(n).

## Code (C++)

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

## Complexity

- Time: O(n) in the worst case (key absent or at the end). Space: O(1).

## Edge cases

- Empty list → false.
- Key at the head → true after one comparison.

## Dry run (1 → 2 → 3 → 4, key = 3)

1 ≠ 3, 2 ≠ 3, 3 = 3 → **true**.

(Tested on 2 000 random lists and keys.)
