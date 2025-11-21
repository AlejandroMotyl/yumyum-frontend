import { useFiltersStore } from './useFiltersStore';
import { useSearchStore } from './useSearchStore';

export function useResetAll() {
  const resetFilters = useFiltersStore((s) => s.resetFilters);
  const resetSearch = useSearchStore((s) => s.clearSearchQuery);

  const resetAll = () => {
    resetFilters();
    resetSearch();
  };

  return resetAll;
}
