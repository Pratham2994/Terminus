# Isomorphic Strings

> Solve it on [LeetCode 205 · Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings/).

## What you need to do

Can you turn s into t by renaming its characters? The rules: every copy of a character gets the **same** new name, and two **different** characters never get the same new name. A character may keep its own name.

## Examples

- "egg", "add" → **true** (e → a, g → d)
- "foo", "bar" → **false** (o would have to become both a and r)
- "badc", "baba" → **false** (b → b and d → b: two characters with the same new name)

## How to solve it, step by step

1. **Walk both strings together,** looking at a = s[i] and b = t[i].

2. **Remember each renaming in a map from s to t:** `sToT[a] = b`.

   **Why:** a character must always become the same thing, so you check new copies against what you saved.

3. **Also keep a map back from t to s:** `tToS[b] = a`.

   **Why:** the map from s to t alone cannot see two different characters getting the same name. In "badc" → "baba", b → b and d → b both look fine one at a time. The back map catches that b is already taken.

4. **If neither a nor b is in a map yet, save both directions. Otherwise both must already point at each other; if not, return false.**

5. **If you reach the end, return true.**

## Code (C++)

```cpp
class Solution {
public:
    bool isIsomorphic(string s, string t) {
        int sToT[256], tToS[256];
        fill(begin(sToT), end(sToT), -1);
        fill(begin(tToS), end(tToS), -1);
        for (int i = 0; i < (int)s.size(); i++) {
            unsigned char a = s[i], b = t[i];
            if (sToT[a] == -1 && tToS[b] == -1) { sToT[a] = b; tToS[b] = a; }
            else if (sToT[a] != b || tToS[b] != a) return false;
        }
        return true;
    }
};
```

## How fast is it?

One pass: O(n) time. The two maps are arrays of 256 entries, so O(1) memory.

## Watch out for

- The strings can hold any ASCII character, not only letters. Arrays of 256 cover them all. Index with `unsigned char`, so a negative `char` never becomes a negative index.
- Keeping the same name is fine: "ab" → "ab" is true.

## Walk through ("paper", "title")

p → t, a → i, then p again: it already maps to t, and the letter is t ✓. e → l, r → e. Everything matches → **true**.
