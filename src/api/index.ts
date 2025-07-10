
import useTcpsApi from './tcps'

const useApi = () => {
  const tcps = useTcpsApi();
  
  return {
    tcps
  };
};

export default useApi;