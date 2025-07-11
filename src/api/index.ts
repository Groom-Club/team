
import useTcpsApi from './tcps'
import useAddressApi from './address'

const useApi = () => {
  const tcps = useTcpsApi();
  const address = useAddressApi();
  return {
    tcps,
    address
  };
};

export default useApi;