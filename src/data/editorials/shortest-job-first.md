# Shortest Job First

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int solve(vector<int>& bt)`. Both sites want the average waiting time **rounded down**. The video above explains it too.

## What you need to do

All jobs arrive at time 0. `bt[i]` is how long job i runs. The computer runs one job at a time and always picks the **shortest** job left. A job's waiting time is how long it waits before it starts. Return the average waiting time, rounded down.

## Example

bt = [4, 3, 7, 1, 2]. Run them shortest first: 1, 2, 3, 4, 7.

| Job length | Waits |
|---|---|
| 1 | 0 |
| 2 | 1 |
| 3 | 1 + 2 = 3 |
| 4 | 1 + 2 + 3 = 6 |
| 7 | 1 + 2 + 3 + 4 = 10 |

Total 20, average 20 / 5 = **4**.

## How to solve it, step by step

1. **Sort the lengths from small to big.**

   **Why:** "always pick the shortest", with everyone arriving at time 0, is just sorted order.

2. **Keep a clock.** Each job waits until the clock reaches its start, then the clock moves forward by its length.

   **Why:** a job's wait is the total length of all jobs before it, and the clock holds exactly that total.

3. **Add up all the waits, then divide by the number of jobs.**

   **Why:** integer division in C++ already rounds down, which is what both sites want.

## Why shortest first is the best order

A job's length is added to the wait of **every job after it**. The first job's length is counted the most times. So the **smallest** lengths should go first, where they are counted most. Putting a longer job in front of a shorter one always makes the total bigger.

## Code (C++, for GfG)

```cpp
class Solution {
  public:
    int solve(vector<int>& bt) {
        vector<int> jobs = bt;                     // do not change the caller's array
        sort(jobs.begin(), jobs.end());            // shortest job first
        long long clock = 0, totalWait = 0;
        for (int len : jobs) {
            totalWait += clock;                    // this job waited until now
            clock += len;                          // then it runs
        }
        return (int)(totalWait / (long long)jobs.size());   // average, rounded down
    }
};
```

## How fast is it?

Sorting is O(n log n); the loop is O(n). It uses O(n) extra memory for the sorted copy.

## Watch out for

- Use `long long` for the total: many long jobs add up to a very big number.
- One job alone waits 0, so the answer is 0.

(Tested on 5 000 random cases against trying every possible order.)
