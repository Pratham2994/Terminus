# Isomorphic Strings

> Solve it on [LeetCode 205 · Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings/).

## The problem

Two strings s and t of the same length are **isomorphic** if you can replace the characters of s to get t, where:

- every occurrence of a character becomes the same character, and
- no two different characters become the same character. A character may map to itself.

Examples: "egg", "add" → **true** (e→a, g→d). "foo", "bar" → **false** (o would need to become both a and r). "badc", "baba" → **false** (b→b and d→b both map to b).

## Brute force

For every pair of positions i, j: s[i] == s[j] must hold exactly when t[i] == t[j].

- Time: O(n²).

## The better idea: two maps

Keep a map in **each direction**:

- `sToT[c]`: the character c in s is mapped to.
- `tToS[c]`: the character in s that c in t came from.

Walk i from left to right with a = s[i] and b = t[i]:

- If neither a nor b has a mapping yet, record a→b and b→a.
- Otherwise both must already point at each other. If either points somewhere else, return false.

One map alone is not enough. "badc" → "baba" passes a check of s→t only (b→b, a→a, d→b, c→a), because nothing stops two letters from mapping to the same b. The reverse map catches that.

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

## Complexity

- Time: O(n).
- Space: O(1), two arrays of 256 entries, one per possible character.

## Edge cases

- s contains any valid ASCII character, not only letters. Arrays of size 256 cover all of them. Index with `unsigned char` so a negative `char` never becomes a negative index.
- A character mapping to itself is allowed ("ab" → "ab" is true).

## Dry run ("paper", "title")

- p→t, a→i, then p again: sToT[p] = t matches t ✓, e→l, r→e.

Every check passes → **true**.
