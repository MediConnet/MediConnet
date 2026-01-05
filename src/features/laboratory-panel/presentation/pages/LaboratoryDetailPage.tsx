import { useParams } from "react-router-dom";

export const LaboratoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Detalle del Laboratorio</h1>
      <p className="text-gray-600">ID: {id}</p>
      <p className="text-gray-600">Detalle del laboratorio (en desarrollo)</p>
    </div>
  );
};

