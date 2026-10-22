import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  mensaje: string | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { mensaje: null }

  static getDerivedStateFromError(error: Error): State {
    return { mensaje: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.mensaje) {
      return (
        <div className="alert alert-error">
          Algo falló al mostrar esta pantalla: {this.state.mensaje}
        </div>
      )
    }
    return this.props.children
  }
}
