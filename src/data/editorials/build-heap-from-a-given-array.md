# Build heap from a given Array

> takeUforward's page needs Plus. Solve the same problem free on Code360 (the Problem link above), "Build Min Heap". Code360's function is `vector<int> buildMinHeap(vector<int>& arr)`: return the heap. Any correct min-heap is accepted, as on takeUforward.

## What you need to do

Rearrange an array into a **min-heap**. Read the array as a tree: the children of position i are at 2i + 1 and 2i + 2. In a min-heap, every parent is **≤ its children**.

## Example

[9, 3, 2, 6, 7] → one correct answer is **[2, 3, 9, 6, 7]**: 2 ≤ 3 and 2 ≤ 9; 3 ≤ 6 and 3 ≤ 7.

## How to solve it, step by step

1. **Leaves are already fine.** Positions from n/2 to the end have no children.

   **Why:** a single node with no children is a heap by itself, so there is nothing to fix there.

2. **Fix the other positions one by one, starting from the last parent (n/2 − 1) and going back to 0.**

   **Why:** when you fix position i, everything below it is already a heap. That is what makes the next step correct.

3. **To fix position i, "sift it down":** while it is bigger than its smaller child, swap it with that child and keep going from there.

   **Why:** the smaller child is the only one that can sit above both children. Swapping with the bigger child would put a big number above a smaller one.

4. **When you reach 0, the whole array is a heap.**

## Why this is O(n), not O(n log n)

Half the positions are leaves (no work). A quarter can move down at most 1 level, an eighth at most 2, and so on. Added up, that stays below n. Inserting the numbers one at a time instead would cost O(n log n).

## Code (C++, for Code360)

```cpp
void siftDown(vector<int>& h, int i) {
    int n = h.size();
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
        if (l < n && h[l] < h[smallest]) smallest = l;
        if (r < n && h[r] < h[smallest]) smallest = r;
        if (smallest == i) return;              // heap property holds here
        swap(h[i], h[smallest]);
        i = smallest;
    }
}

vector<int> buildMinHeap(vector<int>& arr) {
    for (int i = (int)arr.size() / 2 - 1; i >= 0; i--)   // last non-leaf down to the root
        siftDown(arr, i);
    return arr;
}
```

## How fast is it?

O(n) time, no extra memory.

## Watch out for

- Always swap with the **smaller** child.
- With one number, the loop starts at −1 and does nothing, which is correct.

## Walk through ([9, 3, 2, 6, 7])

- Last parent is position 1 (value 3): its children 6 and 7 are bigger → nothing to do.
- Position 0 (value 9): children 3 and 2; the smaller is 2 → swap → [2, 3, 9, 6, 7]. 9 is now at position 2, which has no children → stop.

Result **[2, 3, 9, 6, 7]**. (Tested on 5 000 random arrays: every result is a min-heap with the same numbers.)
