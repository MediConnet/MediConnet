import { getProviderRequestsAPI } from "../infrastructure/requests.api";


export const getRequestsUseCase = async () => {
  // Aquí podrías añadir lógica extra si necesitaras transformar datos antes de que lleguen a la UI
  return await getProviderRequestsAPI();
};