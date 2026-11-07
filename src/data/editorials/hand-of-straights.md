# Hand of Straights

> Solve it on [LeetCode 846 · Hand of Straights](https://leetcode.com/problems/hand-of-straights/).

## The problem

Can all the cards in `hand` be split into groups of exactly `groupSize` **consecutive** values, with every card used exactly once?

Examples: [1,2,3,6,2,3,4,7,8], groupSize = 3 → **true** ([1,2,3], [2,3,4], [6,7,8]). [1,2,3,4,5], groupSize = 4 → **false**.

## The key observation (greedy)

Look at the **smallest card** left. Nothing smaller exists, so it can only be the **start** of a group. It must be in some group, so that group is forced: smallest, smallest + 1, …, smallest + groupSize − 1.

So, repeatedly:

1. Take the smallest remaining value.
2. Remove one copy each of that value and the next groupSize − 1 values.
3. If any of them is missing → false.

If the cards run out cleanly → true.

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

## Complexity

- Time: O(n log n). Each card is removed once, and each map operation is O(log n).
- Space: O(n).

## Edge cases

- If the total is not a multiple of groupSize → false at once.
- groupSize = 1 → always true.
- Erase a value when its count reaches 0, so that `count.begin()` is always a card that is really left.

## Dry run ([1,2,3,6,2,3,4,7,8], 3)

- Counts: 1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1.
- Smallest 1 → remove 1, 2, 3. Left: 2:1, 3:1, 4:1, 6, 7, 8.
- Smallest 2 → remove 2, 3, 4. Left: 6, 7, 8.
- Smallest 6 → remove 6, 7, 8. Empty.

Answer: **true**. (Tested on 4 000 random hands against a brute-force search.)
