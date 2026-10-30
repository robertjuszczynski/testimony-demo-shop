import { Component, type ReactNode } from 'react'

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="crash">
        <h1>Something went wrong</h1>
        <p>The checkout stopped working. Please try again.</p>
        <code>{this.state.error.message}</code>
        <button type="button" onClick={() => location.reload()}>
          Reload
        </button>
      </main>
    )
  }
}
