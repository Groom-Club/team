import axios from "axios";

const getTcps = () => {
  return axios.get("https://xspq-okrk-sotk.n7d.xano.io/api:I1rIkXec/tcps");
};

export default { getTcps };
