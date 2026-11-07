# Postfix to Prefix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `string postToPre(string s)`. The video above explains it too.

## The problem

Example: `ab+c*` → `*+abc`. `ABC/-AK/L-*` → `*-A/BC-/AKL`.

## Step by step

1. Scan **left to right**.
2. **Operand** → push it as a string.
3. **Operator op** → pop `right` first, then `left`, push `op + left + right`.
4. The last string is the answer.

It is "Postfix to Infix" with prefix glue (operator in front, no brackets).

## Code (C++)

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

## Complexity

- Time: O(n²) worst case from string copies. Space: O(n).

## Edge cases

- One operand → itself.
- `ab-` → `-ab`, not `-ba`: pop right first.

## Dry run (`ab+c*`)

a, b → [a, b]. `+` → [+ab]. c → [+ab, c]. `*` → right c, left +ab → `*+abc`.

(Tested on 5 000 random expression trees.)
