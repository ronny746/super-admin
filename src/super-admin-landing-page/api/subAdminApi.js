import axiosClient from "./axios_client";

export const getSubAdmins = async () => {
    const response = await axiosClient.get("/users/sub-admin");
    return response.data;
};

export const createSubAdmin = async (data) => {
    const response = await axiosClient.post("/users/sub-admin", data);
    return response.data;
};

export const updateSubAdmin = async (id, data) => {
    const response = await axiosClient.put(`/users/sub-admin/${id}`, data);
    return response.data;
};

export const deleteSubAdmin = async (id) => {
    const response = await axiosClient.delete(`/users/sub-admin/${id}`);
    return response.data;
};
