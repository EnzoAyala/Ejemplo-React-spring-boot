// frontend/src/hooks/useSuscripcion.js
import { useState, useEffect } from "react";
import api from "../services/api";

export const useSuscripcion = () => {
  const [suscripcion, setSuscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuscripcion = async () => {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.accessToken;

      if (!token) {
        setSuscripcion(null);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/pagos/activo");

        setSuscripcion(response.data || null);
        setError(null);

      } catch (err) {
        const status = err.response?.status;

        // SI NO TIENE SUSCRIPCIÓN → NO lanzar error
        if (status === 401 || status === 404) {
          setSuscripcion(null);
          setError(null);
        } else {
          setError("Error al obtener suscripción");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchSuscripcion();
  }, []);

  return { suscripcion, loading, error };
};
