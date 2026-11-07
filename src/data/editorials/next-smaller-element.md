# Next Smaller Element

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> nextSmallerElements(const vector<int>& arr)`.

## What you need to do

For each number, find the **first number to its right that is strictly smaller**. If there is none, write −1.

## Examples

- [4, 8, 5, 2, 25] → **[2, 5, 2, −1, −1]**
- [10, 9, 8, 7] → **[9, 8, 7, −1]**

## How to solve it, step by step

1. **The slow idea:** for each number, scan to the right. O(n²): too slow for 100 000 numbers.

2. **Walk from right to left, keeping a stack of "candidates"**: numbers to the right that might still be someone's answer.

   **Why:** going right to left means everything to the right has already been seen.

3. **For each number x, first pop every candidate that is ≥ x.**

   **Why:** they are not smaller than x, so they cannot be x's answer. They also cannot be the answer for anything further left, because x is closer and at least as small. So they are useless from now on.

4. **Now the top of the stack (if any) is x's answer; if the stack is empty, the answer is −1.**

   **Why:** after popping, the top is the nearest number to the right that is smaller than x.

5. **Push x.**

   **Why:** x is now a candidate for the numbers to its left.

The stack always increases from bottom to top, which is why this is called a **monotonic stack**.

## Code (C++)

```cpp
class Solution {
public:
    vector<int> nextSmallerElements(const vector<int>& arr) {
        int n = arr.size();
        vector<int> ans(n, -1);
        stack<int> st;                       // increasing from bottom to top
        for (int i = n - 1; i >= 0; i--) {
            while (!st.empty() && st.top() >= arr[i]) st.pop();
            if (!st.empty()) ans[i] = st.top();
            st.push(arr[i]);
        }
        return ans;
    }
};
```

## How fast is it?

Every number is pushed once and popped at most once: O(n) time in total. Memory: O(n) for the stack.

## Watch out for

- "Smaller" means **strictly** smaller, so pop on `>=`. In [3, 3, 1], the first 3's answer is 1, not 3.

## Walk through ([4, 8, 5, 2, 25])

| number | pops | answer | stack after |
|---|---|---|---|
| 25 | – | −1 | [25] |
| 2 | 25 | −1 | [2] |
| 5 | – | 2 | [2, 5] |
| 8 | – | 5 | [2, 5, 8] |
| 4 | 8, 5 | 2 | [2, 4] |

Read the answers back in the original order: **[2, 5, 2, −1, −1]**.
