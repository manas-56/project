import { Info } from "lucide-react";

const NoStockSelected = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-center px-6 animate-fade-in">
      <div className="max-w-md bg-base-100 p-8 rounded-2xl shadow-xl border border-base-300">
        {/* Illustration Placeholder (replace with actual image or Lottie animation if needed) */}
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-base-content/40"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h4l3-3m0 0l3 3h4m-4 0v6m-6-6v6m6 0l3 3m-3-3l-3 3m6-3h4"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-base-content mb-2">
          Select a Stock to Get Started
        </h2>
        <p className="text-base-content/70 mb-4">
          You haven’t selected any stock yet. Choose one from the left panel to explore live charts, insights, and market data.
        </p>

        <div className="flex justify-center items-center text-sm text-base-content/60 gap-2">
          <Info size={16} />
          Real-time data updates every 10 seconds. Add stocks to your watchlist for quick access.
        </div>
      </div>
    </div>
  );
};

export default NoStockSelected;
