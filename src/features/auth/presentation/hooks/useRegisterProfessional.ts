import { useState } from "react";
import { registerProfessionalUseCase } from "../../application/register-professional.usecase";
import type { ProfessionalRequest } from "../../domain/ProfessionalRequest.entity";

export const useRegisterProfessional = () => {
  const [loading, setLoading] = useState(false);

  const submit = async (data: ProfessionalRequest) => {
    setLoading(true);
    try {
      await registerProfessionalUseCase(data);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};
