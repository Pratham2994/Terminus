# Build heap from a given Array

> takeUforward's page needs Plus. Solve the same problem free on Code360 (the Problem link above), "Build Min Heap". Code360's function is `vector<int> buildMinHeap(vector<int>& arr)`: return the heap. Any valid min-heap is accepted, like on takeUforward.

## The problem

Rearrange an array into a **min-heap**: for every index i, `arr[i] ≤ arr[2i + 1]` and `arr[i] ≤ arr[2i + 2]` (when those children exist).

Example: [9, 3, 2, 6, 7] → one valid answer **[2, 3, 9, 6, 7]**.

## Way 1: insert one by one, O(n log n)

Start with an empty heap and insert each element, sifting it **up**. Each insert costs O(log n).

## Way 2: bottom-up build-heap, O(n) (the one to learn)

1. **Leaves are already heaps.** Indices from n/2 to n − 1 have no children.
2. Go through the other nodes **from the last one (n/2 − 1) back to 0**, and **sift each one down**: while it is bigger than its smaller child, swap with that child.
3. **Why backwards?** When you sift node i, both of its subtrees have higher indices, so they are already heaps. Sift-down is only correct on top of heaps.
4. **Why O(n)?** Half the nodes are leaves (0 work), a quarter sift at most 1 level, an eighth at most 2… The total n/4·1 + n/8·2 + n/16·3 + … stays below n.

## Code (C++)

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

## Complexity

- Time: **O(n)** (Way 1 is O(n log n)). Space: O(1) extra.

## Edge cases

- n = 1: the loop starts at −1 and does not run.
- Swap with the **smaller** child. Swapping with the larger one leaves the smaller child below a bigger parent.

## Dry run ([9, 3, 2, 6, 7])

- n = 5, last non-leaf is 1 (value 3): children 6, 7 → no swap.
- i = 0 (value 9): children 3 and 2 → swap with 2 → [2, 3, 9, 6, 7]. Index 2 has no children → stop.

Result **[2, 3, 9, 6, 7]**. (Tested on 5 000 random arrays: the result is always a min-heap with the same numbers.)
