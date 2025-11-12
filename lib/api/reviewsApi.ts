// src/api/reviewsApi.ts
import { nextServer } from "./api"

export const getReviews = async () => {
  const response = await nextServer.get("/feedbacks?page=1&limit=6")
  return response.data.items // або .data, залежно від бекенду
}