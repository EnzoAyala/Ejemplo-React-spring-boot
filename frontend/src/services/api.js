import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ INTERCEPTOR CORREGIDO
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ INTERCEPTOR DE RESPUESTA SIN AUTO-LOGOUT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠ Token inválido o expirado");

      // ❌ YA NO CERRAMOS SESIÓN AUTOMÁTICAMENTE
      // localStorage.clear();
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
