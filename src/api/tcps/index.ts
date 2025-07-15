import { useClerkAxios } from "../clerkAxios";

const useTcpsApi = () => {
  const axios = useClerkAxios();

  const getTcps = () => {
    return axios.get("/tcps");
  };

  const editShiftData = (tcp_weekly_shifts_id: number, shiftData?: any, params?: any) => {
    return axios.put(
      `/tcp_weekly_shifts/${tcp_weekly_shifts_id}`,
      shiftData,
      {
        params: { token: import.meta.env.VITE_XANO_WRITE_TOKEN, ...params },
      }
    );
  };
  const createShiftData=(tcp_id:number,shiftData:any,params?:any)=>{
    return axios.post(`/tcps/${tcp_id}/weekly-shifts`,shiftData,{
      params: { token: import.meta.env.VITE_XANO_WRITE_TOKEN, ...params },
    })
  }
  const createScheduleOverride=(tcp_id:number,shiftData:any,params?:any)=>{
    return axios.post(`/tcps/${tcp_id}/schedule-overrides`,shiftData,{
      params: { token: import.meta.env.VITE_XANO_WRITE_TOKEN, ...params },
    })
  }
  const getBreeds = async (params?: any) => {
    return axios.get(`/breeds`, {
      params,
    });
  };
  const createStaffMember=(staffData:any,params?:any)=>{
    return axios.post(`/tcps`,staffData,{
      params: { token: import.meta.env.VITE_XANO_WRITE_TOKEN, ...params },
    })
  }
  const updateStaffMember=(tcp_id:number,staffData:any,params?:any)=>{
    return axios.patch(`/tcps/${tcp_id}`,staffData,{
      params: { token: import.meta.env.VITE_XANO_WRITE_TOKEN, ...params },
    })
  }
  const uploadTcpPhoto=(tcp_id:number,photo:any,params?:any)=>{
    return axios.post(`/tcps/${tcp_id}/photo`,photo,{
      params: { token: import.meta.env.VITE_XANO_WRITE_TOKEN, ...params },
    })
  }

  return { getTcps, editShiftData,createScheduleOverride,createShiftData,getBreeds,createStaffMember,updateStaffMember,uploadTcpPhoto };
};

export default useTcpsApi;
