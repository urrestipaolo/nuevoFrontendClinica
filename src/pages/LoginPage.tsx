import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/useAuthStore";

export function LoginPage() {
  const navigate = useNavigate();
  
  const loginStore = useAuthStore((s) => s.login);
  
  const [errorServidor, setErrorServidor] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorServidor("");
      
      const respuesta = await authService.login(data);
      console.log("Respuesta del backend:", respuesta);

      // Guardamos en el store usando el token real del backend y un rol válido del enum
      loginStore(respuesta.access_token, {
        nombre: "Usuario Clínica",
        rol: "GERENCIA", // Rol válido según tu enum (GERENCIA, MEDICO, RECEPCIONISTA)
      });

      navigate("/", { replace: true });
    } catch (err: unknown) {
      console.error("Error en login:", err);
      setErrorServidor(
        "Credenciales incorrectas o error al conectar con el servidor.",
      );
    }
  };

  // BOTÓN DE ACCESO RÁPIDO / MODO PRUEBA (Sin backend)
  const handleModoPrueba = () => {
    loginStore("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJwYW9sb0BnbWFpbC5jb20iLCJyb2xlIjoiR0VSRU5DSUEiLCJpYXQiOjE3OTMzMTQ0MDAsImV4cCI6MTc5MzM0MzIwMH0.EAQe7afTex_7kOpEmeN-NU_LSxURfShJ-GmlfLPursQ", {
      nombre: "Usuario DEMO",
      rol: "GERENCIA", // O 'RECEPCIONISTA' / 'MEDICO'
    });
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 lg:grid-cols-[1.05fr_0.95fr]">
          
          {/* Panel Decorativo Izquierdo */}
          <div className="hidden flex-col justify-between bg-sky-700 p-10 text-white lg:flex xl:p-14">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-tight">SISTEMA CLÍNICO - GESTIÓN INTEGRAL</span>
            </div>
            <p className="text-sky-100 text-sm">
              Módulo de autenticación y control de accesos basado en roles y Zustand.
            </p>
          </div>

          {/* Formulario de Acceso */}
          <div className="flex items-center justify-center p-7 sm:p-12 lg:p-14">
            <div className="w-full max-w-sm">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Inicia sesión
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Accede a tu cuenta de la clínica.
                </p>
              </div>

              {errorServidor && (
                <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
                  {errorServidor}
                </div>
              )}

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
                  className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </button>
              </form>

              {/* SEPARADOR Y BOTÓN DE ACCESO RÁPIDO */}
              <div className="mt-6 border-t border-stone-200 pt-6">
                <button
                  type="button"
                  onClick={handleModoPrueba}
                  className="h-11 w-full rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold transition hover:bg-slate-200 border border-stone-300 flex items-center justify-center gap-2"
                >
                  PRESIONA AQUI PARA ENTRAR AL DASHBOARD SIN INICIAR SESION
                </button>
                <p className="mt-2 text-center text-xs text-slate-400">
                  Para acceder al dashboard y funciones
                </p>
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}