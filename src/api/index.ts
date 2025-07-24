
import useTcpsApi from './tcps'
import useAddressApi from './address'
import useConfigApi from './config'

const useApi = () => {
  const tcps = useTcpsApi();
  const address = useAddressApi();
  const config = useConfigApi();
  return {
    tcps,
    address,
    config
  };
};

export default useApi;