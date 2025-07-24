import useTcpsApi from "./tcps";
import useAddressApi from "./address";
import useConfigApi from "./config";
import useTestApi from "./test";

const useApi = () => {
  const tcps = useTcpsApi();
  const address = useAddressApi();
  const config = useConfigApi();
  const test = useTestApi();
  return {
    tcps,
    address,
    config,
    test,
  };
};

export default useApi;
