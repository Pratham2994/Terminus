# Sum of Array Elements II

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int arraySum(vector<int>& arr)`. GfG does not force recursion, but this station is about recursion, so solve it recursively.

## The problem

Return the sum of all elements of the array, **using recursion** (no loop).

Examples: [1, 2, 3] → **6**. [5, 8, 1] → **14**.

## How to think recursively

A recursive function needs two things:

1. **A base case** that answers a tiny input directly.
2. **A step** that answers a big input using the answer to a **smaller** one.

For the sum of the first i elements:

- Base case: the sum of the first **0** elements is **0**.
- Step: sum of the first i elements = **sum of the first i − 1** + `arr[i − 1]`.

Trust the smaller call. You do not trace the whole chain in your head; you only check that the step is right and the base case stops it.

## Code (C++)

```cpp
class Solution {
    // Sum of arr[0 .. i-1].
    int sumFirst(vector<int>& arr, int i) {
        if (i == 0) return 0;                        // base case: empty prefix
        return sumFirst(arr, i - 1) + arr[i - 1];    // smaller problem + one element
    }
  public:
    int arraySum(vector<int>& arr) {
        return sumFirst(arr, arr.size());
    }
};
```

## Complexity

- Time: O(n). One call per element.
- Space: O(n) for the call stack: n calls wait on each other before any returns. A loop would use O(1). This is the price of recursion.

## Edge cases

- Empty array: `sumFirst(arr, 0)` returns 0 at once.
- Pass the vector **by reference** (`vector<int>&`). Passing by value copies the whole array in every call, which makes it O(n²).

## Dry run ([5, 8, 1])

- sumFirst(3) = sumFirst(2) + 1
- sumFirst(2) = sumFirst(1) + 8
- sumFirst(1) = sumFirst(0) + 5 = 0 + 5 = 5
- back up: 5 + 8 = 13, then 13 + 1 = **14**.

(Tested on 2 000 random arrays against a loop.)
