# Prefix to Postfix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `string preToPost(string& s)`. The video above explains it too.

## The problem

Example: `*+ABC` → `AB+C*`. `*-A/BC-/AKL` → `ABC/-AK/L-*`.

## Step by step

This is "Prefix to Infix" with a different way of **gluing** the two operands.

1. Scan **right to left** (so an operator's operands are already finished when you meet it).
2. **Operand** → push it as a string.
3. **Operator op** → pop `left`, then pop `right`, push `left + right + op`.
4. The last string on the stack is the answer.

No brackets are needed: postfix never needs them.

## Code (C++)

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

## Complexity

- Time: O(n²) worst case from string copies. Space: O(n).

## The family of six conversions

| From → To | Scan | On an operator push |
|---|---|---|
| prefix → infix | right to left | ( left op right ) |
| prefix → postfix | right to left | left right op |
| postfix → infix | left to right | ( left op right ) |
| postfix → prefix | left to right | op left right |
| infix → postfix / prefix | left to right | operator stack with precedence |

For **prefix** you scan right to left and the **first** pop is the left operand. For **postfix** you scan left to right and the first pop is the **right** operand.

## Dry run (`*+ABC`)

C → [C]. B → [C, B]. A → [C, B, A]. `+` → left A, right B → [C, AB+]. `*` → left AB+, right C → `AB+C*`.

(Tested on 5 000 random expression trees.)
