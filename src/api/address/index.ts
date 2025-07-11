import axios from "axios";

const useAddressApi = () => {
  const searchAddresses = async (query: string) => {
    try {
      const { data } = await axios.get(
        `https://api.radar.io/v1/search/autocomplete`,
        {
          params: {
            query: query,
            near: "36.1253655, -86.7461217382362",
          },
          headers: {
            Authorization: import.meta.env.VITE_RADAR_API_KEY || "",
          },
        }
      );
  
      return data.addresses.map(
        (address: {
          latitude: number;
          longitude: number;
          countryCode: string;
          city: string;
          postalCode: string;
          stateCode: string;
          formattedAddress: string;
        }) => ({
          label: address.formattedAddress,
          value: address.formattedAddress,
          ...address,
        })
      );
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  };
  return { searchAddresses };
};

export default useAddressApi;