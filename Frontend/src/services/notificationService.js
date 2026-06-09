const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Standardizes the notification object format.
 */
const standardizeNotification = (n) => ({
    id: n.ID || n.id,
    title: n.Message || n.title || 'Campus Notice',
    body: n.Message || n.body || 'New campus announcement received.',
    type: n.Type || n.type || 'Event',
    date: n.Timestamp || n.date || 'Today',
    timestamp: n.Timestamp || n.timestamp || 'Just now',
    read: false,
    views: Math.floor(Math.random() * 200) + 12,
    criteria: n.Type === 'Placement' ? 'CS/IT branch, CGPA >= 8.0' : 'All students',
    actionLabel: n.Type === 'Placement' ? 'Apply Now' : n.Type === 'Result' ? 'View Grade' : 'Register Event'
});

/**
 * Computes priority score based on weight and recency.
 */
const computePriorityScores = (notifications) => {
    const weights = { 'Placement': 3.0, 'Result': 2.0, 'Event': 1.0 };
    
    const withTimes = notifications.map(n => ({
        ...n,
        parsedTime: new Date(n.timestamp || Date.now()).getTime()
    }));
    
    const times = withTimes.map(n => n.parsedTime);
    const minTime = times.length ? Math.min(...times) : 0;
    const maxTime = times.length ? Math.max(...times) : 0;
    const range = maxTime - minTime;

    return withTimes.map(n => {
        const typeWeight = weights[n.type] || 1.0;
        const recency = range > 0 ? (n.parsedTime - minTime) / range : 1.0;
        const score = Math.round((typeWeight / 3.0) * 60 + recency * 40);
        
        // Remove temporary parsedTime to keep objects clean
        const { parsedTime, ...rest } = n;
        return { ...rest, score };
    });
};

/**
 * Fetches notifications with retry logic.
 */
export const fetchNotifications = async (apiToken, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Use our new realistic local API or external API
            const endpoint = API_URL === '/api' ? '/api/notifications.json' : `${API_URL}/notifications?limit=100`;
            const res = await fetch(endpoint, {
                headers: {
                    ...(apiToken && API_URL !== '/api' ? { 'Authorization': `Bearer ${apiToken}` } : {})
                }
            });

            if (!res.ok) {
                throw new Error(`API response error: ${res.status}`);
            }

            const data = await res.json();
            
            if (data && data.notifications) {
                const mapped = data.notifications.map(n => ({
                    id: n.id,
                    title: n.title,
                    body: n.body,
                    type: n.type,
                    date: new Date(n.timestamp).toLocaleDateString(),
                    timestamp: new Date(n.timestamp).getTime() > Date.now() - 86400000 
                        ? 'Today' 
                        : 'A few days ago',
                    read: false,
                    views: Math.floor(Math.random() * 200) + 12,
                    criteria: n.type === 'Placement' ? 'CS/IT branch, CGPA >= 8.0' : 'All students',
                    actionLabel: n.type === 'Placement' ? 'Apply Now' : n.type === 'Result' ? 'View Grade' : 'Register Event',
                    rawTimestamp: n.timestamp
                }));
                
                // Re-calculate pseudo-timestamps to match the old ones for computing priority smoothly
                const mappedWithTimes = mapped.map(n => ({
                    ...n,
                    parsedTime: new Date(n.rawTimestamp).getTime()
                }));
                return computePriorityScores(mappedWithTimes);
            }
            
            return []; // empty state
            
        } catch (err) {
            console.error(`Fetch notifications failed (attempt ${attempt}/${retries}):`, err);
            if (attempt === retries) {
                throw err;
            }
            // Wait for 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
};
