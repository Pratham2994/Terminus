# Infix to Prefix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Infix To Prefix". GfG's function is `string infixToPrefix(string& s)`. The video above explains it too.

## What you need to do

Convert normal maths (infix, `a+b`) to **prefix**, where each operator comes **before** its two values: `+ab`.

Operator strength: `^` is strongest (right to left), then `*` and `/`, then `+` and `-` (left to right).

## Examples

- `a*(b+c)/d` → `/*a+bcd`
- `(a-b/c)*(a/k-l)` → `*-a/bc-/akl`

## How to solve it, step by step

This uses **two stacks**: one for operators, one for finished pieces (strings).

1. **A letter becomes a finished piece:** push it as a one-letter string.

   **Why:** a single letter is already a complete prefix expression.

2. **Operators wait on the operator stack,** exactly as in Infix to Postfix: before pushing a new operator, first apply every waiting operator that must run before it (stronger, or equally strong when the new one is not `^`).

   **Why:** the operators that run first must be combined first.

3. **To apply an operator:** pop two pieces (the right one comes off first, then the left), and push `operator + left + right`.

   **Why:** that is exactly what prefix means: the operator, then its two values.

4. **`(` is pushed; on `)`, apply operators until the `(`, then drop it.**

   **Why:** brackets finish their inside first.

5. **At the end, apply everything left. The one remaining piece is the answer.**

The textbook alternative is: reverse the string, swap the brackets, convert to postfix, reverse again. It works, but the "equally strong" rule flips too, which is easy to get wrong. The two-stack way avoids that.

## Code (C++, for GfG)

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

## How fast is it?

O(n) operations; joining strings can make it O(n²) in the worst case, which is fine for these sizes. O(n) memory.

## Watch out for

- `a-b-c` → `--abc` (left to right: (a − b) − c). `a^b^c` → `^a^bc` (right to left).

## Walk through (`a*(b+c)/d`)

- `a` → pieces [a]. `*` → operators [*]. `(` → operators [*, (]. `b`, `c` → pieces [a, b, c]; `+` waits inside the bracket.
- `)` → apply + → pieces [a, +bc]; drop `(`.
- `/` → `*` is equally strong → apply * → pieces [*a+bc]; push /.
- `d` → pieces [*a+bc, d]. End → apply / → `/*a+bcd`.

(Tested on 5 000 random expressions against the correct answer built from an expression tree.)
