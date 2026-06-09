import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNotifications as fetchNotificationsApi } from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children, profile }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState(null);
    
    // Centralized states for dashboard views
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Defaulting to profile.apiToken if available, but allows testing without one
            const data = await fetchNotificationsApi(profile?.apiToken);
            setNotifications(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, [profile?.apiToken]);

    useEffect(() => {
        loadNotifications();
        
        // Polling every 15 seconds to simulate a live system
        const interval = setInterval(() => {
            setIsPolling(true);
            fetchNotificationsApi(profile?.apiToken)
                .then(data => {
                    // Just take 1 random notification from the fetched payload and prepend it
                    if (data && data.length > 0) {
                        const newNotice = { ...data[0], id: Math.random().toString(), read: false, timestamp: 'Just now', parsedTime: Date.now() };
                        setNotifications(prev => {
                            // Only add if it's not a duplicate title in the top 5
                            if (prev.slice(0, 5).some(n => n.title === newNotice.title)) return prev;
                            
                            // Highlight it visually if possible in UI by setting a special flag, but for now just unshift
                            return [newNotice, ...prev];
                        });
                    }
                })
                .catch(err => console.error("Background fetch failed", err))
                .finally(() => {
                    setTimeout(() => setIsPolling(false), 1000); // Keep loader visible briefly
                });
        }, 20000); // 20 seconds
        
        return () => clearInterval(interval);
    }, [loadNotifications]);

    const toggleReadStatus = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // Filter and Search logic
    const filteredNotifications = notifications.filter(n => {
        const matchesSearch = 
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            n.body.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || n.type === filter;
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const paginatedNotifications = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const value = {
        notifications,
        loading,
        isPolling,
        error,
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        filteredNotifications,
        paginatedNotifications,
        toggleReadStatus,
        markAllAsRead,
        refreshNotifications: loadNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
