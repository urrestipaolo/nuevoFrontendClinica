import { create } from "zustand";
import { persist } from "zustand/middleware";


// INTERFACE PARA EL LOGIN DE SESION, CON ESTO HACE LA FUNCION DEL LOGIN (LAS REGLAS DE LA AUTENTICACION)
interface AuthState {
  //LOS DATOS QUE PIDE Y SE NECESITA: EL TOKEN, NOMBRE DE USUARIO, ROL Y SI ESTÁ AUTENTICADO
  token: string | null;
  usuarioNombre: string | null;
  usuarioRol: string | null;
  autenticado: boolean;

  // PROPIEDADES QUE VAN A FUNCIONAR PARA:
  //SI INICIA SESION
  login: (token: string, nombre: string, rol: string) => void;
  //SI CIERRA SESION O NO HAY SESION
  logout: () => void;
  //Y SI ES ADMIN O NO
  esAdmin: () => boolean;
}

//CON ESTO SE CREA UN STORE GLOBAL QUE VA A FUNCIONAR PARA LOGEAR EN TODO EL PROYECTO, Y VA A USAR LAS
// PROPIEDADES ESTABLECIDAS
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuarioNombre: null,
      usuarioRol: null,
      autenticado: false,

      //ACCION DEL LOGIN, RECIBE LOS DATOS DEL BACKEND
      login: (token, nombre, rol) => {
        set({
          token: token,
          usuarioNombre: nombre,
          usuarioRol: rol,
          autenticado: true,
        });
      },

      //ACCION DEL CIERRE DE SESION
      logout: () => {
        set({
          token: null,
          usuarioNombre: null,
          usuarioRol: null,
          autenticado: false,
        });
      },

      esAdmin: () => {
        return get().usuarioRol === "admin";
      },
    }),

    //EL NOMBRE DE LA LLAVE QUE PUEDE APARECER EN EL NAVEGADOR
    {
      name: "mercado-auth-storage",
    },
  ),
);
