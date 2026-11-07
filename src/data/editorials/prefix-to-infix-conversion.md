# Prefix to Infix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `string preToInfix(string& s)`. Put brackets around **every** operation: `(A+(B*C))`. The video above explains it too.

## What you need to do

Turn a **prefix** expression (operator first, like `+AB`) into normal maths with full brackets, like `(A+B)`.

## Examples

- `+A*BC` → `(A+(B*C))`
- `*-A/BC-/AKL` → `((A-(B/C))*((A/K)-L))`

## How to solve it, step by step

1. **Read the string from right to left.**

   **Why:** in prefix, an operator comes before its values. Reading backwards, you always meet the values first, so they are ready when their operator arrives.

2. **A letter: push it on a stack** as a string.

3. **An operator: pop two strings.** The first one popped is the **left** value, the second is the **right** value. Push `(` + left + operator + right + `)`.

   **Why:** reading backwards, the value right after the operator was pushed last, so it comes off first, and it is the left value.

4. **At the end, the stack holds one string: the answer.**

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    string preToInfix(string& s) {
        stack<string> st;
        for (int i = (int)s.size() - 1; i >= 0; i--) {
            char c = s[i];
            if (isalnum((unsigned char)c)) st.push(string(1, c));
            else {
                string left = st.top(); st.pop();     // first pop = left operand
                string right = st.top(); st.pop();
                st.push("(" + left + c + right + ")");
            }
        }
        return st.top();
    }
};
```

## How fast is it?

O(n) stack steps; joining strings makes it up to O(n²) for long inputs. O(n) memory.

## Watch out for

- Test with `-` or `/`: if left and right are swapped, `-AB` comes out as `(B-A)`.
- A single letter `A` stays `A`, with no brackets.

## Walk through (`+A*BC`)

- C → [C]. B → [C, B].
- `*` → left B, right C → [(B*C)].
- A → [(B*C), A].
- `+` → left A, right (B*C) → `(A+(B*C))`.

(Tested on 5 000 random expression trees.)
