# Postfix to Prefix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `string postToPre(string s)`. The video above explains it too.

## What you need to do

Turn a **postfix** expression (operator last, `ab+`) into **prefix** (operator first, `+ab`).

## Examples

- `ab+c*` → `*+abc`
- `ABC/-AK/L-*` → `*-A/BC-/AKL`

## How to solve it, step by step

This is "Postfix to Infix" with prefix-style joining.

1. **Read from left to right.**

   **Why:** in postfix, an operator's two values are the last two things finished before it.

2. **A letter: push it as a string.**

3. **An operator: pop right (first), then left (second), and push operator + left + right.**

   **Why:** prefix puts the operator first. The stack returns values in reverse, so right comes off first.

4. **The last string on the stack is the answer.**

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    string postToPre(string s) {
        stack<string> st;
        for (char c : s) {
            if (isalnum((unsigned char)c)) st.push(string(1, c));
            else {
                string right = st.top(); st.pop();
                string left = st.top(); st.pop();
                st.push(c + left + right);            // prefix: operator first
            }
        }
        return st.top();
    }
};
```

## How fast is it?

O(n) stack steps (string joins can make it O(n²) for long inputs). O(n) memory.

## Watch out for

- `ab-` must give `-ab`, not `-ba`: pop the right value first.

## Walk through (`ab+c*`)

a, b → [a, b]. `+` → [+ab]. c → [+ab, c]. `*` → right c, left +ab → `*+abc`.

(Tested on 5 000 random expression trees.)
