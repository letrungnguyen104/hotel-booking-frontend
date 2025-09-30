import { getPublic } from "@/utils/publicRequest"

export const topFiveHotel = async (city) => {
  const response = await getPublic(`hotels/top-hotels?city=${city}`);
  return response.result;
}