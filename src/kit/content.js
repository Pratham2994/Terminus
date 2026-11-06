// C++ kit. Each chapter has blocks of { h, p, code, table }.
// Code lines stay short so they read on a phone.

export const KIT = [
  {
    id: 'bigo',
    title: 'Big-O',
    intro:
      'Count how many times the innermost line runs, as a function of the input size n. Drop constants and smaller terms.',
    blocks: [
      {
        h: 'Read the budget from the constraints',
        p: 'A judge runs about 10^8 simple steps per second. Look at the largest n, then pick an approach that fits.',
        table: [
          ['n up to', 'Target', 'Typical idea'],
          ['10–12', 'O(n!)', 'All permutations'],
          ['20–25', 'O(2^n)', 'All subsets, backtracking'],
          ['100–500', 'O(n^3)', 'Triple loop, Floyd-Warshall, interval DP'],
          ['10^3–5·10^3', 'O(n^2)', 'Double loop, 2D DP'],
          ['10^5–10^6', 'O(n log n)', 'Sort, heap, binary search'],
          ['10^7–10^8', 'O(n)', 'One pass, two pointers, prefix sums'],
          ['above 10^9', 'O(log n) or O(1)', 'Binary search, math'],
        ],
      },
      {
        h: 'Loops',
        p: 'Nested loops multiply. Loops one after another add, and the bigger one wins.',
        code: `for (int i = 0; i < n; i++)        // n
  for (int j = 0; j < n; j++)      // x n  -> O(n^2)
    work();

for (int i = 0; i < n; i++)        // n
  for (int j = i; j < n; j++)      // n + (n-1) + ... + 1
    work();                        // = n(n+1)/2 -> O(n^2)

for (int i = 0; i < n; i++) a();   // O(n)
for (int j = 0; j < m; j++) b();   // + O(m) -> O(n + m)`,
      },
      {
        h: 'Where log n comes from',
        p: 'If each step halves (or doubles) the remaining work, the loop runs about log2(n) times. log2(10^6) is about 20.',
        code: `for (int i = n; i > 0; i /= 2)     // O(log n)
  work();

for (int i = 1; i < n; i *= 2)     // O(log n)
  work();

for (int i = 0; i < n; i++)        // n times
  for (int j = 1; j < n; j *= 2)   // log n each
    work();                        // O(n log n)`,
      },
      {
        h: 'Recursion: draw the tree',
        p: 'Total work = (number of calls) × (work per call). Count calls by drawing the recursion tree: branches per call, and depth.',
        code: `// 2 branches, depth n -> 2^n calls
int fib(int n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}  // O(2^n). With memo: n states x O(1) = O(n)

// Merge sort: depth log n, each level does O(n)
// -> O(n log n)

// Subsets: each element in or out -> 2^n leaves,
// copying a subset costs O(n) -> O(n · 2^n)`,
      },
      {
        h: 'Memo DP',
        p: 'Time = number of states × work per state. Space = number of states (plus the recursion stack).',
        code: `// dp[i][j], i < n, j < m, O(1) per state
// -> time O(n·m), space O(n·m)
// dp[i][j] that loops k inside -> O(n·m·k)`,
      },
      {
        h: 'Amortised cost',
        p: 'Look at the total over the whole run, not one step. Each element is pushed once and popped at most once, so a monotonic stack is O(n) in total even with the inner while loop. Same for two pointers: each pointer only moves forward, so O(n). vector::push_back is O(1) amortised.',
        code: `for (int i = 0; i < n; i++) {
  while (!st.empty() && st.top() <= a[i])
    st.pop();        // each index popped once
  st.push(a[i]);     // each index pushed once
}                    // total O(n), not O(n^2)`,
      },
      {
        h: 'Space',
        p: 'Count extra memory you allocate, plus the recursion depth (each call uses stack). The input itself usually does not count.',
        code: `vector<int> seen(n);   // O(n)
vector<vector<int>> g(n, vector<int>(m)); // O(n·m)
dfs on a path of n nodes // O(n) stack`,
      },
      {
        h: 'Costs of common STL calls',
        table: [
          ['Operation', 'Cost'],
          ['sort', 'O(n log n)'],
          ['vector push_back / pop_back', 'O(1) amortised'],
          ['vector insert / erase in the middle', 'O(n)'],
          ['set / map insert, find, erase', 'O(log n)'],
          ['unordered_set / unordered_map', 'O(1) average, O(n) worst'],
          ['priority_queue push / pop', 'O(log n)'],
          ['priority_queue top', 'O(1)'],
          ['lower_bound on a sorted vector', 'O(log n)'],
          ['string s + t (new string)', 'O(|s| + |t|)'],
          ['s.substr(i, k)', 'O(k)'],
        ],
      },
    ],
  },
  {
    id: 'stl',
    title: 'STL',
    intro: 'The containers and calls that show up again and again in A2Z.',
    blocks: [
      {
        h: 'Setup',
        code: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
}`,
      },
      {
        h: 'Sort with a comparator',
        p: 'The comparator returns true when a must come before b. It must be strict: use <, never <=.',
        code: `sort(v.begin(), v.end());              // ascending
sort(v.rbegin(), v.rend());            // descending
sort(v.begin(), v.end(), greater<int>());

// intervals by end, then by start
sort(iv.begin(), iv.end(), [](auto& a, auto& b) {
  if (a[1] != b[1]) return a[1] < b[1];
  return a[0] < b[0];
});`,
      },
      {
        h: 'map vs unordered_map',
        p: 'map keeps keys sorted (O(log n)) and gives you begin(), lower_bound and ordered iteration. unordered_map is O(1) average but has no order. Use unordered_map for counting; use map when you need order or the smallest/largest key.',
        code: `unordered_map<int, int> cnt;
for (int x : a) cnt[x]++;

map<int, int> m;
m[5] = 1; m[2] = 7;
auto [k, v] = *m.begin();   // smallest key
auto it = m.lower_bound(3); // first key >= 3
if (m.count(5)) { /* present */ }`,
      },
      {
        h: 'priority_queue',
        p: 'Default is a max-heap. For a min-heap, pass greater<>.',
        code: `priority_queue<int> maxh;
priority_queue<int, vector<int>, greater<int>> minh;

// min-heap of {dist, node}
priority_queue<pair<int,int>,
               vector<pair<int,int>>,
               greater<pair<int,int>>> pq;
pq.push({0, src});
auto [d, u] = pq.top(); pq.pop();`,
      },
      {
        h: 'lower_bound and upper_bound',
        p: 'On a sorted range: lower_bound = first element >= x, upper_bound = first element > x.',
        code: `auto it = lower_bound(v.begin(), v.end(), x);
int idx = it - v.begin();     // n if not found
bool has = it != v.end() && *it == x;

int cnt = upper_bound(v.begin(), v.end(), x)
        - lower_bound(v.begin(), v.end(), x);`,
      },
      {
        h: 'set and multiset',
        code: `set<int> s = {3, 1, 4};
s.insert(2); s.erase(3);
int lo = *s.begin(), hi = *s.rbegin();

multiset<int> ms;
ms.erase(ms.find(x));  // remove ONE copy
// ms.erase(x) removes ALL copies`,
      },
      {
        h: 'deque, stack, queue',
        code: `deque<int> dq;           // both ends O(1)
dq.push_back(1); dq.push_front(0);
dq.pop_back();   dq.pop_front();
dq.front(); dq.back();

stack<int> st; st.push(1); st.top(); st.pop();
queue<int> q;  q.push(1);  q.front(); q.pop();`,
      },
      {
        h: 'Handy calls',
        code: `reverse(v.begin(), v.end());
int mx = *max_element(v.begin(), v.end());
ll sum = accumulate(v.begin(), v.end(), 0LL);
v.erase(unique(v.begin(), v.end()), v.end());
next_permutation(v.begin(), v.end());
iota(p.begin(), p.end(), 0);   // 0,1,2,...
string t = to_string(42); int y = stoi("42");`,
      },
      {
        h: 'Strings',
        code: `string s = "abc";
s.push_back('d'); s += "ef";
s.substr(1, 3);           // from 1, length 3
s.find("cd");             // string::npos if absent
char c = 'a' + 2;         // 'c'
int d = ch - '0';         // digit value
vector<int> f(26, 0); f[ch - 'a']++;`,
      },
    ],
  },
  {
    id: 'bits',
    title: 'Bits',
    intro: 'Bit i of x is (x >> i) & 1. Use 1LL << i when i can reach 31 or more.',
    blocks: [
      {
        h: 'The tricks',
        table: [
          ['Code', 'Meaning'],
          ['x & 1', 'x is odd'],
          ['(x >> i) & 1', 'bit i is set'],
          ['x | (1 << i)', 'set bit i'],
          ['x & ~(1 << i)', 'clear bit i'],
          ['x ^ (1 << i)', 'flip bit i'],
          ['x & (x - 1)', 'drop the lowest set bit'],
          ['x & -x', 'keep only the lowest set bit'],
          ['x && !(x & (x - 1))', 'x is a power of 2'],
          ['x | (x + 1)', 'set the rightmost unset bit'],
          ['__builtin_popcount(x)', 'number of set bits (ll: popcountll)'],
          ['__builtin_ctz(x)', 'trailing zeros (x != 0)'],
          ['31 - __builtin_clz(x)', 'index of highest set bit'],
        ],
      },
      {
        h: 'XOR facts',
        p: 'a ^ a = 0, a ^ 0 = a, and order does not matter. XOR of all elements cancels pairs, so the single one is left.',
        code: `int single = 0;
for (int x : a) single ^= x;

// XOR of 1..n in O(1)
int xorTo(int n) {
  int r = n % 4;
  return r == 0 ? n : r == 1 ? 1 : r == 2 ? n + 1 : 0;
}
// XOR of L..R = xorTo(R) ^ xorTo(L - 1)`,
      },
      {
        h: 'All subsets with a mask',
        code: `int n = a.size();
for (int mask = 0; mask < (1 << n); mask++) {
  vector<int> sub;
  for (int i = 0; i < n; i++)
    if (mask >> i & 1) sub.push_back(a[i]);
}  // O(n · 2^n)

// submasks of m, without m == 0
for (int s = m; s; s = (s - 1) & m) { }`,
      },
      {
        h: 'Count set bits by hand',
        code: `int cnt = 0;
while (x) { x &= x - 1; cnt++; }  // O(set bits)`,
      },
    ],
  },
  {
    id: 'math',
    title: 'Math',
    intro: 'Overflow is the most common silent bug. If a product can pass about 2·10^9, use long long.',
    blocks: [
      {
        h: 'Overflow',
        p: 'int holds up to about 2.1·10^9. long long holds up to about 9.2·10^18. Cast before you multiply, not after.',
        code: `int a = 100000, b = 100000;
ll bad  = a * b;          // overflows first
ll good = 1LL * a * b;    // 10^10, correct
int mid = lo + (hi - lo) / 2;  // safe midpoint`,
      },
      {
        h: 'gcd and lcm',
        code: `ll g = gcd(a, b);           // C++17 <numeric>
ll l = a / gcd(a, b) * b;   // divide first

ll mygcd(ll a, ll b) {      // Euclid, O(log)
  return b == 0 ? a : mygcd(b, a % b);
}`,
      },
      {
        h: 'Modulo 1e9+7',
        p: 'Take % after every + and *. For subtraction, add MOD before %, so the result is not negative.',
        code: `const ll MOD = 1e9 + 7;
ll add(ll a, ll b) { return (a + b) % MOD; }
ll sub(ll a, ll b) { return (a - b + MOD) % MOD; }
ll mul(ll a, ll b) { return a % MOD * (b % MOD) % MOD; }`,
      },
      {
        h: 'Fast power',
        p: 'Square the base and halve the exponent: O(log e). Inverse of a mod prime p is a^(p-2).',
        code: `ll power(ll b, ll e, ll m = MOD) {
  ll r = 1; b %= m;
  while (e > 0) {
    if (e & 1) r = r * b % m;
    b = b * b % m;
    e >>= 1;
  }
  return r;
}
ll inv(ll a) { return power(a, MOD - 2); }`,
      },
      {
        h: 'Primes',
        code: `bool isPrime(ll n) {         // O(sqrt n)
  if (n < 2) return false;
  for (ll i = 2; i * i <= n; i++)
    if (n % i == 0) return false;
  return true;
}

// Sieve: all primes <= n in O(n log log n)
vector<bool> sieve(int n) {
  vector<bool> p(n + 1, true);
  p[0] = false; if (n >= 1) p[1] = false;
  for (int i = 2; 1LL * i * i <= n; i++)
    if (p[i])
      for (int j = i * i; j <= n; j += i)
        p[j] = false;
  return p;
}`,
      },
      {
        h: 'Divisors',
        p: 'Divisors come in pairs (i, n / i), so loop only to sqrt(n).',
        code: `for (ll i = 1; i * i <= n; i++)
  if (n % i == 0) {
    ds.push_back(i);
    if (i != n / i) ds.push_back(n / i);
  }`,
      },
      {
        h: 'nCr',
        code: `// Pascal: C[n][r] = C[n-1][r-1] + C[n-1][r]
// Single value without overflow (small n):
ll nCr(int n, int r) {
  r = min(r, n - r);
  ll res = 1;
  for (int i = 1; i <= r; i++)
    res = res * (n - r + i) / i;   // exact each step
  return res;
}`,
      },
      {
        h: 'Formulas',
        table: [
          ['What', 'Formula'],
          ['1 + 2 + … + n', 'n(n+1)/2'],
          ['1² + … + n²', 'n(n+1)(2n+1)/6'],
          ['Subarrays of n', 'n(n+1)/2'],
          ['Subsequences of n', '2^n'],
          ['Digits of n', 'floor(log10 n) + 1'],
          ['Ceil of a / b (positive)', '(a + b - 1) / b'],
        ],
      },
    ],
  },
  {
    id: 'templates',
    title: 'Templates',
    intro: 'Skeletons to write from memory. Know why each line is there.',
    blocks: [
      {
        h: 'Binary search (first true)',
        p: 'Works for "search on answer" too: write ok(x) that is false, false, …, true, true.',
        code: `int lo = LOW, hi = HIGH, ans = -1;
while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (ok(mid)) { ans = mid; hi = mid - 1; }
  else lo = mid + 1;
}`,
      },
      {
        h: 'Sliding window (longest valid)',
        code: `int l = 0, best = 0;
for (int r = 0; r < n; r++) {
  add(a[r]);
  while (!valid()) remove(a[l++]);
  best = max(best, r - l + 1);
}
// "count subarrays with exactly K"
// = atMost(K) - atMost(K - 1)`,
      },
      {
        h: 'Two pointers on sorted data',
        code: `int i = 0, j = n - 1;
while (i < j) {
  int s = a[i] + a[j];
  if (s == target) { /* found */ i++; j--; }
  else if (s < target) i++;
  else j--;
}`,
      },
      {
        h: 'Prefix sum + hash map',
        code: `unordered_map<ll, int> seen{{0, 1}};
ll pre = 0; int cnt = 0;
for (int x : a) {
  pre += x;
  if (seen.count(pre - k)) cnt += seen[pre - k];
  seen[pre]++;
}`,
      },
      {
        h: 'Backtracking',
        code: `vector<int> cur;
void go(int i) {
  if (i == n) { res.push_back(cur); return; }
  cur.push_back(a[i]);   // take
  go(i + 1);
  cur.pop_back();        // undo
  go(i + 1);             // skip
}`,
      },
      {
        h: 'Graph DFS',
        code: `vector<vector<int>> adj(n);
vector<int> vis(n, 0);
void dfs(int u) {
  vis[u] = 1;
  for (int v : adj[u])
    if (!vis[v]) dfs(v);
}`,
      },
      {
        h: 'Grid BFS',
        code: `int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};
queue<pair<int,int>> q;
vector<vector<int>> dist(R, vector<int>(C, -1));
q.push({sr, sc}); dist[sr][sc] = 0;
while (!q.empty()) {
  auto [r, c] = q.front(); q.pop();
  for (int k = 0; k < 4; k++) {
    int nr = r + dr[k], nc = c + dc[k];
    if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
    if (g[nr][nc] == '#' || dist[nr][nc] != -1) continue;
    dist[nr][nc] = dist[r][c] + 1;
    q.push({nr, nc});
  }
}`,
      },
      {
        h: 'Topological sort (Kahn)',
        code: `vector<int> indeg(n, 0), order;
for (int u = 0; u < n; u++)
  for (int v : adj[u]) indeg[v]++;
queue<int> q;
for (int u = 0; u < n; u++)
  if (indeg[u] == 0) q.push(u);
while (!q.empty()) {
  int u = q.front(); q.pop();
  order.push_back(u);
  for (int v : adj[u])
    if (--indeg[v] == 0) q.push(v);
}
// order.size() < n  ->  there is a cycle`,
      },
      {
        h: 'Dijkstra',
        code: `vector<ll> dist(n, LLONG_MAX);
priority_queue<pair<ll,int>, vector<pair<ll,int>>,
               greater<pair<ll,int>>> pq;
dist[src] = 0; pq.push({0, src});
while (!pq.empty()) {
  auto [d, u] = pq.top(); pq.pop();
  if (d > dist[u]) continue;       // stale entry
  for (auto [v, w] : adj[u])
    if (d + w < dist[v]) {
      dist[v] = d + w;
      pq.push({dist[v], v});
    }
}`,
      },
      {
        h: 'Union-find',
        code: `struct DSU {
  vector<int> p, sz;
  DSU(int n) : p(n), sz(n, 1) {
    iota(p.begin(), p.end(), 0);
  }
  int find(int x) {
    return p[x] == x ? x : p[x] = find(p[x]);
  }
  bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (sz[a] < sz[b]) swap(a, b);
    p[b] = a; sz[a] += sz[b];
    return true;
  }
};`,
      },
      {
        h: 'Memo DP',
        p: 'Write the recursion first, then add the memo, then turn it into a table if you need to.',
        code: `vector<vector<int>> dp(n, vector<int>(m, -1));
int f(int i, int j) {
  if (i < 0 || j < 0) return BASE;
  int& r = dp[i][j];
  if (r != -1) return r;
  return r = /* combine f(i-1, j), f(i, j-1)... */;
}`,
      },
      {
        h: 'Linked list: fast and slow',
        code: `ListNode *slow = head, *fast = head;
while (fast && fast->next) {
  slow = slow->next;
  fast = fast->next->next;
  if (slow == fast) { /* cycle */ }
}
// no cycle: slow is the middle`,
      },
      {
        h: 'Monotonic stack (next greater)',
        code: `vector<int> nge(n, -1);
stack<int> st;               // indices
for (int i = n - 1; i >= 0; i--) {
  while (!st.empty() && a[st.top()] <= a[i])
    st.pop();
  if (!st.empty()) nge[i] = a[st.top()];
  st.push(i);
}`,
      },
    ],
  },
  {
    id: 'stuck',
    title: 'When stuck',
    intro: 'A fixed routine beats staring. Follow the solving line on the Ride screen.',
    blocks: [
      {
        h: 'Before you code',
        p: '1. Read the constraints and pick the Big-O target. 2. Do two small examples by hand. 3. Say the brute force out loud. 4. Ask what work the brute force repeats, and how to stop repeating it.',
      },
      {
        h: 'Questions that unlock problems',
        table: [
          ['If you see', 'Think'],
          ['Sorted array, or "minimum maximum"', 'Binary search (on the answer)'],
          ['Contiguous subarray or substring', 'Sliding window, prefix sum'],
          ['Pairs in a sorted array', 'Two pointers'],
          ['"Have I seen this before?"', 'Hash map / set'],
          ['All combinations, n ≤ 20', 'Backtracking, bitmask'],
          ['Next greater / smaller', 'Monotonic stack'],
          ['k largest / smallest, stream', 'Heap'],
          ['Shortest path, unweighted', 'BFS'],
          ['Dependencies, order', 'Topological sort'],
          ['Groups merging', 'Union-find'],
          ['Count ways, min/max over choices', 'DP: define the state first'],
        ],
      },
      {
        h: 'Using the video well',
        p: 'Watch only until the idea clicks, then pause and code it yourself. If you watched the full solution, close it and write the code from memory. Then write your note: the key idea in one sentence and the mistake you made.',
      },
    ],
  },
]
