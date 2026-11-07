# Sum of Highest and Lowest Frequency

> No free judge has this exact problem, so Terminus is your judge. Solve it with the tests below, then check it with the self-check program at the bottom. The function here is `int sumHighestAndLowestFrequency(vector<int>& nums)`.

## What you need to do

Count how often each value appears. Take the **highest** count and the **lowest** count, and return their sum. Only values that actually appear count.

## Visible tests

| arr | Highest | Lowest | Answer |
|---|---|---|---|
| [1, 2, 2, 3, 3, 3] | 3 (value 3) | 1 (value 1) | 4 |
| [4, 4, 5, 5, 6] | 2 (4 and 5) | 1 (value 6) | 3 |
| [10, 9, 7, 7, 8, 8, 8] | 3 (value 8) | 1 (10 or 9) | 4 |

## How to solve it, step by step

1. **Count every value first,** with `unordered_map<int,int> freq` and `freq[x]++`.

   **Why:** you cannot know the highest or lowest count before you have all the counts.

2. **Then go through the counts (not the array)** and keep `hi = max(hi, count)` and `lo = min(lo, count)`.

   **Why:** the counts are what the question is about.

3. **Start with `hi = 0` and `lo` very large** (`INT_MAX`).

   **Why:** every real count is between 1 and n, so the first count replaces both.

4. **Return `hi + lo`.**

5. **Check the case with only one distinct value,** like [1, 1, 1]. That value is both the most and the least common, so the answer is 3 + 3 = 6.

   **Why:** it is easy to think "there is no lowest" and return the wrong thing.

## How fast is it?

One pass to count, one pass over the counts: O(n) on average. Memory for the map: O(number of distinct values).

## Watch out for

- If you use a plain array of 10 001 counters instead of a map, skip the zeros. Otherwise `lo` becomes 0 every time.

## Walk through ([4, 4, 4, 4, 2, 7, 7])

Counts: 4 → 4 times, 2 → 1 time, 7 → 2 times. hi = 4, lo = 1. Answer: **5**.

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
