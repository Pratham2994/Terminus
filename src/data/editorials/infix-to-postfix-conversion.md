# Infix to Postfix Conversion

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above), "Infix to Postfix". GfG's function is `string infixToPostfix(string& s)`. The video above explains it too.

## What you need to do

**Infix** is how we normally write maths: the operator sits between its two values, as in `a+b*c`. **Postfix** puts the operator after its two values: `abc*+`. Convert infix to postfix.

Operator strength: `^` is strongest (and works right to left), then `*` and `/`, then `+` and `-` (these work left to right).

## Examples

- `a+b*c+d` → `abc*+d+`
- `a*(b+c)/d` → `abc+*d/`
- `(a+b)*(c+d)` → `ab+cd+*`

## How to solve it, step by step

1. **Letters (operands) go straight to the output.**

   **Why:** in postfix the letters keep their order; only the operators move.

2. **Operators wait on a stack.**

   **Why:** you cannot write an operator yet, because a stronger operator might come next and must run first.

3. **When a new operator arrives, first pop and write every waiting operator that must run before it.** That means one that is stronger, or equally strong when the new one is left-to-right (`+ - * /`). Then push the new operator.

   **Why:** the operators that run first must appear first in postfix. For `^` (right to left), an equal `^` does not pop, because `a^b^c` means `a^(b^c)`.

4. **`(` is pushed. On `)`, pop and write operators until the `(`, then throw the `(` away.**

   **Why:** brackets make their inside finish first, whatever the operators outside are.

5. **At the end, pop and write everything left on the stack.**

## Code (C++, for GfG)

```cpp
class Solution {
    int prec(char c) {
        if (c == '^') return 3;
        if (c == '*' || c == '/') return 2;
        if (c == '+' || c == '-') return 1;
        return 0;                                  // '(' : never popped by an operator
    }
  public:
    string infixToPostfix(string& s) {
        string out;
        stack<char> ops;
        for (char c : s) {
            if (isalnum((unsigned char)c)) out += c;           // operand
            else if (c == '(') ops.push(c);
            else if (c == ')') {
                while (ops.top() != '(') { out += ops.top(); ops.pop(); }
                ops.pop();                                     // drop '('
            } else {                                           // operator
                while (!ops.empty() && ops.top() != '(' &&
                       (prec(ops.top()) > prec(c) ||
                        (prec(ops.top()) == prec(c) && c != '^'))) {
                    out += ops.top(); ops.pop();
                }
                ops.push(c);
            }
        }
        while (!ops.empty()) { out += ops.top(); ops.pop(); }
        return out;
    }
};
```

## How fast is it?

Each character is pushed and popped at most once: O(n) time, O(n) memory.

## Watch out for

- `a-b-c` must give `ab-c-` (left to right), but `a^b^c` gives `abc^^` (right to left). The "equally strong" rule in step 3 decides this.

## Walk through (`a+b*c+d`)

| read | output | stack |
|---|---|---|
| a | a | |
| + | a | + |
| b | ab | + |
| * | ab | + * (stronger, so + stays) |
| c | abc | + * |
| + | abc*+ | + (pops * and +, then pushes +) |
| d | abc*+d | + |
| end | `abc*+d+` | |

(Tested on 5 000 random expressions against the correct answer built from an expression tree.)
