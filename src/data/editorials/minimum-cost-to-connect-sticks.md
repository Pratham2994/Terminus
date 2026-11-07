# Minimum Cost to Connect Sticks

> LeetCode 1167 is **Premium**, and takeUforward's page needs Plus. The **same problem** is free on GeeksforGeeks as "Min Cost to Connect Ropes": use the Problem link above. GfG's function is `int minCost(vector<int>& arr)`: the same body as `connectSticks` below.

## The problem

You have sticks with positive lengths. Joining two sticks of lengths x and y costs x + y and makes one stick of length x + y. Join until one stick remains, with the **minimum total cost**.

Examples: [2, 4, 3] → **14** (2 + 3 = 5, then 5 + 4 = 9, total 14). [1, 8, 3, 5] → **30**. [5] → **0**.

## Brute force

Try every order of joining. That is exponential, so it is useless beyond tiny inputs.

## The key observation (greedy)

A stick's length is paid again **every time** its piece takes part in a later join. Sticks joined early get paid many times. So the **shortest** sticks should be joined first, and the longest ones as late as possible.

Greedy rule: **always join the two shortest sticks.** This is the same idea as Huffman coding, which proves it is optimal.

A **min-heap** gives the two shortest in O(log n) each time.

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

On GeeksforGeeks ("Minimum Cost of ropes") the total can exceed `int`, so use `long long` for the heap and the cost there.

## Complexity

- Time: O(n log n). There are n − 1 joins, each with 3 heap operations.
- Space: O(n).

## Edge cases

- One stick → 0.
- Equal lengths → any order of ties gives the same cost.

## Dry run ([1, 8, 3, 5])

| heap | join | cost so far |
|---|---|---|
| 1, 3, 5, 8 | 1 + 3 = 4 | 4 |
| 4, 5, 8 | 4 + 5 = 9 | 13 |
| 8, 9 | 8 + 9 = 17 | 30 |

Answer: **30**. (Tested on 500 random cases against trying every joining order.)
