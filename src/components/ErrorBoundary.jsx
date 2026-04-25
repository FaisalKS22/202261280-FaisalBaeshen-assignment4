import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-card">
            <span className="error-boundary-icon" aria-hidden="true">⚠️</span>
            <h1>Something broke.</h1>
            <p>
              An unexpected error happened while rendering the page. The error
              has been logged to your browser console.
            </p>
            {this.state.error && (
              <pre className="error-boundary-detail">
                {this.state.error.toString()}
              </pre>
            )}
            <button className="btn btn-primary" onClick={this.handleReset}>
              Reload page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
