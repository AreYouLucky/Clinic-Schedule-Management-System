import { Booking } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "axios";
type ApiValidationErrors = Record<string, string[]>;
type ApiOk = {
    status?: string;
    message?: string;
};

type ApiError = {
    message?: string;
    errors?: ApiValidationErrors;
};


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
        mutationFn: async (payload: { id: number; status: number; paid_amount?: number | null }) => {
            const res = await axios.patch(`/appointments/${payload.id}/status`, {
                status: payload.status,
                paid_amount: payload.paid_amount,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
}

export type WalkInPayload = {
    fname: string;
    lname: string;
    mname?: string;
    email?: string;
    contact: string;
    reason: string;
    start_time: string;
    end_time: string;
};

export function useCreateWalkInAppointment() {
    const queryClient = useQueryClient();

    return useMutation<ApiOk, AxiosError<ApiError>, WalkInPayload>({
        mutationFn: async (payload) => {
            const res = await axios.post<ApiOk>('/appointments/walk-in', payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
}