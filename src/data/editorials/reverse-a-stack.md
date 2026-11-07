# Reverse a Stack

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `void reverseStack(stack<int>& st)`. GfG does not forbid extra space, but takeUforward does: practise it **with recursion only**, no loops and no extra containers.

## What you need to do

Turn a stack upside down, using only push, pop, top, empty and recursion.

## Example

Top → [4, 1, 3, 2] becomes top → [2, 3, 1, 4].

## How to solve it, step by step

You need two small recursive functions.

1. **First, `insertAtBottom(st, x)`: put x under everything else.**
   - If the stack is empty, just push x.
   - Otherwise pop the top and hold it, put x at the bottom of what is left, then push the held top back.

   **Why:** you cannot reach the bottom directly, so you pop your way down. The held values wait in the recursive calls, so no extra container is needed.

2. **Then `reverseStack(st)`:** pop the top t, reverse the rest, then `insertAtBottom(st, t)`.

   **Why:** after the rest is reversed, the old top belongs at the very bottom. That is exactly what insertAtBottom does.

3. **Base case:** an empty stack is already reversed; just return.

   **Why:** every recursion needs a stopping point.

## Code (C++, for GfG)

```cpp
class Solution {
    void insertAtBottom(stack<int>& st, int x) {
        if (st.empty()) { st.push(x); return; }
        int top = st.top(); st.pop();         // hold the top on the call stack
        insertAtBottom(st, x);                // x goes under the rest
        st.push(top);                         // put the top back
    }
  public:
    void reverseStack(stack<int>& st) {
        if (st.empty()) return;
        int top = st.top(); st.pop();
        reverseStack(st);                     // the rest is now reversed
        insertAtBottom(st, top);              // old top goes to the bottom
    }
};
```

## How fast is it?

O(n²) time: reverseStack runs n times, and each insertAtBottom may go through the whole stack. O(n) memory for the recursive calls. With an extra array it would be O(n), but the rule here is "no extra containers".

## Watch out for

- Pass the stack **by reference** (`stack<int>&`). Without the `&`, the caller's stack never changes.
- An empty stack, or one with a single value, stays the same.

## Walk through (top → [1, 2, 3])

- Pop 1, reverse [2, 3]: pop 2, reverse [3]: pop 3, reverse [], insert 3 at the bottom → [3].
- Insert 2 at the bottom of [3] → top → [3, 2].
- Insert 1 at the bottom → top → **[3, 2, 1]**.

(Tested on 2 000 random stacks.)
