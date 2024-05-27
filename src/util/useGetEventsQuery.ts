import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "./http";

const useGetEventsQuery = (searchTerm?: string, enabled = true) => {
  return useQuery({
    queryKey: ["events", { search: searchTerm }, { max: 3 }],
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm, max: 3 }),
    enabled,
  });
};

export default useGetEventsQuery;
