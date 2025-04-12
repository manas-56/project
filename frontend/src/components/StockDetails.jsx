import { useEffect, useRef } from "react";
import { useStockStore } from "../store/useStockStore";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Activity, DollarSign } from "lucide-react";
import NoStockSelected from "./NoStockSelected";

const StockDetails = () => {
  const {
    selectedStock,
    stockDetails,
    isStockDetailsLoading,
    getStockDetails,
  } = useStockStore();

  const detailsEndRef = useRef(null);

  useEffect(() => {
    if (selectedStock && selectedStock.symbol) {
      getStockDetails(selectedStock.symbol);
    }
  }, [selectedStock, getStockDetails]);

  useEffect(() => {
    if (detailsEndRef.current) {
      detailsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [stockDetails]);

  if (isStockDetailsLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Loading stock details...
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!selectedStock) {
    return <NoStockSelected />;
  }

  if (!stockDetails || !stockDetails.data || stockDetails.data.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {selectedStock.symbol}
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 text-lg">No stock data available for {selectedStock.symbol}</p>
          </div>
        </div>
      </div>
    );
  }

  const stockData = stockDetails.data || [];
  const latest = stockData[0];
  const recent5 = stockData.slice(0, 5);

  const averageVolume = (
    recent5.reduce((sum, entry) => sum + (entry.volume || 0), 0) / recent5.length
  ).toFixed(2);
  const averageVWAP = (
    recent5.reduce((sum, entry) => sum + (entry.vwap || 0), 0) / recent5.length
  ).toFixed(2);
  const averageDeliverable = (
    recent5.reduce((sum, entry) => sum + (entry.percentDeliverable || 0), 0) /
    recent5.length
  ).toFixed(2);

  const highestHigh = Math.max(...recent5.map((entry) => entry.high || 0));
  const lowestLow = Math.min(...recent5.map((entry) => entry.low || 0));
  
  // Calculate price change
  const priceChange = latest && stockData[1] ? 
    ((latest.close - stockData[1].close) / stockData[1].close * 100).toFixed(2) : 0;
  const isPriceUp = parseFloat(priceChange) >= 0;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Sticky Header with improved styling */}
      <div className="p-6 border-b bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mr-3">
              {selectedStock.symbol}
            </h2>
            {latest && (
              <span className={`text-lg font-semibold ${isPriceUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ₹{latest.close}
              </span>
            )}
          </div>
          
          {latest && (
            <div className="mt-2 md:mt-0 flex items-center">
              {isPriceUp ? (
                <ArrowUpCircle className="h-5 w-5 text-green-500 mr-1" />
              ) : (
                <ArrowDownCircle className="h-5 w-5 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                isPriceUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPriceUp ? '+' : ''}{priceChange}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Details with visual improvements */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 text-gray-800 dark:text-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latest Data Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Latest Data</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-600 dark:text-gray-400">Date:</span> <span className="font-medium">{new Date(latest.date).toLocaleDateString()}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">Open:</span> <span className="font-medium">₹{latest.open}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">Close:</span> <span className="font-medium">₹{latest.close}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">High:</span> <span className="font-medium">₹{latest.high}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">Low:</span> <span className="font-medium">₹{latest.low}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">VWAP:</span> <span className="font-medium">₹{latest.vwap}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">Volume:</span> <span className="font-medium">{latest.volume.toLocaleString()}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">Turnover:</span> <span className="font-medium">₹{latest.turnover.toLocaleString()}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">Trades:</span> <span className="font-medium">{latest.trades.toLocaleString()}</span></div>
              <div><span className="text-gray-600 dark:text-gray-400">% Deliverable:</span> <span className="font-medium">{latest.percentDeliverable}%</span></div>
            </div>
          </div>

          {/* 5-Day Summary Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">5-Day Summary</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Average Volume:</span>
                <span className="font-medium">{parseInt(averageVolume).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Average VWAP:</span>
                <span className="font-medium">₹{averageVWAP}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Average % Deliverable:</span>
                <span className="font-medium">{averageDeliverable}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Highest High:</span>
                <span className="font-medium text-green-600 dark:text-green-400">₹{highestHigh}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Lowest Low:</span>
                <span className="font-medium text-red-600 dark:text-red-400">₹{lowestLow}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Price History */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Price History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Open</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Close</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">High</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Low</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stockData.slice(0, 7).map((day, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{new Date(day.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₹{day.open}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₹{day.close}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₹{day.high}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₹{day.low}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{day.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div ref={detailsEndRef} />
      </div>
    </div>
  );
};

export default StockDetails;