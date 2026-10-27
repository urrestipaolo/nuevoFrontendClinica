import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Usuario {
  id?: string;
  nombre: string;
  email?: string;
  rol: string;
}

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  autenticado: boolean;


  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  tieneRol: (rolesPermitidos: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      autenticado: false,

      login: (token, usuario) => {
        set({
          token,
          usuario,
          autenticado: true,
        });
      },

      logout: () => {
        set({
          token: null,
          usuario: null,
          autenticado: false,
        });
      },

      tieneRol: (rolesPermitidos) => {
        const { usuario } = get();
        if (!usuario) return false;
        return rolesPermitidos.includes(usuario.rol);
      },
    }),
    {
      name: "clinica-auth-storage",
    }
  ),
);