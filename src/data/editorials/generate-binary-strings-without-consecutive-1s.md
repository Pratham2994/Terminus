# Generate Binary Strings Without Consecutive 1s

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<string> generateBinaryStrings(int n)`.

## The problem

Return every binary string of length n (n ≤ 20) with no "11" in it, in **lexicographically increasing** order.

Example: n = 3 → **["000", "001", "010", "100", "101"]**.

## Brute force

Loop over all 2ⁿ numbers, turn each into an n-bit string, and keep the ones without "11".

- Time: O(2ⁿ · n), about 2 × 10⁷ for n = 20. It works, but it wastes time on strings we throw away.

## The better idea: build only valid strings

Build the string left to right:

- You can **always** add '0'.
- You can add '1' only if the string is empty, or the last character is '0'.

Try '0' **before** '1' at every position. Then the strings come out in lexicographic order on their own, and no sort is needed.

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

## Complexity

- The number of valid strings is the Fibonacci number F(n + 2), about 1.6ⁿ. For n = 20 that is 17 711 strings.
- Time: O(F(n+2) · n). Space: O(n) recursion depth, plus the output.

## Edge cases

- n = 1 → ["0", "1"].
- The order "0 first, then 1" is what makes the output sorted. Swap the two blocks and the order breaks.

## Dry run (n = 2)

- "0" → "00" ✓, "01" ✓.
- "1" → "10" ✓. "11" is blocked, because the last character is '1'.

Answer: **["00", "01", "10"]**. (Tested for n = 1…16 against the brute force, including the order.)
