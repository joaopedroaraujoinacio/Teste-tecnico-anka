// src/hooks/useClientAssets.ts
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useClientAssets = (clientId: number) => {
  return useQuery({
    queryKey: ["client-assets", clientId],
    queryFn: async () => {
      const { data } = await axios.get(`/clients/${clientId}/assets`)
      return data
    },
    enabled: !!clientId,
  })
}
