import axios from "axios";

// Create axios instance with base URL from environment variables
// Do not set a global Content-Type so axios can infer based on payload (JSON vs FormData)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different HTTP error statuses
      if (error.response.status === 401) {
        // Only redirect to login if we have a token (meaning session expired)
        // Don't redirect during login/register attempts
        const token = localStorage.getItem("token");
        const currentPath = window.location.pathname;
        if (
          token &&
          !currentPath.includes("/login") &&
          !currentPath.includes("/register")
        ) {
          // Session expired - redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  // Add other auth-related API calls here
};

// Events API
export const eventsAPI = {
  getAllEvents: (params = {}) => api.get("/events", { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  // eventData can be plain object or FormData. If FormData, let axios set multipart headers.
  createEvent: (eventData) => {
    return api.post("/events", eventData);
  },
  updateEvent: (id, eventData) => {
    return api.put(`/events/${id}`, eventData);
  },
  deleteEvent: (id) => api.delete(`/events/${id}`),
  // Add other event-related API calls here
};

// Student API
export const studentAPI = {
  getProfile: () => api.get("/student/profile"),
  updateProfile: (profileData) => api.put("/student/profile", profileData),
  getMyRegistrations: () => api.get("/student/my-registrations"),
  registerForEvent: (eventId, payload = {}) =>
    api.post(`/student/register/${eventId}`, payload),
  requestPermission: ({ registrationId, reasonForAttending, teamMembers }) =>
    api.post("/student/request-permission", {
      registrationId,
      reasonForAttending,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
    }),
};

// Host API
export const hostAPI = {
  getMyEvents: () => api.get("/host/my-events"),
  getRegistrationsForEvent: (eventId) =>
    api.get(`/host/events/${eventId}/registrations`),
  selectStudent: (regId) => api.post(`/host/registrations/${regId}/select`),
  rejectStudent: (regId, feedback = "") =>
    api.post(`/host/registrations/${regId}/reject`, { feedback }),
};

// Admin API
export const adminAPI = {
  getPendingRequests: () => api.get("/admin/pending-requests"),
  getApprovedRequests: () => api.get("/admin/approved-requests"),
  approveRequest: (reqId, feedback) =>
    api.post(`/admin/requests/${reqId}/approve`, { feedback }),
  rejectRequest: (reqId, feedback) =>
    api.post(`/admin/requests/${reqId}/reject`, { feedback }),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
