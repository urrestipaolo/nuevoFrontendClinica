import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertaBanner } from './AlertaBanner';

interface Props {
  children: ReactNode;
  fallbackMensaje?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error no capturado atrapado por Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <AlertaBanner tipo="error" mensaje={"Ocurrió un error al cargar esta sección."} />
        </div>
      );
    }

    return this.props.children;
  }
}