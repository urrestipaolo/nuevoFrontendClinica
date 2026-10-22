import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Convierte cualquier error en un mensaje legible para mostrar en pantalla
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "No se pudo conectar con el servidor";
    return (
      error.response.data?.message ??
      error.response.data?.error ??
      `Error ${error.response.status}`
    );
  }
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
}


