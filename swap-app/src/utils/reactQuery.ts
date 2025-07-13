import { useQuery, type UseQueryResult } from "@tanstack/react-query";

// 定义一个通用的 useCustomQuery Hook
export const useCustomQuery = <TData, TError = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>
): UseQueryResult<TData, TError> => {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
  });
};
