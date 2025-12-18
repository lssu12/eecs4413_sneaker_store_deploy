import axios from 'axios';
import { BASE_URL } from "../Util/util";


const registerUser = async (registration) => {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, registration);
    return response.data;
};

const loginUser = async (loginDetails) => {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginDetails);
    const data = response.data;

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.customerId); 

        // Save full user info for Profile page
        localStorage.setItem("user", JSON.stringify({
            id: data.customerId,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            addressLine1: data.addressLine1 || "",
            addressLine2: data.addressLine2 || "",
            city: data.city || "",
            province: data.province || "",
            postalCode: data.postalCode || "",
            country: data.country || ""
        }));
    }

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

const isAuthenticated = () => !!localStorage.getItem("token");
const isAdmin = () => localStorage.getItem("role") === "ADMIN";

export default { 
    registerUser, 
    loginUser, 
    logoutUser, 
    isAuthenticated, 
    isAdmin, 
    getCurrentUser, 
    updateProfile 
};
