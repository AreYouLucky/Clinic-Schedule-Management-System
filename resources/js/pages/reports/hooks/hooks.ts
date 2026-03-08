import { Booking } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetReports(fromDate: string, toDate: string) {
    return useQuery<Booking[]>({
        queryKey: ["reports", fromDate, toDate],
        queryFn: async () => {
            const res = await axios.get("/get-reports", {
                params: {
                    from_date: fromDate,
                    to_date: toDate,
                },
            });
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });
}

