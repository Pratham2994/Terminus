# Generate Binary Strings Without Consecutive 1s

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<string> generateBinaryStrings(int n)`.

## What you need to do

List every string of 0s and 1s of length n that has **no "11"** in it, in sorted order.

## Example

n = 3 → **["000", "001", "010", "100", "101"]**.

## How to solve it, step by step

1. **The slow idea:** write out all 2ⁿ strings and throw away the ones with "11".

   **Why it is wasteful:** most of the work goes into strings you then throw away.

2. **Build the string one character at a time, and only add characters that keep it valid.**

   **Why:** then every string you finish is a good one; nothing is wasted.

3. **You can always add '0'.**

4. **You can add '1' only if the string is empty or ends in '0'.**

   **Why:** that is exactly the rule "no two 1s next to each other".

5. **Try '0' before '1' at every position.**

   **Why:** then the strings come out in sorted order on their own, and no sort is needed.

6. **When the string reaches length n, save it.**

## Code (C++)

```cpp
class Solution {
    void build(int n, string& cur, vector<string>& out) {
        if ((int)cur.size() == n) { out.push_back(cur); return; }
        cur.push_back('0');
        build(n, cur, out);
        cur.pop_back();
        if (cur.empty() || cur.back() == '0') {
            cur.push_back('1');
            build(n, cur, out);
            cur.pop_back();
        }
    }
public:
    vector<string> generateBinaryStrings(int n) {
        vector<string> out;
        string cur;
        build(n, cur, out);
        return out;
    }
};
```

## How fast is it?

The number of valid strings grows like the Fibonacci numbers (about 1.6ⁿ): 17 711 strings for n = 20. Each takes O(n) to save, so O(1.6ⁿ · n) in total. Recursion depth: n.

## Watch out for

- If you try '1' before '0', the order breaks.
- n = 1 → ["0", "1"].

## Walk through (n = 2)

- "0" → "00" ✓, "01" ✓.
- "1" → "10" ✓. "11" is blocked, because the string ends in '1'.

Answer: **["00", "01", "10"]**. (Tested for n = 1…16 against the slow idea, including the order.)
