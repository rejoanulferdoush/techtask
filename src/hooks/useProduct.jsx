import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useProduct = () => {
  const { refetch, data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(
        `https://techops.sohochor.com/api/products/allProducts`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data.productsWithNames;
    },
  });
  return [products, refetch];
};

export default useProduct;
