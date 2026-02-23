import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "axios";
import { ScheduleFormType, ScheduleSlotUpdate } from "@/types/models";
import { MonthlySchedule } from "@/types/models";

type ApiValidationErrors = Record<string, string[]>;

type ApiOk = {
    status: string;
};

type ApiError = {
    message?: string;
    errors?: ApiValidationErrors;
};



export function useCreateSchedule() {
    const queryClient = useQueryClient();

    return useMutation<ApiOk, AxiosError<ApiError>, ScheduleFormType>({
        mutationFn: (payload) =>
            axios.post<ApiOk>("/schedules", payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
}

export function useUpdateSchedule() {
    const queryClient = useQueryClient();

    return useMutation<
        ApiOk,
        AxiosError<ApiError>,
        { month_code: string; schedules: ScheduleSlotUpdate[] }
    >({
        mutationFn: ({ month_code, schedules }) =>
            axios.put<ApiOk>(`/schedules/${month_code}`, { schedules })
                 .then((res) => res.data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
}
export function useFetchSchedules() {
  return useQuery<MonthlySchedule[]>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const res = await axios.get("/schedules");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  });
}
