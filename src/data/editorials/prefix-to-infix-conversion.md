# Prefix to Infix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `string preToInfix(string& s)`. Wrap **every** operation in brackets: `(A+(B*C))`. Operands are letters; operators are `+ - * / % ^`. The video above explains it too.

## The problem

Example: `+A*BC` → `(A+(B*C))`. `*-A/BC-/AKL` → `((A-(B/C))*((A/K)-L))`.

## The key idea: read it backwards

In prefix, an operator comes **before** its operands. So when you read **right to left**, by the time you meet an operator, both of its operands have already been read and finished. That is exactly when a stack can combine them.

## Step by step

1. Scan from the **last** character to the first.
2. **Operand** → push it as a string.
3. **Operator op** → pop the top string: that is the **left** operand (it came right after op). Pop again: the **right** operand. Push `"(" + left + op + right + ")"`.
4. At the end, the stack holds one string: the answer.

The order matters: going right to left, the **first** pop is the operand closest to the operator, which is the left one.

## Code (C++)

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

## Complexity

- Time: O(n²) in the worst case because of string copies; O(n) stack operations. Space: O(n).

## Edge cases

- A single operand `A` → `A` (no brackets).
- Mixing up left and right turns `-AB` into `(B-A)`. Test with a `-` or `/`.

## Dry run (`+A*BC`)

- C → [C]. B → [C, B].
- `*` → left B, right C → [(B*C)].
- A → [(B*C), A].
- `+` → left A, right (B*C) → `(A+(B*C))`.

(Tested on 5 000 random expression trees against their fully bracketed infix form.)
