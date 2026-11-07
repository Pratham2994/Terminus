# Sum of Highest and Lowest Frequency

> No free judge has this exact problem, so Terminus is your judge. Solve it with the visible tests, then run the hidden tests with the self-check program at the bottom in a free online compiler. The function here is `int sumHighestAndLowestFrequency(vector<int>& nums)`.

## The problem

Given an array (1 ≤ n ≤ 10⁵, 1 ≤ arr[i] ≤ 10⁴), find the **highest frequency** (how often the most common value appears) and the **lowest frequency** (how often the least common value appears). Return their sum.

Only values that **appear** count. A value that is not in the array has frequency 0, but it is not "occurring", so it never gives the lowest frequency.

## Visible tests

| arr | Highest | Lowest | Answer |
|---|---|---|---|
| [1, 2, 2, 3, 3, 3] | 3 (value 3) | 1 (value 1) | 4 |
| [4, 4, 5, 5, 6] | 2 (4 and 5) | 1 (value 6) | 3 |
| [10, 9, 7, 7, 8, 8, 8] | 3 (value 8) | 1 (10 or 9) | 4 |

## Step by step

1. **Count first.** You need each value's frequency. Use `unordered_map<int,int> freq` and do `freq[x]++` for every x. (Values are ≤ 10⁴, so an array `int freq[10001]` also works and is faster.)
2. **Then scan the counts, not the array.** Walk over the map's entries and keep `hi = max(hi, count)` and `lo = min(lo, count)`.
3. **Start values:** `hi = 0` and `lo = INT_MAX` (or n). Every real count is between 1 and n.
4. **Trap with the array version:** if you scan all 10001 slots, skip the zeros. Otherwise lo becomes 0 every time.
5. **Edge case: only one distinct value**, like [5] or [1, 1, 1]. Then that value is both the most and the least frequent, so the answer is count + count = 2·n. ([5] → 2, [1, 1, 1] → 6.)
6. Return `hi + lo`. Ties do not matter: you only need the frequencies, not which value has them.

## Complexity

- Time: O(n) on average with the hash map.
- Space: O(k), where k is the number of distinct values.

## Dry run ([4, 4, 4, 4, 2, 7, 7])

Counts: 4 → 4, 2 → 1, 7 → 2. hi = 4, lo = 1. Answer: **5**.

## Check your solution

1. Write your solution first, and check it on the visible tests.
2. Open "Self-check program" below and press **Copy**.
3. Open a free online compiler, for example [OnlineGDB](https://www.onlinegdb.com/online_c++_compiler) (no sign-in). Paste the program.
4. Replace the code between `YOUR CODE START` and `YOUR CODE END` with your own class.
5. Run. It prints every failed test, then "x / y tests passed".

:::hidden Self-check program with the hidden tests (open after you have a solution)
```cpp
#include <bits/stdc++.h>
using namespace std;

// ==================== YOUR CODE START ====================
class Solution {
public:
    int sumHighestAndLowestFrequency(vector<int>& nums) {
        // Write your solution here.
        return -1;
    }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

int main() {
    // {array, expected answer}
    vector<pair<vector<int>, int>> tests = {
        {{1, 2, 2, 3, 3, 3}, 4}, {{4, 4, 5, 5, 6}, 3}, {{10, 9, 7, 7, 8, 8, 8}, 4},
        {{5}, 2}, {{1, 1, 1}, 6}, {{1, 2, 3, 4}, 2}, {{9, 9, 8}, 3}, {{1, 1, 2, 2, 3, 3}, 4},
        {{4, 4, 4, 4, 2, 7, 7}, 5}, {{2, 1, 5, 2, 3}, 3}, {{2, 5, 1, 5, 3, 5, 2, 1, 5, 5, 2}, 6},
        {{1, 5, 1, 5, 1, 5, 2, 4, 5, 4}, 5}, {{10000, 1, 10000}, 3},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        vector<int> arr = tests[i].first;
        int got = Solution().sumHighestAndLowestFrequency(arr);
        if (got == tests[i].second) passed++;
        else cout << "Test " << i + 1 << " failed: arr = " << show(tests[i].first)
                  << ", expected " << tests[i].second << ", got " << got << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution (C++)
```cpp
class Solution {
public:
    int sumHighestAndLowestFrequency(vector<int>& nums) {
        unordered_map<int, int> freq;
        for (int x : nums) freq[x]++;               // 1. count every value

        int hi = 0, lo = INT_MAX;
        for (auto& [value, count] : freq) {          // 2. scan the counts
            hi = max(hi, count);
            lo = min(lo, count);
        }
        return hi + lo;                              // one distinct value: 2 * n
    }
};
```
:::
