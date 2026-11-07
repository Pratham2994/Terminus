# Convert Array to Doubly Linked List

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Doubly Linked List from an Array". GfG's function is `Node* createDLL(vector<int>& arr)`, where a Node has `data`, `next` and `prev`.

## The problem

Build a doubly linked list holding the array's values in order, and return its head. Every node points **forward** (`next`) and **back** (`prev`).

Example: [1, 2, 3, 4] → **1 ⇄ 2 ⇄ 3 ⇄ 4**.

## Step by step

1. Make the head from `arr[0]`. Its `prev` stays `nullptr`.
2. Keep a pointer `tail` to the last node built so far.
3. For each next value: make a node, and link it **both ways**:
   - `tail->next = node` (forward link),
   - `node->prev = tail` (back link).
   Then move `tail` to the new node.
4. The last node's `next` stays `nullptr`.

Forgetting one of the two links is the classic bug: printing forward still looks fine, but walking backwards from the tail breaks.

## Code (C++)

```cpp
class Solution {
  public:
    Node* createDLL(vector<int>& arr) {
        if (arr.empty()) return nullptr;
        Node* head = new Node(arr[0]);
        Node* tail = head;
        for (size_t i = 1; i < arr.size(); i++) {
            Node* node = new Node(arr[i]);
            tail->next = node;      // forward link
            node->prev = tail;      // back link
            tail = node;
        }
        return head;
    }
};
```

## Complexity

- Time: O(n). Space: O(n) for the n nodes (that is the output).

## Edge cases

- One element: a single node with both pointers `nullptr`.
- Empty array: return `nullptr` (GfG's arrays have at least one element, but the check costs nothing).

## Dry run ([10, 20])

head = 10. Node 20: 10->next = 20, 20->prev = 10, tail = 20. Result **10 ⇄ 20**.

(Tested on 2 000 random arrays, walking the result forward and backward.)
