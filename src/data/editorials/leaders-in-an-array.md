# Leaders in an Array

> takeUforward's page needs Plus. Practise on Code360 (the **Similar** link above). It is almost the same problem. The box below shows the one small difference.

## What you need to do

Find every number that is **bigger than everything to its right**. These numbers are called **leaders**. The last number always counts, because nothing is to its right.

## What is different on Code360

| | takeUforward | Code360 "Superior Elements" |
|---|---|---|
| Who is a leader | bigger than everything to its right | the same |
| Order of the answer | the order they appear in the array | **sorted, smallest first** |
| Function | `vector<int> leaders(vector<int>& nums)` | `vector<int> superiorElements(vector<int>& a)` |

**In short:** the method is the same. Only the order of the answer changes, and that change makes the Code360 version one line shorter (see step 5).

## Example

nums = [1, 2, 5, 3, 1, 2]

- 2 is last → leader.
- 1 → no (2 is to its right and is bigger).
- 3 → leader (only 1 and 2 are to its right).
- 5 → leader.
- 2 and 1 at the start → no (5 is to their right).

Answer (takeUforward): **[5, 3, 2]**. Answer (Code360): **[2, 3, 5]**.

## How to solve it, step by step

1. **Start from the right end, not the left.**

   **Why:** "bigger than everything to my right" is about the right side. If you walk from the right, you have already seen that whole side when you reach a number.

2. **Keep one number: the biggest value seen so far.** Call it `maxRight`.

   **Why:** to beat everything on the right, a number only has to beat the biggest one. So you never need to look back.

3. **For each number:** if it is bigger than `maxRight`, it is a leader. Save it, and make it the new `maxRight`.

   **Why:** a new leader is now the biggest thing seen, so later numbers must beat it.

4. **The last number goes in first,** before the loop.

   **Why:** nothing is to its right, so it is always a leader.

5. **Fix the order at the end.**
   - takeUforward wants the original order. You collected the leaders from right to left, so **reverse** the list.
   - Code360 wants them sorted. Each new leader is bigger than the one before, so the list you collected is **already sorted**. Return it as it is.

## Code for Code360 (submit this there)

```cpp
vector<int> superiorElements(vector<int>& a) {
    vector<int> out;
    int maxRight = a.back();                        // the last number is always a leader
    out.push_back(a.back());
    for (int i = (int)a.size() - 2; i >= 0; i--) {  // walk right to left
        if (a[i] > maxRight) {                      // beats everything to its right
            out.push_back(a[i]);
            maxRight = a[i];                        // the new biggest value seen
        }
    }
    return out;                                     // already smallest first: no reverse
}
```

The takeUforward version is in the "Full solution" fold at the bottom. It is this code plus one `reverse`.

## How fast is it?

Each number is looked at once, so it is O(n) time, and it uses no extra memory besides the answer.

## Watch out for

- **Equal numbers:** "bigger" means strictly bigger. In [5, 5, 5] only the last 5 is a leader.
- **Negative numbers:** the last number is still a leader, even if it is −100. That is why step 4 starts with the last number instead of 0.
- **GfG's "Array Leaders"** looks similar, but there a number only has to be "bigger **or equal**". Do not use it to check this version.

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
