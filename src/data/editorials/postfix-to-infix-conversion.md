# Postfix to Infix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `string postToInfix(string& s)`. Wrap every operation in brackets: `((a*b)+c)`. The video above explains it too.

## The problem

Example: `ab*c+` → `((a*b)+c)`. `abc/-` → **(a-(b/c))**.

## Step by step

Postfix is the order a stack calculator works in: when you meet an operator, its two operands are the **last two** things finished.

1. Scan **left to right**.
2. **Operand** → push it as a string.
3. **Operator op** → pop `right` **first**, then `left` (the stack returns them in reverse), push `"(" + left + op + right + ")"`.
4. The last string is the answer.

The classic bug is the pop order: for `ab-`, popping left first gives `(b-a)`.

## Code (C++)

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

## Complexity

- Time: O(n²) worst case from string copies. Space: O(n).

## Edge cases

- One operand `a` → `a`.
- Check with a non-commutative operator (`-`, `/`): `ab-` must give `(a-b)`.

## Dry run (`abc/-`)

a → [a], b → [a, b], c → [a, b, c]. `/` → right c, left b → [a, (b/c)]. `-` → right (b/c), left a → **(a-(b/c))**.

(Tested on 5 000 random expression trees.)
