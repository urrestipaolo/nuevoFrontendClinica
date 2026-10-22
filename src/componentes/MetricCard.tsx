interface Props {
  titulo: string
  valor: number
}

export default function MetricCard({ titulo, valor }: Props) {
  return (
    <div className="card">
      <div className="metrica-titulo">{titulo}</div>
      <div className="metrica-valor">{valor}</div>
    </div>
  )
}