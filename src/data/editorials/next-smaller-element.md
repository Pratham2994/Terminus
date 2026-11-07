# Next Smaller Element

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> nextSmallerElements(const vector<int>& arr)`.

## The problem

For each element, find the **first element to its right that is strictly smaller**. If there is none, use −1. n ≤ 10⁵.

Examples: [4, 8, 5, 2, 25] → **[2, 5, 2, −1, −1]**. [10, 9, 8, 7] → **[9, 8, 7, −1]**.

## Brute force

For each i, scan right until you meet something smaller.

- Time: O(n²), about 10¹⁰ for n = 10⁵. Too slow.

## The better idea: a monotonic stack

Walk from **right to left** and keep a stack of "candidates": values to the right that could still be someone's next smaller element.

For arr[i]:

1. **Pop** every value ≥ arr[i]. They can never be the answer for arr[i], since they are not smaller. They also cannot be the answer for anything further left, because arr[i] is closer and at least as small.
2. Whatever is on top now is the nearest smaller value to the right. If the stack is empty, the answer is −1.
3. **Push** arr[i]. It is now a candidate for the elements to its left.

The stack always increases from bottom to top. That is why it is called a monotonic stack.

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

## Complexity

- Time: O(n). Every value is pushed once and popped at most once, so the while loop runs at most n times in total.
- Space: O(n) for the stack.

## Edge cases

- Equal values: "smaller" means **strictly** smaller, so pop on `>=`. In [3, 3, 1], the first 3's answer is 1, not 3.
- Negative values are fine. −1 is only the "none" marker, and the answer for an element is always an actual array value.

## Dry run ([4, 8, 5, 2, 25])

| i | arr[i] | pops | answer | stack after |
|---|---|---|---|---|
| 4 | 25 | — | −1 | [25] |
| 3 | 2 | 25 | −1 | [2] |
| 2 | 5 | — | 2 | [2, 5] |
| 1 | 8 | — | 5 | [2, 5, 8] |
| 0 | 4 | 8, 5 | 2 | [2, 4] |

Answer: **[2, 5, 2, −1, −1]**.
