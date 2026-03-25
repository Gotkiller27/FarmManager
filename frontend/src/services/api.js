import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ton URL backend
});

// Créer un administrateur
export const createAdmin = async (id,adminData) => {
  const response = await api.post(`/admins/${id}`, adminData);
  return response.data;
};

// Mettre à jour un administrateur
export const updateAdmin = async (adminId, updateData) => {
  const response = await api.put(`/admins/${adminId}`, updateData);
  return response.data;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API :', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;