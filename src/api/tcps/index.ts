import axios from 'axios';

const getTcps= async ()=>{
    const res = await axios.get('https://xspq-okrk-sotk.n7d.xano.io/api:I1rIkXec/tcps')
    return res.data
}

export default {getTcps}
