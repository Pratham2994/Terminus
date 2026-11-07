# Postfix to Infix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `string postToInfix(string& s)`. Put brackets around every operation: `((a*b)+c)`. The video above explains it too.

## What you need to do

Turn a **postfix** expression (operator last, `ab+`) into normal maths with full brackets, `(a+b)`.

## Examples

- `ab*c+` → `((a*b)+c)`
- `abc/-` → `(a-(b/c))`

## How to solve it, step by step

1. **Read from left to right.**

   **Why:** in postfix, the two values of an operator are always the last two things finished before it.

2. **A letter: push it as a string.**

3. **An operator: pop right (first), then left (second). Push** `(` + left + operator + right + `)`.

   **Why:** a stack gives things back in reverse order, so the last value pushed (the right one) comes off first.

4. **The last string on the stack is the answer.**

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    string postToInfix(string& s) {
        stack<string> st;
        for (char c : s) {
            if (isalnum((unsigned char)c)) st.push(string(1, c));
            else {
                string right = st.top(); st.pop();    // last pushed = right operand
                string left = st.top(); st.pop();
                st.push("(" + left + c + right + ")");
            }
        }
        return st.top();
    }
};
```

## How fast is it?

O(n) stack steps (string joins can make it O(n²) for long inputs). O(n) memory.

## Watch out for

- The pop order is the classic bug: popping left first turns `ab-` into `(b-a)`.
- A single letter stays as it is.

## Walk through (`abc/-`)

a, b, c → [a, b, c]. `/` → right c, left b → [a, (b/c)]. `-` → right (b/c), left a → `(a-(b/c))`.

(Tested on 5 000 random expression trees.)
