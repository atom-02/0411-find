import React from 'react';
import { useAuth } from './AuthContext';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    let message = "문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    try {
      if (error?.message) {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.error.includes('insufficient permissions')) {
          message = "권한이 없습니다. 로그인 상태를 확인하거나 접근 권한을 확인해주세요.";
        }
      }
    } catch (e) {
      // Not JSON, use default
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">앗! 오류가 발생했습니다</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          새로고침
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
