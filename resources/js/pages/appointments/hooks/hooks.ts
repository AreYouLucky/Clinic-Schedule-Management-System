import { Booking } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useGetBookings(date: string, status: string) {
    return useQuery<Booking[]>({
        queryKey: ["bookings", date, status],
        queryFn: async () => {
            const res = await axios.get("/get-appointments", {
                params: { date, status }
            });
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false
    });
}

export function useUpdateBookingStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { id: number; status: number }) => {
            const res = await axios.patch(`/appointments/${payload.id}/status`, {
                status: payload.status,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
}
