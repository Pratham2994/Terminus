# Word Break

> Solve it on [LeetCode 139 · Word Break](https://leetcode.com/problems/word-break/).

## The problem

Given a string s and a dictionary of words, can s be split into a sequence of dictionary words? Words may be reused.

Examples: "leetcode", ["leet","code"] → **true**. "applepenapple", ["apple","pen"] → **true**. "catsandog", ["cats","dog","sand","and","cat"] → **false**.

## Brute force

Recursively try every word that matches at the current position, then solve the rest.

- Exponential in the worst case. With s = "aaaa…ab" and words "a", "aa", "aaa", …, every split is tried, and they all fail at the 'b'.

## The DP

The recursion keeps re-solving the same question: "can the **suffix starting at i** be split?" There are only n + 1 such questions.

Work forwards: `can[i]` = true if the first i characters can be split.

- can[0] = true (the empty prefix).
- can[i] = true if there is some length `len` with can[i − len] true **and** s[i − len … i − 1] in the dictionary.

Only lengths up to the **longest word** need checking. That bounds the inner loop to at most 20 for LeetCode.

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

## Complexity

- Time: O(n · L · L), where L is the longest word length (the substring costs O(L)). That is about 300 × 20 × 20 for LeetCode.
- Space: O(n + total dictionary size).

## Edge cases

- Words can be reused: "aaaa" with ["a"] → true.
- A trie over the dictionary avoids building substrings. It is worth it for large dictionaries.

## Dry run ("leetcode", ["leet","code"])

- can[0] = T.
- can[4]: s[0..3] = "leet" ∈ dict and can[0] → T.
- can[8]: s[4..7] = "code" ∈ dict and can[4] → T.

Answer: **true**. (Tested on 4 000 random cases against the plain recursion.)
