# Prefix to Postfix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `string preToPost(string& s)`. The video above explains it too.

## What you need to do

Turn a **prefix** expression (operator first, `+AB`) into **postfix** (operator last, `AB+`).

## Examples

- `*+ABC` → `AB+C*`
- `*-A/BC-/AKL` → `ABC/-AK/L-*`

## How to solve it, step by step

This is "Prefix to Infix" with a different way of joining the pieces.

1. **Read from right to left.**

   **Why:** in prefix, an operator's values come after it, so reading backwards gives you the values first.

2. **A letter: push it as a string.**

3. **An operator: pop left (first), then right (second), and push left + right + operator.**

   **Why:** postfix puts the operator after its two values. No brackets are needed.

4. **The last string on the stack is the answer.**

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    string preToPost(string& s) {
        stack<string> st;
        for (int i = (int)s.size() - 1; i >= 0; i--) {
            char c = s[i];
            if (isalnum((unsigned char)c)) st.push(string(1, c));
            else {
                string left = st.top(); st.pop();
                string right = st.top(); st.pop();
                st.push(left + right + c);            // postfix: operator last
            }
        }
        return st.top();
    }
};
```

## How fast is it?

O(n) stack steps (string joins can make it O(n²) for long inputs). O(n) memory.

## The six conversions in one table

| From → To | Read | When you meet an operator, push |
|---|---|---|
| prefix → infix | right to left | ( left op right ) |
| prefix → postfix | right to left | left right op |
| postfix → infix | left to right | ( left op right ) |
| postfix → prefix | left to right | op left right |
| infix → postfix / prefix | left to right | use an operator stack with strengths |

Reading **prefix** (right to left), the first value you pop is the **left** one. Reading **postfix** (left to right), the first value you pop is the **right** one.

## Walk through (`*+ABC`)

C, B, A are pushed → [C, B, A]. `+` → left A, right B → [C, AB+]. `*` → left AB+, right C → `AB+C*`.

(Tested on 5 000 random expression trees.)
