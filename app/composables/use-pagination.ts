import { ref } from "vue";

/**
 * Composable for list page pagination state.
 * Use with store list actions that accept { pagination: { page, limit } }.
 *
 * @param initialPageSize - Default page size (limit). Defaults to 10.
 */

export type Pagination = {
  page: number;
  pageSize: number;
};

export function usePagination(initialPageSize = 10) {
  const pagination = ref<Pagination>({
    page: 1,
    pageSize: initialPageSize,
  });

  const resetPagination = () => {
    pagination.value.page = 1;
  };

  const setPage = (page: number) => {
    pagination.value.page = page;
  };

  const setPageSize = (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    resetPagination();
  };

  return {
    pagination,
    resetPagination,
    setPage,
    setPageSize,
  };
}
