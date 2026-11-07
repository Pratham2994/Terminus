# Sum of Array Elements II

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int arraySum(vector<int>& arr)`. GfG accepts a loop too, but this station is about **recursion**, so practise it that way.

## What you need to do

Add up all the numbers in the array, **using recursion** instead of a loop.

## Example

[5, 8, 1] → 5 + 8 + 1 = **14**.

## How to solve it, step by step

1. **Find a smaller copy of the same problem.** "The sum of the first i numbers" is the sum of the first i − 1 numbers, plus number i.

   **Why:** recursion means solving a problem with the answer to a smaller copy of itself.

2. **Write the base case:** the sum of the first 0 numbers is 0.

   **Why:** every recursion needs a point where it stops. Without one, the calls never end and the program crashes.

3. **Write the step:** `sumFirst(i) = sumFirst(i − 1) + arr[i − 1]`.

   **Why:** `arr[i − 1]` is the i-th number, because arrays start at 0.

4. **Trust the smaller call.** Do not trace every call in your head; just check that the step is right and the base case is reached.

   **Why:** this habit makes recursion easy. If the step is right for one size, it is right for all sizes.

## Code (C++, for GfG)

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

## How fast is it?

One call per number: O(n) time. The calls wait on each other, so it also uses O(n) memory for the call stack. A loop would use O(1); that is the price of recursion.

## Watch out for

- Pass the array **by reference** (`vector<int>&`). Without the `&`, every call copies the whole array, which makes it very slow.
- An empty array returns 0 straight from the base case.

## Walk through ([5, 8, 1])

- sumFirst(3) = sumFirst(2) + 1
- sumFirst(2) = sumFirst(1) + 8
- sumFirst(1) = sumFirst(0) + 5 = 0 + 5 = 5
- Coming back: 5 + 8 = 13, then 13 + 1 = **14**.

(Tested on 2 000 random arrays against a plain loop.)
