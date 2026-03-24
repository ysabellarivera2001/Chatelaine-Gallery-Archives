import { useMemo, useState } from "react";
import {
  filterByEnneagram,
  filterByGroup,
  filterByMBTI,
  filterBySearch,
  filterByStatus,
  getUniqueEnneagrams,
  getUniqueMBTIs
} from "../utils/filters";

export function useFilters(characters) {
  const [filters, setFilters] = useState({
    query: "",
    mbti: "",
    enneagram: "",
    group: "",
    status: ""
  });

  const filteredCharacters = useMemo(() => {
    let result = [...characters];
    result = filterBySearch(result, filters.query);
    result = filterByMBTI(result, filters.mbti);
    result = filterByEnneagram(result, filters.enneagram);
    result = filterByGroup(result, filters.group);
    result = filterByStatus(result, filters.status);
    return result;
  }, [characters, filters]);

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ query: "", mbti: "", enneagram: "", group: "", status: "" });
  };

  return {
    filters,
    setFilter,
    clearFilters,
    filteredCharacters,
    mbtiOptions: getUniqueMBTIs(characters),
    enneagramOptions: getUniqueEnneagrams(characters)
  };
}
