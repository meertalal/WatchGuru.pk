import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ServerError } from '../../pages/ServerError'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Structured error logging without leaking secrets
    console.error('[WatchGuru Application Error]', {
      name: error.name,
      message: error.message,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <ServerError
          onRetry={this.handleRetry}
          errorDetails={
            import.meta.env.DEV && this.state.error
              ? this.state.error.message
              : undefined
          }
        />
      )
    }

    return this.props.children
  }
}
