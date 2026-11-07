# Hand of Straights

> Solve it on [LeetCode 846 · Hand of Straights](https://leetcode.com/problems/hand-of-straights/).

## What you need to do

Can all the cards be split into groups of exactly `groupSize` **consecutive** values, using every card once?

## Examples

- [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3 → **true**: [1, 2, 3], [2, 3, 4], [6, 7, 8]
- [1, 2, 3, 4, 5], groupSize = 4 → **false**

## How to solve it, step by step

1. **If the number of cards is not a multiple of groupSize, return false.**

   **Why:** the groups could never come out even.

2. **Count each value** in a sorted map (`map<int,int>`).

   **Why:** a sorted map always tells you the smallest card left.

3. **Look at the smallest card left. It must start a group.**

   **Why:** nothing smaller is left, so it cannot be in the middle or at the end of a group. Its group is forced: smallest, smallest + 1, …, smallest + groupSize − 1.

4. **Remove one copy of each card in that group. If any is missing, return false.**

5. **Repeat until no cards are left, then return true.**

## Code (C++)

```cpp
class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {
        if (hand.size() % groupSize != 0) return false;
        map<int, int> count;                        // sorted by card value
        for (int c : hand) count[c]++;
        while (!count.empty()) {
            int first = count.begin()->first;       // smallest card left
            for (int c = first; c < first + groupSize; c++) {
                auto it = count.find(c);
                if (it == count.end()) return false;
                if (--it->second == 0) count.erase(it);
            }
        }
        return true;
    }
};
```

## How fast is it?

Each card is removed once, and each map step is O(log n): O(n log n) time, O(n) memory.

## Watch out for

- Erase a value from the map when its count reaches 0, so the "smallest card left" is really still there.
- groupSize = 1 is always true.

## Walk through ([1, 2, 3, 6, 2, 3, 4, 7, 8], 3)

- Smallest 1 → remove 1, 2, 3.
- Smallest 2 → remove 2, 3, 4.
- Smallest 6 → remove 6, 7, 8. Nothing left → **true**.

(Tested on 4 000 random hands against trying every split.)
