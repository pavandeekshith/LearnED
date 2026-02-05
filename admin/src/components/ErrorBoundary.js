import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">The application crashed with the following error:</p>
            <div className="bg-gray-100 p-4 rounded overflow-auto mb-4 border border-gray-300">
              <code className="text-sm font-mono text-red-800">
                {this.state.error && this.state.error.toString()}
              </code>
            </div>
            <p className="text-gray-500 text-sm mb-2">Stack Trace:</p>
            <div className="bg-gray-900 p-4 rounded overflow-auto max-h-64">
              <code className="text-xs font-mono text-green-400 whitespace-pre">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
