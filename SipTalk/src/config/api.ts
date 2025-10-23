/**
 * API Configuration for connecting React frontend to PHP backend
 * 
 * NOTE: React cannot directly connect to MySQL databases.
 * The db.php file remains on your PHP server and handles database operations.
 * React communicates with PHP backend through HTTP requests.
 */

// API Configuration
export const API_CONFIG = {
  // Toggle between development and production
  USE_BACKEND: false, // Set to true when connecting to actual PHP backend
  
  // Base URL for your PHP backend
  // For XAMPP, this would typically be: http://localhost/Aeron%20Coffee%20Shop/
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost',
  
  // API Endpoints (your PHP files)
  ENDPOINTS: {
    LOGIN: '/login.php',
    REGISTER: '/register.php',
    LOGOUT: '/logout.php',
    RESERVATION: '/reservation.php',
    // Add more endpoints as needed
  },
  
  // Database info (for reference only - actual connection happens in db.php)
  DB_INFO: {
    servername: 'localhost',
    username: 'root',
    password: '',
    dbname: 'sip_talk_db'
  }
};

/**
 * Make an API request to PHP backend
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // Include cookies for session management
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * POST request helper
 */
export const apiPost = async (
  endpoint: string,
  data: Record<string, any>
): Promise<Response> => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });

  return apiRequest(endpoint, {
    method: 'POST',
    body: formData
  });
};

/**
 * GET request helper
 */
export const apiGet = async (endpoint: string): Promise<Response> => {
  return apiRequest(endpoint, {
    method: 'GET'
  });
};

/**
 * Parse PHP response (handles both JSON and HTML responses)
 */
export const parsePhpResponse = async (response: Response): Promise<any> => {
  const text = await response.text();
  
  try {
    // Try to parse as JSON first
    return JSON.parse(text);
  } catch {
    // If not JSON, return the text (likely HTML with script tags from PHP)
    return text;
  }
};

