import axios from "axios";

// Base URL is typically set via axios interceptors or env variable
// Assuming VITE_API_BASE_URL is set in .env
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
    baseURL: `${API_URL}/slot-booking`,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken"); // Correct key is authToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Stats ---
export const getBookingStats = async () => {
    const response = await api.get("/bookings/stats");
    return response.data;
};

// --- Exams ---
export const getAllExams = async () => {
    const response = await api.get("/exams");
    return response.data;
};

export const getExamById = async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
};

export const createExam = async (examData) => {
    const response = await api.post("/exams", examData);
    return response.data;
};

export const updateExam = async (id, examData) => {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
};

export const deleteExam = async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
};

// --- Centers ---
export const getAllCenters = async () => {
    const response = await api.get("/centers");
    return response.data;
};

export const getCenterById = async (id) => {
    const response = await api.get(`/centers/${id}`);
    return response.data;
};

export const createCenter = async (centerData) => {
    const response = await api.post("/centers", centerData);
    return response.data;
};

export const updateCenter = async (id, centerData) => {
    const response = await api.put(`/centers/${id}`, centerData);
    return response.data;
};

export const deleteCenter = async (id) => {
    const response = await api.delete(`/centers/${id}`);
    return response.data;
};

export const getCentersByExamId = async (examId) => {
    const response = await api.get(`/centers/exam/${examId}`);
    return response.data;
};

// --- Slots ---
export const getAllSlots = async () => {
    const response = await api.get("/slots");
    return response.data;
};

export const getSlotById = async (id) => {
    const response = await api.get(`/slots/${id}`);
    return response.data;
};

export const createSlot = async (slotData) => {
    const response = await api.post("/slots", slotData);
    return response.data;
};

export const updateSlot = async (id, slotData) => {
    const response = await api.put(`/slots/${id}`, slotData);
    return response.data;
};

export const deleteSlot = async (id) => {
    const response = await api.delete(`/slots/${id}`);
    return response.data;
};

export const getSlotsByExamId = async (examId) => {
    const response = await api.get(`/slots/exam/${examId}`);
    return response.data;
};

export const getSlotsByCenterId = async (centerId) => {
    const response = await api.get(`/slots/center/${centerId}`);
    return response.data;
};

export const getAvailableSlots = async (examId, centerId, date) => {
    const response = await api.get(`/slots/max-availability`, {
        params: { examId, centerId, date }
    });
    return response.data;
};


// --- Bookings ---
export const getAllBookings = async () => {
    const response = await api.get("/bookings");
    return response.data;
};

export const getBookingById = async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
};

export const updateBooking = async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
};

export const cancelBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
};

export const deleteBooking = async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
};


export default api;
