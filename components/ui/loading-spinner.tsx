export interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
