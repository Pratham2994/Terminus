# Minimum Cost to Connect Sticks

> LeetCode 1167 is **Premium**, and takeUforward's page needs Plus. The **same problem** is free on GeeksforGeeks as "Min Cost to Connect Ropes" (the Problem link above). GfG's function is `int minCost(vector<int>& arr)`: use the same body as `connectSticks` below.

## What you need to do

Joining two sticks of lengths x and y costs x + y and gives one stick of length x + y. Join all the sticks into one, as cheaply as possible.

## Examples

- [2, 4, 3] → **14** (2 + 3 = 5, then 5 + 4 = 9; total 14)
- [1, 8, 3, 5] → **30**
- [5] → **0**

## How to solve it, step by step

1. **Notice that a stick's length is paid again every time its piece is joined later.**

   **Why:** a stick joined early becomes part of every bigger stick after it, so its length is counted many times.

2. **So join the two shortest sticks first, every time.**

   **Why:** short lengths are the cheapest to pay many times. Long sticks should be joined as late as possible. (This is the same idea as Huffman coding, which proves it is the best choice.)

3. **Use a min-heap** to get the two shortest sticks quickly. Pop two, add their sum to the cost, push the new stick back.

4. **Stop when one stick is left.**

## Code (C++)

```cpp
class Solution {
public:
    int connectSticks(vector<int>& sticks) {
        priority_queue<int, vector<int>, greater<int>> heap(sticks.begin(), sticks.end());
        int cost = 0;
        while (heap.size() > 1) {
            int a = heap.top(); heap.pop();
            int b = heap.top(); heap.pop();
            cost += a + b;
            heap.push(a + b);
        }
        return cost;
    }
};
```

On GeeksforGeeks the total can be bigger than an `int`; use `long long` there.

## How fast is it?

n − 1 joins, each with 3 heap steps: O(n log n) time, O(n) memory.

## Watch out for

- One stick → cost 0.

## Walk through ([1, 8, 3, 5])

| sticks | join | cost so far |
|---|---|---|
| 1, 3, 5, 8 | 1 + 3 = 4 | 4 |
| 4, 5, 8 | 4 + 5 = 9 | 13 |
| 8, 9 | 8 + 9 = 17 | 30 |

Answer: **30**. (Tested on 500 random cases against trying every order.)
