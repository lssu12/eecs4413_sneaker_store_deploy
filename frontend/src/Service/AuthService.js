import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const buildUserProfile = (data = {}) => ({
    id: data.customerId ?? data.id ?? null,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    addressLine1: data.addressLine1 || "",
    addressLine2: data.addressLine2 || "",
    city: data.city || "",
    province: data.province || "",
    postalCode: data.postalCode || "",
    country: data.country || "",
    billingAddressLine1: data.billingAddressLine1 || "",
    billingAddressLine2: data.billingAddressLine2 || "",
    billingCity: data.billingCity || "",
    billingProvince: data.billingProvince || "",
    billingPostalCode: data.billingPostalCode || "",
    billingCountry: data.billingCountry || "",
    creditCardHolder: data.creditCardHolder || "",
    creditCardNumber: data.creditCardNumber || "",
    creditCardExpiry: data.creditCardExpiry || "",
    creditCardCvv: data.creditCardCvv || "",
});

const persistSession = (data = {}) => {
    if (!data.token || !data.customerId) {
        return;
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.customerId);
    localStorage.setItem("role", data.role || 'CUSTOMER');
    localStorage.setItem("user", JSON.stringify(buildUserProfile(data)));
};

const registerUser = async (registration) => {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, registration);
    return response.data;
};

const loginUser = async (loginDetails) => {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginDetails);
    const data = response.data;

    persistSession(data);

    return data;
};

// Read full user info from localStorage
const getCurrentUser = () => {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;

    try {
        return JSON.parse(userJson);
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        return null;
    }
};

const updateCachedUser = (updates = {}) => {
    const current = getCurrentUser() || {};
    const next = { ...current, ...updates };
    localStorage.setItem("user", JSON.stringify(next));
    return next;
};

const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
};

const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");

    const response = await axios.put(
        `${BASE_URL}/api/auth/profile`,
        profileData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    // Update localStorage with new profile info if update was successful
    if (response.data.success) {
        const currentUser = getCurrentUser();
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return response.data;
};

const getProfile = async (customerId) => {
    const response = await axios.get(`${BASE_URL}/api/auth/profile/${customerId}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const changePassword = async (payload) => {
    const response = await axios.put(
        `${BASE_URL}/api/auth/password`,
        payload,
        { headers: getAuthHeader() }
    );
    return response.data;
};

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const isAuthenticated = () => !!localStorage.getItem("token");
const isAdmin = () => localStorage.getItem("role") === "ADMIN";

export default { 
    registerUser, 
    loginUser, 
    logoutUser, 
    isAuthenticated, 
    isAdmin, 
    getCurrentUser, 
    updateProfile,
    getProfile,
    getAuthHeader,
    changePassword,
    persistSession,
    updateCachedUser,
};
