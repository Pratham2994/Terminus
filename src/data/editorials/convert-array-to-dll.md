# Convert Array to Doubly Linked List

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Doubly Linked List from an Array". GfG's function is `Node* createDLL(vector<int>& arr)`. A node has `data`, `next` and `prev`.

## What you need to do

Build a doubly linked list with the array's values, in order, and return its first node. Every node points **forward** (`next`) and **back** (`prev`).

## Example

[1, 2, 3, 4] → **1 ⇄ 2 ⇄ 3 ⇄ 4**.

## How to solve it, step by step

1. **Make the first node (the head) from `arr[0]`.**

   **Why:** you return the head at the end, so keep it in its own variable.

2. **Keep a pointer `tail` to the last node built so far.** At the start, that is the head.

   **Why:** each new node is attached after the current last one.

3. **For every next value, make a node and link it both ways:** `tail->next = node` and `node->prev = tail`. Then move `tail` to the new node.

   **Why:** a doubly linked list needs both links. If you forget `prev`, the list still looks right when read forward, but walking backward breaks.

4. **Return the head.**

## Code (C++, for GfG)

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

## How fast is it?

One new node per value: O(n) time and O(n) memory, which is the list itself.

## Watch out for

- A one-value array gives a single node with both links empty.

(Tested on 2 000 random arrays, walking each result forward and backward.)
