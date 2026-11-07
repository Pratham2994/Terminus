# Leaders in an Array

> takeUforward's page needs Plus, and its LeetCode link is Premium. Practise on Code360 (the **Similar** link above), "Superior Elements": the same leaders, but it wants them **in sorted order**. GfG's "Array Leaders" is close too, but it counts "greater **or equal**", which differs from takeUforward's "strictly greater". Both versions are below, with a self-check for takeUforward's exact version. The free editorial and video above cover it too.

## The problem

A **leader** is an element **strictly greater** than every element to its right. The last element is always a leader. Return the leaders **in the order they appear** in the array.

## Visible tests

| nums | Leaders |
|---|---|
| [1, 2, 5, 3, 1, 2] | [5, 3, 2] |
| [-3, 4, 5, 1, -4, -5] | [5, 1, -4, -5] |
| [-3, 4, 5, 1, -30, -10] | [5, 1, -10] |

## Brute force

For each i, scan everything to its right. O(n²).

## Step by step: walk from the right

1. "Greater than everything to my right" only needs **one** number: the **maximum** of the elements to the right.
2. So walk from the **last** element to the first, keeping `maxRight`, the largest value seen so far.
3. Element x is a leader if `x > maxRight`. Then it also becomes the new `maxRight`.
4. You collect leaders right to left, so **reverse** the list at the end to get the original order.
5. Start `maxRight` as "nothing seen": the last element must always count, even if it is negative. Use `INT_MIN` with care (an element equal to `INT_MIN` would fail `>`), or simply treat the last element separately as below.

## The two judges' versions

| Version | Rule | Output order |
|---|---|---|
| takeUforward | x > everything to the right | original order |
| Code360 "Superior Elements" | x > everything to the right | **sorted ascending** |
| GfG "Array Leaders" | x **≥** everything to the right | original order |

Walking from the right, the leaders come out in **increasing** value order (each new leader beats the previous one). So for Code360 you can simply **not reverse**: the list is already sorted. For GfG, change `>` to `>=`.

## Code for Code360 (submit this there)

```cpp
vector<int> superiorElements(vector<int>& a) {
    vector<int> out;
    int maxRight = a.back();
    out.push_back(a.back());                        // the last element always counts
    for (int i = (int)a.size() - 2; i >= 0; i--) {
        if (a[i] > maxRight) {                      // strictly greater than all to the right
            out.push_back(a[i]);
            maxRight = a[i];
        }
    }
    return out;                                     // right-to-left order = ascending values
}
```

## Complexity

- Time: O(n). Space: O(1) besides the output.

## Edge cases

- Equal values: in [5, 5, 5] only the last 5 is a leader under "strictly greater". (Under GfG's "≥", all three are.)
- All negative: the last element is still a leader.

## Dry run ([1, 2, 5, 3, 1, 2])

From the right: 2 (leader, max 2), 1 (no), 3 (leader, max 3), 5 (leader, max 5), 2 (no), 1 (no). Collected [2, 3, 5] → reversed **[5, 3, 2]**.

## Check takeUforward's version

1. Write the takeUforward version first (original order).
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
    vector<int> leaders(vector<int>& nums) {
        // Write your solution here.
        return {};
    }
};
// ==================== YOUR CODE END ====================

string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + to_string(v[i]);
    return s + "]";
}

int main() {
    vector<pair<vector<int>, vector<int>>> tests = {
        {{1, 2, 5, 3, 1, 2}, {5, 3, 2}},
        {{-3, 4, 5, 1, -4, -5}, {5, 1, -4, -5}},
        {{-3, 4, 5, 1, -30, -10}, {5, 1, -10}},
        {{7}, {7}},
        {{5, 5, 5}, {5}},
        {{1, 2, 3, 4}, {4}},
        {{4, 3, 2, 1}, {4, 3, 2, 1}},
        {{3, 3, 1, 3}, {3}},
        {{8, 5, 5, 7, 9, -3, -4, 7, 6, -4, -6, 5}, {9, 7, 6, 5}},
        {{-5, -7, 8, -8, 3, 5, -4, -9, 7}, {8, 7}},
        {{-8, -8, -3, -2, -9, 5}, {5}},
        {{INT_MIN, INT_MIN}, {INT_MIN}},
    };
    int passed = 0;
    for (size_t i = 0; i < tests.size(); i++) {
        vector<int> nums = tests[i].first;
        vector<int> got = Solution().leaders(nums);
        if (got == tests[i].second) passed++;
        else cout << "Test " << i + 1 << " failed: nums = " << show(tests[i].first)
                  << "\n  expected " << show(tests[i].second) << "\n  got      " << show(got) << "\n";
    }
    cout << passed << " / " << tests.size() << " tests passed\n";
}
```
:::

:::hidden Full solution for takeUforward's version (C++)
```cpp
class Solution {
public:
    vector<int> leaders(vector<int>& nums) {
        vector<int> out;
        int n = nums.size();
        int maxRight = nums[n - 1];
        out.push_back(nums[n - 1]);                 // the last element always counts
        for (int i = n - 2; i >= 0; i--) {
            if (nums[i] > maxRight) {
                out.push_back(nums[i]);
                maxRight = nums[i];
            }
        }
        reverse(out.begin(), out.end());            // back to the original order
        return out;
    }
};
```
:::
