import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: `${API_BASE_URL}/test-system`,
});

// Add token to requests if exists
api.interceptors.request.use((config) => {
    // Check path to decide token priority
    const isStudentRoute = config.url.startsWith('/exam');
    
    let token = null;
    
    if (isStudentRoute) {
        // For student exam routes, prioritize testToken
        token = localStorage.getItem("testToken") || 
                localStorage.getItem("authToken");
    } else {
        // For admin management routes (Bank, Questions, etc), prioritize authToken
        token = localStorage.getItem("authToken") || 
                localStorage.getItem("testToken");
    }
    
    // Fallback to generic keys if still no token
    if (!token) {
        token = localStorage.getItem("token") || localStorage.getItem("userToken");
    }
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn(`No authentication token found for ${config.url}`);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ==================== Test Student APIs ====================

export const createTestStudent = async (data) => {
    const response = await api.post("/students", data);
    return response.data;
};

export const getTestStudents = async (instituteId) => {
    const response = await api.get(`/students?instituteId=${instituteId}`);
    return response.data;
};

export const updateTestStudent = async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
};

export const deleteTestStudent = async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
};

export const assignTestToStudent = async (id, data) => {
    const response = await api.post(`/students/${id}/assign`, data);
    return response.data;
};

export const bulkUploadStudents = async (instituteId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('instituteId', instituteId);

    const response = await api.post('/students/bulk-upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getStudentTestHistory = async (studentId) => {
    const response = await api.get(`/students/${studentId}/test-history`);
    return response.data;
};

// ==================== Test APIs ====================

export const generateTest = async (data) => {
    const response = await api.post("/tests/generate", data);
    return response.data;
};

export const createTest = async (data) => {
    const response = await api.post("/tests", data);
    return response.data;
};

export const getTests = async (instituteId) => {
    const response = await api.get(`/tests?instituteId=${instituteId}`);
    return response.data;
};

export const getTestById = async (id) => {
    const response = await api.get(`/tests/${id}`);
    return response.data;
};

export const updateTest = async (id, data) => {
    const response = await api.put(`/tests/${id}`, data);
    return response.data;
};

export const deleteTest = async (id) => {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
};

export const getTestLink = async (id) => {
    const response = await api.get(`/tests/${id}/link`);
    return response.data;
};

export const getPublicTestInfo = async (id) => {
    const response = await api.get(`/tests/${id}/public-info`);
    return response.data;
};

// ==================== Question APIs ====================

export const importQuestions = async (formData) => {
    const response = await api.post("/questions/import", formData);
    return response.data;
};

export const previewPdfQuestions = async (file, subject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);

    const response = await api.post("/questions/preview-pdf", formData);
    return response.data;
};

export const previewWordQuestions = async (file, subject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);

    const response = await api.post("/questions/preview-word", formData);
    return response.data;
};

export const getQuestionPapers = async (instituteId) => {
    const response = await api.get(`/questions/papers?instituteId=${instituteId}`);
    return response.data;
};

export const deleteQuestionPaper = async (id) => {
    const response = await api.delete(`/questions/papers/${id}`);
    return response.data;
};

export const updatePaperDetails = async (id, data) => {
    const response = await api.put(`/questions/papers/${id}`, data);
    return response.data;
};

export const getQuestions = async (instituteId, className = "", set = "", questionPaperId = "") => {
    let url = `/questions?instituteId=${instituteId}`;
    if (className) url += `&class=${className}`;
    if (set) url += `&set=${set}`;
    if (questionPaperId) url += `&questionPaperId=${questionPaperId}`;
    const response = await api.get(url);
    return response.data;
};

export const createQuestion = async (data) => {
    const response = await api.post("/questions", data);
    return response.data;
};

export const deleteQuestion = async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
};

export const updateQuestion = async (id, data) => {
    const response = await api.put(`/questions/${id}`, data);
    return response.data;
};

export const reorderQuestions = async (questionIds) => {
    const response = await api.post("/questions/reorder", { questionIds });
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/questions/upload/image", formData);
    return response.data;
};

// ==================== Student Auth APIs ====================

export const requestOTP = async (userId, testId) => {
    const response = await api.post("/auth/request-otp", { userId, testId });
    return response.data;
};

export const verifyOTP = async (userId, otp) => {
    const response = await api.post("/auth/verify-otp", { userId, otp });
    return response.data;
};

export const guestLogin = async (data) => {
    const response = await api.post("/auth/guest-login", data);
    return response.data;
};

// ==================== Test Engine APIs ====================

export const startTest = async () => {
    const response = await api.get("/exam/start");
    return response.data;
};

export const saveAnswer = async (data) => {
    const response = await api.post("/exam/save-answer", data);
    return response.data;
};

export const submitTest = async (data) => {
    const response = await api.post("/exam/submit", data);
    return response.data;
};

export const getTimeRemaining = async (testResponseId) => {
    const response = await api.get(`/exam/time-remaining?testResponseId=${testResponseId}`);
    return response.data;
};

export const logViolation = async (data) => {
    const response = await api.post("/exam/violation", data);
    return response.data;
};

export const uploadSnapshot = async (data) => {
    const response = await api.post("/exam/snapshot", data);
    return response.data;
};

// ==================== Result APIs ====================

export const getAllResults = async (instituteId) => {
    const response = await api.get(`/results?instituteId=${instituteId}`);
    return response.data;
};

export const getResultDetail = async (id) => {
    const response = await api.get(`/results/${id}/detail`);
    return response.data;
};

export const updateReviewStatus = async (id, data) => {
    const response = await api.put(`/results/${id}/review`, data);
    return response.data;
};

export const getMyResult = async () => {
    const response = await api.get("/results/my-result");
    return response.data;
};

// ==================== Question Bank APIs ====================

export const saveToQuestionBank = async (questions, paperName) => {
    const response = await api.post("/question-bank/save", { questions, paperName });
    return response.data;
};

export const getQuestionBank = async () => {
    const response = await api.get("/question-bank");
    return response.data;
};

export const deleteQuestionBankPaper = async (paperName, pin) => {
    const response = await api.post("/question-bank/delete-paper", { paperName, pin });
    return response.data;
};
