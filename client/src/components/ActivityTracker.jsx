import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ActivityTracker() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const lastActiveRef = useRef(Date.now());
  const isInactiveRef = useRef(false);
  const activePageRef = useRef('');
  const isNewVisitRef = useRef(true);

  // Inactivity timeout: 5 minutes = 300,000 milliseconds
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000;
  // Heartbeat interval: 30 seconds = 30,000 milliseconds
  const HEARTBEAT_INTERVAL = 30 * 1000;

  // Map pathname to Page Name
  const getPageName = (pathname) => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/topic/')) return 'Video';
    if (pathname === '/assessments') return 'Assessment';
    if (pathname.startsWith('/notes')) return 'Notes';
    if (pathname.startsWith('/code') || pathname.startsWith('/zero-to-coding') || pathname.startsWith('/roadmap')) return 'Coding';
    if (pathname === '/profile') return 'Profile';
    return 'Dashboard';
  };

  // Activity detection handler
  const resetInactivity = () => {
    lastActiveRef.current = Date.now();
    if (isInactiveRef.current) {
      isInactiveRef.current = false;
      // Immediately send heartbeat to resume session tracking
      sendHeartbeat(5); // Send a 5 seconds catch-up active time
    }
  };

  // Core Heartbeat Sender
  const sendHeartbeat = async (overrideSeconds = null) => {
    if (!isAuthenticated || !user) return;

    // Check inactivity
    const timeSinceLastActive = Date.now() - lastActiveRef.current;
    if (timeSinceLastActive > INACTIVITY_TIMEOUT) {
      isInactiveRef.current = true;
      return;
    }

    const activeTime = overrideSeconds !== null ? overrideSeconds : 30; // seconds
    const pageName = activePageRef.current || getPageName(location.pathname);
    const isNewVisit = isNewVisitRef.current;
    
    // Consume isNewVisit
    isNewVisitRef.current = false;

    // Retrieve global video analytics if available
    let videoAnalytics = null;
    if (window.cf_videoAnalytics && window.cf_videoAnalytics.videoId) {
      videoAnalytics = { ...window.cf_videoAnalytics };
      // Reset watchTime accumulator
      window.cf_videoAnalytics.watchTime = 0;
    }

    // Retrieve global assessment analytics if available
    let assessmentAnalytics = null;
    if (window.cf_assessmentAnalytics && window.cf_assessmentAnalytics.assessmentId) {
      assessmentAnalytics = { ...window.cf_assessmentAnalytics };
      // Reset timeSpent accumulator
      window.cf_assessmentAnalytics.timeSpent = 0;
    }

    try {
      await api.post('/activity/heartbeat', {
        pageName,
        activeTime,
        isNewVisit,
        videoAnalytics,
        assessmentAnalytics
      });
    } catch (err) {
      console.error('Failed to send activity heartbeat:', err.message);
    }
  };

  // Set up activity event listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, resetInactivity));

    // Start 30s heartbeat loop
    const intervalId = setInterval(() => {
      sendHeartbeat();
    }, HEARTBEAT_INTERVAL);

    // End session on window unload
    const handleUnload = () => {
      const token = localStorage.getItem('cf_token');
      if (token) {
        // Send a synchronous beacon or fetch with keepalive to end session
        fetch('/api/activity/session/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          keepalive: true
        });
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetInactivity));
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isAuthenticated, user]);

  // Track page navigation changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const newPage = getPageName(location.pathname);
    
    // If transitioning page, send final heartbeat for previous page
    if (activePageRef.current && activePageRef.current !== newPage) {
      // Calculate active seconds on previous page since last heartbeat
      const elapsedSeconds = Math.min(30, Math.round((Date.now() - lastActiveRef.current) / 1000));
      sendHeartbeat(Math.max(1, elapsedSeconds));
      isNewVisitRef.current = true;
    }
    
    activePageRef.current = newPage;
  }, [location.pathname, isAuthenticated]);

  return null; // Component does not render any visual UI
}
