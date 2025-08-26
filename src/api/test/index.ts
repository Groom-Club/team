import { useClerkAxios } from "../clerkAxios";

const useTestApi = () => {
  const axios = useClerkAxios();

  const getMember = (query?: string) => {
    const params = query ? { q: query } : {};
    return axios.get("/members", { params });
  };

  const getDogs = (memberId: number) => {
    return axios.get(`/members/${memberId}/dogs`);
  };
  const getAppointmentSuggestions = (memberId: number, data: any) => {
    return axios.post(`/members/${memberId}/appointment-suggestions`, data);
  };

  return {
    getMember,
    getDogs,
    getAppointmentSuggestions,
  };
};

export default useTestApi;
