# Reverse a Stack

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `void reverseStack(stack<int>& st)`. GfG does not forbid extra space, but takeUforward does: **use recursion only**, no loops or extra containers. Practise that version.

## The problem

Reverse a stack in place, using only push, pop, top and empty, plus recursion.

Example: top → [4, 1, 3, 2] becomes top → [2, 3, 1, 4].

## Step by step

Two recursive functions, each one simple.

**1. `insertAtBottom(st, x)`: put x under everything.**

- If the stack is empty, push x. Done.
- Otherwise pop the top (hold it in a local variable), insert x at the bottom of the **smaller** stack, then push the held top back.
- The local variables in the call stack do the job of the "extra storage".

**2. `reverse(st)`:**

- If the stack is empty, stop.
- Pop the top t. Reverse the rest (trust the recursion). Then `insertAtBottom(st, t)`.
- Why it works: after the recursive call, the rest is reversed. The old top must end at the **bottom** of the reversed stack, and that is exactly what insertAtBottom does.

## Code (C++)

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

## Complexity

- Time: **O(n²)**. reverseStack makes n calls, and each insertAtBottom moves through the whole stack, up to n pops and pushes.
- Space: O(n) for the recursion depth.

O(n²) is the cost of the "no extra container" rule. With an extra stack or array it is O(n).

## Edge cases

- Empty stack or one element: nothing changes.
- Pass the stack **by reference** (`stack<int>&`). By value, the caller's stack never changes.

## Dry run (top → [1, 2, 3])

- reverse pops 1, reverses [2, 3] → it pops 2, reverses [3] → pops 3, reverses [] → insert 3 at bottom → [3].
- insert 2 at the bottom of [3] → top → [3, 2].
- insert 1 at the bottom → top → **[3, 2, 1]**.

(Tested on 2 000 random stacks against std::reverse.)
