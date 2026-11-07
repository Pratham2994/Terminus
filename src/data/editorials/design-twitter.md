# Design Twitter

> Solve it on [LeetCode 355 · Design Twitter](https://leetcode.com/problems/design-twitter/).

## The problem

Build a tiny Twitter with four operations:

- `postTweet(userId, tweetId)`: the user posts a tweet.
- `getNewsFeed(userId)`: the **10 most recent** tweet ids from the user and everyone they follow, newest first.
- `follow(followerId, followeeId)` and `unfollow(followerId, followeeId)`.

## What to store

- A global **clock**. Every tweet gets the next time value, so "most recent" is just "biggest time".
- `posts[user]`: that user's tweets as (time, tweetId), in the order posted, so the newest is at the back.
- `follows[user]`: a set of the users they follow.

## The feed: merge k sorted lists

Each followed user's posts are already sorted by time. The feed is a **merge** of those lists, and we only need the first 10. That is the classic "merge k sorted lists with a heap":

1. Push the **newest** post of the user and of each followee into a **max-heap** keyed by time.
2. Pop the newest overall and add it to the feed. Then push the **next older** post from the same user.
3. Stop after 10 posts, or when the heap is empty.

So we never look at more than 10 + (number of followees) posts, however many tweets exist.

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

## Complexity

- post, follow, unfollow: O(1) on average.
- getNewsFeed: O((F + 10) log F), where F = the number of followees.

## Edge cases

- A user must always see **their own** tweets, even though they do not "follow" themselves. Ignoring self-follows avoids double counting.
- Unfollowing someone you do not follow: `erase` on a missing key does nothing. ✓
- A user with no posts and no followees → empty feed.

(Tested on 300 random sequences of 60 operations against a brute force that scans every tweet ever posted.)
