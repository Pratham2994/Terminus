# Infix to Prefix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Infix To Prefix". GfG's function is `string infixToPrefix(string& s)`. Operators: `^` (highest, right to left), then `*` `/`, then `+` `-` (left to right). The video above explains it too.

## The problem

**Prefix** puts each operator **before** its two operands: `a+b` → `+ab`.

Examples: `a*(b+c)/d` → `/*a+bcd`. `(a-b/c)*(a/k-l)` → `*-a/bc-/akl`.

## Two ways

**Way 1, the textbook trick:** reverse the string, swap `(` and `)`, convert to postfix, reverse the result. It works, but the associativity rule must flip too, which is easy to get wrong.

**Way 2, two stacks (used below):** the same idea as infix to postfix, but keep a second stack of **operand strings**. Whenever an operator is applied, pop its two operands and push the combined prefix string `op + left + right`. No reversing, and the precedence rules are exactly the normal ones.

## Step by step (Way 2)

1. **Operand** → push it (as a one-letter string) on the operand stack.
2. **`(`** → push on the operator stack.
3. **`)`** → apply operators until the `(`, then drop the `(`.
4. **Operator op** → first apply every stacked operator that binds at least as tight (higher precedence, or equal and op is not `^`), then push op.
5. At the end, apply everything left. The single remaining string is the answer.

"Apply" = pop the operator, pop **right** then **left** operand (the stack gives them back in reverse), push `op + left + right`.

## Code (C++)

```cpp
class Solution {
    int prec(char c) {
        if (c == '^') return 3;
        if (c == '*' || c == '/') return 2;
        if (c == '+' || c == '-') return 1;
        return 0;
    }
    void apply(stack<char>& ops, stack<string>& vals) {
        char op = ops.top(); ops.pop();
        string right = vals.top(); vals.pop();
        string left = vals.top(); vals.pop();
        vals.push(op + left + right);              // prefix: operator first
    }
  public:
    string infixToPrefix(string& s) {
        stack<char> ops;
        stack<string> vals;
        for (char c : s) {
            if (isalnum((unsigned char)c)) vals.push(string(1, c));
            else if (c == '(') ops.push(c);
            else if (c == ')') {
                while (ops.top() != '(') apply(ops, vals);
                ops.pop();
            } else {
                while (!ops.empty() && ops.top() != '(' &&
                       (prec(ops.top()) > prec(c) ||
                        (prec(ops.top()) == prec(c) && c != '^')))
                    apply(ops, vals);
                ops.push(c);
            }
        }
        while (!ops.empty()) apply(ops, vals);
        return vals.top();
    }
};
```

## Complexity

- Time: O(n²) in the worst case, because of string concatenation (each apply copies strings). Fine for these input sizes. Way 1 is O(n).
- Space: O(n).

## Edge cases

- `a-b-c` → `--abc` (left to right: (a−b)−c). `a^b^c` → `^a^bc` (right to left).
- A single operand `a` → `a`.

## Dry run (`a*(b+c)/d`)

- a → vals [a]. `*` → ops [*]. `(` → ops [*, (]. b, c → vals [a, b, c], `+` waits inside.
- `)` → apply + → vals [a, +bc]; drop `(`.
- `/` → `*` has equal precedence → apply * → vals [*a+bc]; push /.
- d → vals [*a+bc, d]. End → apply / → `/*a+bcd`.

(Tested on 5 000 random expressions against the tree's prefix form.)
