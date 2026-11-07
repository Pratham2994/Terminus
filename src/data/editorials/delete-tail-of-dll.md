# Delete Tail of Doubly Linked List

> Solve it on takeUforward's free practice page (the Problem link above). The function is `ListNode *deleteTail(ListNode *&head)`. Nodes have `data`, `prev` and `next`.

## The problem

Remove the last node of a doubly linked list (1 to 100 nodes) and return the head.

Examples: [1, 2, 3] → **[1, 2]**. [7] → **[]**.

## The idea

In a **doubly** linked list, every node knows the node before it. So walk to the tail itself, then use `tail->prev` to reach the new last node and cut the link: `tail->prev->next = nullptr`.

Compare that with a singly linked list, where you have to stop one node early. Here you can stand on the tail and still step back.

One node: there is no previous node, so the list becomes empty.

## Code (C++)

```cpp
class Solution {
public:
    ListNode *deleteTail(ListNode *&head) {
        if (head == nullptr || head->next == nullptr) {   // 0 or 1 node
            delete head;
            head = nullptr;
            return head;
        }
        ListNode* tail = head;
        while (tail->next != nullptr) tail = tail->next;
        tail->prev->next = nullptr;
        delete tail;
        return head;
    }
};
```

## Complexity

- Time: O(n) to reach the tail.
- Space: O(1).

## Edge cases

- One node → nullptr.
- Only **one** link changes here. The new tail's `prev` stays correct, and the removed node's pointers no longer matter.

## Dry run ([1, 2, 3])

- Walk to 3. 3->prev = 2. Set 2->next = null and delete 3.

Answer: **[1, 2]**.
