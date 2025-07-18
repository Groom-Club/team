import { useClerkAxios } from "../clerkAxios";

const useConfigApi = () => {
  const axios = useClerkAxios();

  const getPrices = (params?: any) => {
    return axios.get("/price_modifiers", {
      params,
    });
  };
  const updatePriceModifier = (
    price_modifiers_id: number,
    data: any,
    params?: any
  ) => {
    return axios.patch(`/price_modifiers/${price_modifiers_id}`, data, {
      params: {
        token: import.meta.env.VITE_XANO_WRITE_TOKEN,
        ...params,
      },
    });
  };
  const getAppointmentRankConfig = (params?: any) => {
    return axios.get("/appointment_rank_config", {
      params,
    });
  };
  const updateAppointmentRankConfig = (
    appointment_rank_config_id: number,
    data: any,
    params?: any
  ) => {
    return axios.patch(
      `/appointment_rank_config/${appointment_rank_config_id}`,
      data,
      {
        params: {
          token: import.meta.env.VITE_XANO_WRITE_TOKEN,
          ...params,
        },
      }
    );
  };
  return {
    getPrices,
    updatePriceModifier,
    getAppointmentRankConfig,
    updateAppointmentRankConfig,
  };
};

export default useConfigApi;
