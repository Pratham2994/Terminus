# Sort a K-Sorted Array

> Solve it on takeUforward's free practice page (the Problem link above). The function is `vector<int> sortKSortedArray(vector<int>& arr, int k)`.

## The problem

Every element of arr (n ≤ 10⁵) is **at most k positions** away from where it belongs in sorted order. Sort it, and use that property instead of a plain full sort.

Example: [3, 1, 2, 5, 4, 7, 6], k = 2 → **[1, 2, 3, 4, 5, 6, 7]**.

## Brute force

`sort(arr)`: O(n log n). Correct, but it ignores k. The problem asks for better when k is small.

## The key observation

The smallest element overall must sit somewhere in the first **k + 1** positions, because it is at most k away from position 0. More generally, the element for output position i is among arr[i … i + k].

So keep a **min-heap with k + 1 elements**: the window of candidates.

1. Push elements one by one.
2. Once the heap holds more than k elements, its minimum must be the next element of the sorted output. Pop it and append it.
3. At the end, pop everything left. It comes out in order.

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

## Complexity

- Time: O(n log k). Each push and pop works on a heap of at most k + 1 elements.
- Space: O(k) for the heap, plus the output.

## Edge cases

- k = 0: the array is already sorted, and the heap passes every element straight through.
- `greater<int>` makes `priority_queue` a **min**-heap. By default it is a max-heap.

## Dry run ([3, 1, 2, 5, 4], k = 2)

| push | heap | pop → out |
|---|---|---|
| 3 | {3} | — |
| 1 | {1, 3} | — |
| 2 | {1, 2, 3} | 1 → [1] |
| 5 | {2, 3, 5} | 2 → [1, 2] |
| 4 | {3, 4, 5} | 3 → [1, 2, 3] |

Drain: 4, 5. Answer: **[1, 2, 3, 4, 5]**.
