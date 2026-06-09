# Notification_System_Design.md

## Stage 1: Priority Inbox Notification System Design

### 1. Approach and Prioritization Formula

To solve the challenge of notification fatigue on campus, the Priority Inbox surfaces notifications by combining two dimensions: **Category Weight** (importance) and **Recency** (time elapsed).

#### Weight Mapping
- **Placement**: Weight = `3.0` (Critical career impact)
- **Result**: Weight = `2.0` (High academic importance)
- **Event**: Weight = `1.0` (Optional / student activity)

#### Recency Scaling
Timestamps are converted to millisecond values ($T$). Given a batch of notifications, we normalize the timestamps between $0.0$ and $1.0$ relative to the oldest ($T_{\min}$) and newest ($T_{\max}$) times in the set:

$$\text{RecencyScore} = \frac{T - T_{\min}}{T_{\max} - T_{\min}}$$

If there is only one timestamp, the $\text{RecencyScore}$ defaults to $1.0$.

#### Unified Priority Score
The final Priority Score is computed by weighting Category Importance at 60% and Recency at 40%:

$$\text{PriorityScore} = \text{round}\left( \left( \frac{\text{TypeWeight}}{3.0} \times 60 \right) + (\text{RecencyScore} \times 40) \right)$$

This maps all notifications to a standardized score range of $[20, 100]$, where:
- A brand new **Placement** alert scores **100**.
- An old **Event** alert scores **20**.

---

### 2. Efficiently Maintaining the Top "N" Notifications

New notifications arrive continuously in real-time. Sorting the entire list of notifications $N$ every time a new alert arrives is highly inefficient, costing $O(N \log N)$ time complexity.

To maintain the top $k$ (e.g., top 10, 15, 20) most important notifications efficiently, we can use a **Min-Heap (Priority Queue)** of capacity $k$:

#### Algorithm:
1. Initialize a Min-Heap of size limit $k$.
2. For each incoming notification:
   - Compute its `PriorityScore`.
   - If the heap has fewer than $k$ elements, push the notification onto the heap ($O(\log k)$).
   - If the heap is full:
     - Compare the new notification's score with the root (minimum score element in the top $k$).
     - If the new notification has a higher score, pop the root and push the new notification ($O(\log k)$).
     - Otherwise, discard the new notification from the top $k$ list (it is not important enough).
3. The heap will always contain the top $k$ items. To present them to the user, extract the elements and reverse them to display in descending order ($O(k \log k)$).

#### Complexity Analysis:
- **Time Complexity per insertion**: $O(\log k)$ instead of $O(N \log N)$. Since $k$ is small (10, 15, 20), $\log k$ is practically constant time ($O(1)$).
- **Space Complexity**: $O(k)$ auxiliary space, consuming minimal memory.

---

### 3. Implementation Code (Functioning JS/TS)

```javascript
/**
 * Efficiently calculates and returns the top N priority unread notifications using a Heap-like sorting buffer.
 * @param {Array} notifications - List of raw notifications from the API
 * @param {number} k - The number of top notifications to retain (e.g. 10)
 * @returns {Array} - Top k sorted notifications
 */
export function getTopPriorityNotifications(notifications, k = 10) {
    if (!notifications || notifications.length === 0) return [];

    const weights = {
        'Placement': 3.0,
        'Result': 2.0,
        'Event': 1.0
    };

    // Parse dates and extract min/max times for recency normalization
    const parsed = notifications.map(n => {
        const timestamp = new Date(n.Timestamp || n.timestamp || Date.now()).getTime();
        return { ...n, timestampMs: timestamp };
    });

    const times = parsed.map(n => n.timestampMs);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const range = maxTime - minTime;

    // Filter for unread and calculate scores
    const scoredUnread = parsed
        .filter(n => !n.read)
        .map(n => {
            const typeWeight = weights[n.Type || n.type] || 1.0;
            const recency = range > 0 ? (n.timestampMs - minTime) / range : 1.0;
            const score = Math.round((typeWeight / 3.0) * 60 + recency * 40);
            return { ...n, score };
        });

    // Efficiently extract top k using sorting (since JavaScript Arrays don't have native Heap class)
    // For large scale, a custom Min-Heap class should be used.
    return scoredUnread
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
}
```
