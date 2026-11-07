# Shortest Job First

> takeUforward's page needs Plus. Solve the same problem free on GeeksforGeeks (the Problem link above). GfG's function is `int solve(vector<int>& bt)`. Both return the average waiting time **rounded down**. The video above explains it too.

## The problem

n processes all arrive at time 0. `bt[i]` is how long process i runs. The CPU runs one at a time, always picking the **shortest** remaining job (Shortest Job First). A process's **waiting time** is how long it waits before it starts. Return the average waiting time, rounded down.

Examples: [4, 3, 7, 1, 2] → **4**. [1, 2, 3, 4] → **2**.

## Step by step

1. SJF on jobs that all arrive at time 0 just means: **run them in increasing order of length**. So sort `bt`.
2. The first job waits 0. Each next job waits for **all jobs before it** to finish. So job k waits `bt[0] + … + bt[k − 1]`, a running prefix sum.
3. Add up all the waiting times and divide by n. Integer division rounds down.

## Why shortest first is optimal (greedy)

Every job's length is added to the waiting time of **every job after it**. The first job's length is counted n − 1 times, the second n − 2 times, and so on. To make the total smallest, the **smallest lengths** should get the **biggest multipliers**, so they go first. (If a longer job came right before a shorter one, swapping them lowers the total. That is the exchange argument.)

## Code (C++)

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

## Complexity

- Time: O(n log n) for the sort. Space: O(n) for the copy (O(1) if you may sort in place).

## Edge cases

- One job → it waits 0 → 0.
- Use `long long` for the total: 10⁵ jobs of length 10⁵ give waits up to ~10¹⁴.

## Dry run ([4, 3, 7, 1, 2])

Sorted: [1, 2, 3, 4, 7]. Waits: 0, 1, 3, 6, 10. Total 20, average 20 / 5 = **4**.

(Tested on 5 000 random arrays against trying every order for small n.)
