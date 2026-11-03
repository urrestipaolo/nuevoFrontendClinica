import { useEffect } from 'react';
import { useCitasStore } from '../stores/useCitasStore';

export function useCitas() {
  const citas = useCitasStore((s) => s.citas);
  const citaSeleccionada = useCitasStore((s) => s.citaSeleccionada);
  const cargando = useCitasStore((s) => s.cargando);
  const error = useCitasStore((s) => s.error);

  const cargarTodas = useCitasStore((s) => s.cargarTodas);
  const cargarPorPaciente = useCitasStore((s) => s.cargarPorPaciente);
  const seleccionar = useCitasStore((s) => s.seleccionar);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);
  const agregarCita = useCitasStore((s) => s.agregarCita);
  const eliminar = useCitasStore((s) => s.eliminar);
  const limpiarError = useCitasStore((s) => s.limpiarError);

  useEffect(() => {
    void cargarTodas();
  }, [cargarTodas]);

  return {
    citas,
    citaSeleccionada,
    cargando,
    error,
    cargarTodas,
    cargarPorPaciente,
    seleccionar,
    actualizarEstado,
    agregarCita,
    eliminar,
    limpiarError,
  };
}