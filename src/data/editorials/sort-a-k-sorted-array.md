# Sort a K-Sorted Array

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> sortKSortedArray(vector<int>& arr, int k)`.

## What you need to do

Every number is **at most k places away** from where it belongs. Sort the array, and use that fact to be faster than a normal sort.

## Example

[3, 1, 2, 5, 4, 7, 6], k = 2 → **[1, 2, 3, 4, 5, 6, 7]**.

## How to solve it, step by step

1. **The number that belongs first must be within the first k + 1 places.**

   **Why:** it is at most k places away from position 0.

2. **The same is true at every step:** the next number of the sorted answer is always among the next k + 1 numbers you have not placed yet.

3. **So keep those k + 1 candidates in a min-heap.** Add numbers one by one; once the heap holds more than k, take out its smallest and append it to the answer.

   **Why:** a min-heap gives you the smallest candidate quickly, and it never needs to hold more than k + 1 numbers.

4. **At the end, take out everything left.** It comes out in order.

## Code (C++)

```cpp
class Solution {
public:
    vector<int> sortKSortedArray(vector<int>& arr, int k) {
        priority_queue<int, vector<int>, greater<int>> heap;   // min-heap
        vector<int> out;
        for (int x : arr) {
            heap.push(x);
            if ((int)heap.size() > k) {          // k+1 candidates: the min is final
                out.push_back(heap.top());
                heap.pop();
            }
        }
        while (!heap.empty()) { out.push_back(heap.top()); heap.pop(); }
        return out;
    }
};
```

## How fast is it?

Each number goes in and out of a heap of size k + 1: O(n log k). For small k, that beats a normal sort's O(n log n). Memory: O(k).

## Watch out for

- `priority_queue` is a **max**-heap by default. `greater<int>` makes it a min-heap.
- k = 0 means the array is already sorted; the heap just passes numbers straight through.

## Walk through ([3, 1, 2, 5, 4], k = 2)

| add | heap | take out → answer |
|---|---|---|
| 3 | {3} | – |
| 1 | {1, 3} | – |
| 2 | {1, 2, 3} | 1 → [1] |
| 5 | {2, 3, 5} | 2 → [1, 2] |
| 4 | {3, 4, 5} | 3 → [1, 2, 3] |

Then 4 and 5 come out. Answer: **[1, 2, 3, 4, 5]**.
