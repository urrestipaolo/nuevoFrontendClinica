//CENTRALIZA TODAS LAS LLAMADAS O PETICIONES HTTP EN ESTE CASO A LA AUTENTICACION
//SIRVE PARA SEPARAR LA LOGICA DE LA API DE LOS COMPONENTES VISUALES

import { api } from "../lib/axios";
import type { LoginFormData } from "../schemas/loginSchema";

//ESTA INTERFACE HACE USO DEL ESQUEMA JSON QUE MUESTRA AUTH EN EL SWAGGER (API)
// SE COPIA IGUAL LOS NOMBRES Y SU TIPO
interface TokenResponse {
  access_token: string;
  token_type: string;
  user_role: string;
  user_name: string;
}


//AQUI LA FUNCION DE LOGIN (que está en useAuthStore pero lo sacamos de 
// api de axios porque allí ha sido importado) DEBE CONECTARSE CON EL POST DEL BACKEND
export const authService = {
  login: async (datos: LoginFormData): Promise<TokenResponse> => {
    //LA VARIABLE SE LLAMA RESPUESTA PORQUE 1.- RECIBE LOS DATOS PARA TokenResponse y los pone en el post
    //Es como si nosotros manualmente pusieramos los datos allí en el esquema del TokenResponse del swagger
    // pero esta variable lo hace automaticamente
    const respuesta = await api.post<TokenResponse>("/auth/login", datos);

    return respuesta.data;
  },
};
