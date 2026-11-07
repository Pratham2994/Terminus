# Count of odd numbers in Array

> No free judge has this exact problem, so Terminus is your judge. Solve it with the visible tests, then run the hidden tests with the self-check program at the bottom in a free online compiler. takeUforward's function takes `int arr[], int n`. Here it takes `vector<int>& arr`, so `n` is `arr.size()`.

## The problem

Given an array of n positive integers (1 ≤ arr[i] ≤ 10⁴), return how many of them are **odd**.

## Visible tests

| arr | Answer |
|---|---|
| [1, 2, 3, 4, 5] | 3 |
| [1, 2, 1, 1, 5, 1] | 5 |
| [1, 3, 5, 7, 9] | 5 |

## Step by step

1. You must look at every element once: an element you skip could be odd. So the best possible time is O(n).
2. A number x is odd when `x % 2 == 1`. (For negative numbers `x % 2` is −1 in C++, so `x % 2 != 0` is the safer habit. Here all numbers are positive, so both work.)
3. Keep a counter and add 1 for each odd element.
4. Bit trick (same result): `x & 1` is 1 exactly when x is odd, because the last binary bit of an odd number is 1. So you can write `count += x & 1;`.

## Complexity

- Time: O(n). Space: O(1).

## Dry run ([10000, 9999, 1, 2])

10000 even, 9999 odd (1), 1 odd (2), 2 even. Answer: **2**.

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
    int countOdd(vector<int>& arr) {
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
        {{1, 2, 3, 4, 5}, 3}, {{1, 2, 1, 1, 5, 1}, 5}, {{1, 3, 5, 7, 9}, 5},
        {{2}, 0}, {{1}, 1}, {{2, 4, 6, 8}, 0}, {{10000, 9999, 1, 2}, 2},
        {{7, 7, 7, 7, 7, 7}, 6}, {{2, 3, 2, 3, 2, 3, 2, 3, 2, 3}, 5},
        {{5306, 2472, 6469, 792, 1187, 8780, 1543, 5992, 9549, 951, 8314, 3518, 615, 1409, 7105,
          6852, 1145, 3944, 1487, 9029, 6956, 969, 9265, 2029, 3658, 9552, 1014, 9456, 9594, 6500}, 14},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        vector<int> arr = tests[i].first;
        int got = Solution().countOdd(arr);
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
    int countOdd(vector<int>& arr) {
        int count = 0;
        for (int x : arr)
            if (x % 2 != 0) count++;     // odd (also safe for negatives)
        return count;
    }
};
```
:::
