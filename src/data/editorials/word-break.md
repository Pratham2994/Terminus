# Word Break

> Solve it on [LeetCode 139 · Word Break](https://leetcode.com/problems/word-break/).

## What you need to do

Can the string s be cut into pieces that are all words from the dictionary? Words may be used more than once.

## Examples

- "leetcode", ["leet", "code"] → **true**
- "applepenapple", ["apple", "pen"] → **true**
- "catsandog", ["cats", "dog", "sand", "and", "cat"] → **false**

## How to solve it, step by step

1. **The slow idea:** at each position, try every word that fits, then solve the rest. It can take exponential time, because the same rest is solved again and again.

2. **Notice there are only n + 1 different questions:** "can the first i characters be cut into words?"

   **Why:** that is what makes a table (dynamic programming) possible: answer each question once and reuse it.

3. **Let `can[i]` mean "the first i characters can be cut into words". Set `can[0] = true`.**

   **Why:** the empty start can always be "cut", and every real answer builds on it.

4. **`can[i]` is true if some word fits at the end:** there is a length `len` where `can[i − len]` is true **and** the last `len` characters are a word.

   **Why:** a good cut of the first i characters ends with some word, and before that word the cut must also be good.

5. **Only try lengths up to the longest word.**

   **Why:** no word is longer, so longer pieces can never match. This keeps the inner loop short.

6. **The answer is `can[n]`.**

## Code (C++)

```cpp
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        int maxLen = 0;
        for (auto& w : wordDict) maxLen = max(maxLen, (int)w.size());
        int n = s.size();
        vector<bool> can(n + 1, false);      // can[i]: s[0..i-1] splits into words
        can[0] = true;
        for (int i = 1; i <= n; i++)
            for (int len = 1; len <= maxLen && len <= i; len++)
                if (can[i - len] && dict.count(s.substr(i - len, len))) {
                    can[i] = true;
                    break;
                }
        return can[n];
    }
};
```

## How fast is it?

For each of the n positions, up to L lengths, and each piece costs up to L to check: O(n · L²), where L is the longest word. Memory: O(n) plus the dictionary.

## Watch out for

- Words can be reused: "aaaa" with ["a"] → true.

## Walk through ("leetcode", ["leet", "code"])

- can[0] = true.
- can[4]: "leet" is a word and can[0] is true → true.
- can[8]: "code" is a word and can[4] is true → true.

Answer: **true**. (Tested on 4 000 random cases against the plain recursion.)
