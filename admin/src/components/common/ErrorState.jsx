export default function ErrorState({ message, onRetry }) {
  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
      <p className="text-sm font-medium text-amber-900">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-1 text-sm font-semibold text-amber-700 hover:text-amber-900">
          Retry
        </button>
      )}
    </div>
  )
}
