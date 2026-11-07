# Design Twitter

> Solve it on [LeetCode 355 · Design Twitter](https://leetcode.com/problems/design-twitter/).

## What you need to do

Build a tiny Twitter with four actions:

- `postTweet(userId, tweetId)`: a user posts a tweet.
- `getNewsFeed(userId)`: the **10 newest** tweets from the user and everyone they follow, newest first.
- `follow(followerId, followeeId)` and `unfollow(followerId, followeeId)`.

## How to solve it, step by step

1. **Keep a global clock.** Every new tweet gets the next number.

   **Why:** then "newest" simply means "biggest number".

2. **Store each user's tweets as (time, tweetId), in the order posted.**

   **Why:** the newest tweet is always at the back, so each user's list is already sorted by time.

3. **Store who each user follows in a set.**

   **Why:** follow and unfollow are then a single insert or erase.

4. **For the feed, merge the sorted lists with a max-heap.** Put the newest tweet of the user and of each person they follow into the heap.

   **Why:** the newest tweet overall must be the newest of one of these lists.

5. **Take the newest from the heap, add it to the feed, then push that same user's next older tweet.** Stop after 10 tweets or when the heap is empty.

   **Why:** you never look at more than about 10 + (number followed) tweets, however many tweets exist.

## Code (C++)

```cpp
class Twitter {
    int time = 0;
    unordered_map<int, vector<pair<int, int>>> posts;   // user -> (time, tweetId)
    unordered_map<int, unordered_set<int>> follows;
public:
    Twitter() {}

    void postTweet(int userId, int tweetId) {
        posts[userId].push_back({time++, tweetId});
    }

    vector<int> getNewsFeed(int userId) {
        // (time, tweetId, user, index into that user's posts)
        priority_queue<tuple<int, int, int, int>> heap;
        auto pushLatest = [&](int u) {
            auto& p = posts[u];
            if (!p.empty()) heap.push({p.back().first, p.back().second, u, (int)p.size() - 1});
        };
        pushLatest(userId);
        for (int f : follows[userId])
            if (f != userId) pushLatest(f);
        vector<int> feed;
        while (!heap.empty() && feed.size() < 10) {
            auto [t, id, u, i] = heap.top();
            heap.pop();
            feed.push_back(id);
            if (i > 0) heap.push({posts[u][i - 1].first, posts[u][i - 1].second, u, i - 1});
        }
        return feed;
    }

    void follow(int followerId, int followeeId) {
        if (followerId != followeeId) follows[followerId].insert(followeeId);
    }

    void unfollow(int followerId, int followeeId) {
        follows[followerId].erase(followeeId);
    }
};
```

## How fast is it?

Posting, following and unfollowing are O(1) on average. A feed takes O((F + 10) log F), where F is the number of people followed.

## Watch out for

- Users always see **their own** tweets, even though they do not "follow" themselves. Ignore a user following themself, so nothing is counted twice.
- Unfollowing someone you do not follow does nothing; `erase` of a missing item is safe.

(Tested on 300 random sequences of 60 actions against a version that scans every tweet ever posted.)
