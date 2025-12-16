import React from 'react';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-md w-full">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ExclamationTriangleIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Något gick fel</h1>
                        <p className="text-slate-600 mb-6">
                            Ett oväntat fel uppstod i applikationen.
                        </p>

                        {this.state.error && (
                            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg text-left text-xs font-mono overflow-auto max-h-40 mb-6">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                            Ladda om sidan
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
