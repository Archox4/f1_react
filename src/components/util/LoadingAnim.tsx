export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-2 py-10">
      <span className="sr-only">Loading...</span>
      <div className="h-3 w-3 rounded-full bg-red-600 animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 rounded-full bg-red-600 animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 rounded-full bg-red-600 animate-bounce"></div>
    </div>
  );
}