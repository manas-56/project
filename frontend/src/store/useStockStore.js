import { create } from "zustand";
import axios from "axios";

export const useStockStore = create((set, get) => ({
  stocks: [],
  selectedStock: null,
  stockDetails: null,
  isStocksLoading: false,
  isStockDetailsLoading: false,
  searchQuery: "",

  getStocks: async () => {
    set({ isStocksLoading: true });
    try {
      const res = await axios.get("http://localhost:5000/api/stocks");
      set({ stocks: res.data, isStocksLoading: false });
    } catch (err) {
      console.error("Error fetching stocks:", err);
      set({ isStocksLoading: false });
    }
  },

  setSelectedStock: (stock) => {
    set({ selectedStock: stock, stockDetails: null });
  },

  getStockDetails: async (symbol) => {
    set({ isStockDetailsLoading: true });
    try {
      const res = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
      set({ stockDetails: res.data, isStockDetailsLoading: false });
    } catch (err) {
      console.error("Error fetching stock details:", err);
      set({ isStockDetailsLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  filteredStocks: () => {
    const { stocks, searchQuery } = get();
    if (!searchQuery) return stocks;
    return stocks.filter((stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },
}));
