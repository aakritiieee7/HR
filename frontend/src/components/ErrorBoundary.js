import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Log error to service if needed
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen flex items-center justify-center bg-red-100"><div className="bg-white p-8 rounded shadow text-red-600 font-bold">Something went wrong. Please refresh the page.</div></div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 