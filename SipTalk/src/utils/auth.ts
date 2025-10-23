// Authentication utility functions

export interface UserSession {
  user_id: number;
  fullname: string;
  email: string;
  loggedin: boolean;
  timestamp: number;
}

/**
 * Login a user and create session
 */
export const loginUser = (userData: { fullname: string; email: string; id: number }): void => {
  const sessionData: UserSession = {
    user_id: userData.id,
    fullname: userData.fullname,
    email: userData.email,
    loggedin: true,
    timestamp: Date.now()
  };
  
  localStorage.setItem('user_session', JSON.stringify(sessionData));
  localStorage.setItem('loggedin', '1');
  
  // Trigger auth change event
  window.dispatchEvent(new Event('authChange'));
};

/**
 * Logout user - equivalent to logout.php
 * Destroys session and clears cookie
 */
export const logoutUser = (): void => {
  // Clear session storage (equivalent to session_destroy())
  localStorage.removeItem('user_session');
  
  // Clear the 'loggedin' cookie (equivalent to setcookie with past time)
  localStorage.removeItem('loggedin');
  
  // Clear any other auth-related data
  sessionStorage.clear();
  
  // Trigger auth change event
  window.dispatchEvent(new Event('authChange'));
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = (): boolean => {
  const session = localStorage.getItem('user_session');
  const loggedInFlag = localStorage.getItem('loggedin');
  
  return !!(session && loggedInFlag === '1');
};

/**
 * Get current user session
 */
export const getCurrentUser = (): UserSession | null => {
  const session = localStorage.getItem('user_session');
  
  if (!session) {
    return null;
  }
  
  try {
    return JSON.parse(session);
  } catch (error) {
    console.error('Error parsing user session:', error);
    return null;
  }
};

/**
 * Check if session is expired (optional - 1 hour timeout)
 */
export const isSessionExpired = (): boolean => {
  const user = getCurrentUser();
  
  if (!user) {
    return true;
  }
  
  const ONE_HOUR = 3600 * 1000; // 1 hour in milliseconds
  const now = Date.now();
  
  return (now - user.timestamp) > ONE_HOUR;
};

/**
 * Refresh session timestamp
 */
export const refreshSession = (): void => {
  const user = getCurrentUser();
  
  if (user) {
    user.timestamp = Date.now();
    localStorage.setItem('user_session', JSON.stringify(user));
  }
};

