//ESTA PAGINA ES LA PARTE DE INICIAR SESION CUANDO SE PRESIONE EL BOTON PARA INICIAR SESION
// AQUI SE DEBE PEGAR COMO TAL EL ENDPOINT DE LA API

//UseState es un Hook de React que permite a los componentes funcionales crear y 
// gestionar un estado local (datos dinámicos que cambian con el tiempo y que, al modificarse, 
// obligan a la interfaz a volver a renderizarse)
//En .tsx lo que aprovecha es que segun el tipo de datos la modificación que vaya a entrar 
// tenga el tipo de dato correcto

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/useAuthStore";

export function LoginPage() {
  const navigate = useNavigate();
  //VARIABLE QUE TRAE LA PROPIEDAD DE LOGIN (Y login trae lo que es el token, nombre y rol)
  const loginStore = useAuthStore((s) => s.login);
  //VARIABLE PARA LOS ERRORES 
  const [errorServidor, setErrorServidor] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  //DA LOS DATOS UNA VEZ PASAN POR TODAS LAS VALIDACIONES POR EL ZOD, USA TRY CATCH PARA QUE CUANDO
  // LOS DATOS QUE RECIBE NO FUERON CORRECTOS MANDE JUSTO LA VARIABLE DE setErrorServidor
  // TAMBIEN LIMPIAR COMO TAL ERRORES ANTERIORES
  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorServidor("");
      //LLAMAR DIRECTAMENTE AL SERVICE CON LOS DATOS DEL FORMULARIO
      const respuesta = await authService.login(data);

      //AQUI LUEGO SE GUARDA TODOS LOS DATOS DEL FORMULARIO
      loginStore(
        respuesta.access_token,
        respuesta.user_name,
        respuesta.user_role,
      );
      //UNA VEZ LOGEADA UNA PERSONA REGRESA AL DASHBOARD
      navigate("/", { replace: true });
    } catch (err) {
      setErrorServidor(
        "Credenciales incorrectas o error al conectar con el servidor.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between bg-sky-700 p-10 text-white lg:flex xl:p-14">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-tight">INGRESE SUS DATOS PARA INICIAR SESION</span>
            </div>
          </div>

          <div className="flex items-center justify-center p-7 sm:p-12 lg:p-14">
            <div className="w-full max-w-sm">
              <div className="mb-10 flex items-center gap-3 lg:hidden">
              </div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Inicia sesión
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Accede a tu cuenta de la CLINICA.
                </p>
              </div>

              {/* FUNCION PARA CUANDO OCURRA errorServidor o setErrorServidor */}
              {errorServidor && (
                <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
                  {errorServidor}
                </div>
              )}

              {/* FUNCION PARA VALIDACION DEL ZOD QUE TRAE onSubmit */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <label className="block text-sm font-semibold text-slate-700">
                  Correo electrónico
                  <input
                    {...register("email")}
                    className="mt-2 h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    type="email"
                    placeholder="usuario@email.com"
                  />
                  {errors.email && (
                    <span className="mt-1 block text-xs font-medium text-rose-500">
                      {errors.email.message}
                    </span>
                  )}
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Contraseña
                  <input
                    {...register("password")}
                    className="mt-2 h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    type="password"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <span className="mt-1 block text-xs font-medium text-rose-500">
                      {errors.password.message}
                    </span>
                  )}
                </label>

                <button
                  className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
