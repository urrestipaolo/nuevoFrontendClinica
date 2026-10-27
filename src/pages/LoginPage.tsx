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

      loginStore(respuesta.access_token, {
        nombre: respuesta.user_name,
        rol: respuesta.user_role,
      });

      navigate("/", { replace: true });
    } catch (err: unknown) {
      setErrorServidor(
        err instanceof Error ? err.message : "Credenciales incorrectas o error al conectar con el servidor."
      );
    }
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

              {/* Alerta de Error de Servidor */}
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
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}