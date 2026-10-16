"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type SearchSuggestion = {
  id: string | number;
  slug?: string;
  name: string;
};

type SearchCategory = {
  id: string | number;
  name: string;
  slug: string;
};

type SearchContextValue = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  suggestions: SearchSuggestion[];
  setSuggestions: (value: SearchSuggestion[]) => void;
  categories: SearchCategory[];
  setCategories: (value: SearchCategory[]) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const value = useMemo(
    () => ({ searchTerm, setSearchTerm, suggestions, setSuggestions, categories, setCategories }),
    [categories, searchTerm, suggestions],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within SearchProvider");
  return context;
}
