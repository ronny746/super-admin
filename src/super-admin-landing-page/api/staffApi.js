import axiosClient from "./axios_client";

export const createStaff = async (staffData) => {
    // Backend expects 'name' now (simplified in recent steps)
    const response = await axiosClient.post("/auth/register", staffData);
    return response.data;
};

export const getStaff = async () => {
    const response = await axiosClient.get("/lead-management/staff");
    return response.data;
};

export const deleteStaff = async (staffId) => {
    const response = await axiosClient.delete(`/users/staff/${staffId}`);
    return response.data;
};
