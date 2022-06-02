import { ItemWithFeatures } from "../types";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export enum FilterType {
  None,
  My,
  DonationsLessThan20,
  CommunityItems,
}

export const useItemFilter = (allItems: ItemWithFeatures[]) => {
  const { account } = useMoralis();

  const filterTypeToFn = {
    [FilterType.None]: () => true,
    [FilterType.My]: (item: ItemWithFeatures) =>
      item.owner.toLowerCase() === account?.toLowerCase(),
    [FilterType.DonationsLessThan20]: (item: ItemWithFeatures) =>
      item.earned < 20,
    [FilterType.CommunityItems]: (item: ItemWithFeatures) =>
      item.owner.toLowerCase() !== account?.toLowerCase(),
  };

  const [filters, setFilters] = useState<FilterType[]>([FilterType.None]);
  const [items, setItems] = useState<ItemWithFeatures[]>([]);

  const addFilter = (type: FilterType) =>
    setFilters((currFilters) => [...currFilters, type]);

  const deleteFilter = (type: FilterType) =>
    setFilters((currFilter) => currFilter.filter((filter) => filter !== type));

  useEffect(() => {
    setItems(
      allItems.filter((item) =>
        filters.every((filter) => filterTypeToFn[filter](item))
      )
    );
  }, [filters, allItems]);

  return { addFilter, deleteFilter, items };
};
