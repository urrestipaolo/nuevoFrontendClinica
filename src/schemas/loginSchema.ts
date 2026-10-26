//USAMOS ZOD, QUE SIRVE PARA DECLARAR ESQUEMAS Y VALIDAR LOS DATOS QUE SE INGRESAN
// AYUDA A ESTABLECER LAS REGLAS DE LO QUE EL USUARIO DEBE ESCRIBIR (EJEM: CORREO VALIDO, NO ESPACIOS VACIOS, ETC)
import z from "zod";

//AQUI ESTÁ PONIENDO LAS REGLAS DE LO QUE EL USUARIO DEBE INGRESAR
export const loginSchema = z.object({
  email: z
    //QUE SEA UN TEXTO
    .string()
    //QUE MINIMO TENGA UNA LETRA
    .min(1, "El correo es obligatorio")
    //QUE SEA EN UN FORMATO DE CORREO VALIDO (example@correo.com)
    .email("Formato de correo electrónico inválido"),

  password: z
  //QUE SEA UN TEXTO
  .string()
  //QUE MINIMO CONTENGA UNA LETRA
  .min(1, "La contraseña es obligatoria"),
});

//LO QUE EXPORTA AQUI SERÍA LAS RESPUESTAS PASADO YA POR LOS FILTROS DEL ZOD (EL TIPO DE TYPESCRIPT VALIDO)
export type LoginFormData = z.infer<typeof loginSchema>;
