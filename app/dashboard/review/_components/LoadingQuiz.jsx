import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function LoadingQuiz({ status }) {
  // Calcular el progreso basado en el estado
  const getProgress = () => {
    switch (status?.status) {
      case 'starting':
        return 20;
      case 'preparing':
        return 40;
      case 'generating':
        return 60;
      case 'processing':
        return 80;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Quiz Dinámico</h1>
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Spinner */}
          <div className="w-16 h-16 relative">
            <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin"></div>
          </div>

          {/* Mensaje de estado */}
          <h2 className="text-lg font-medium text-center">
            {status?.message || 'Preparando tu quiz...'}
          </h2>

          {/* Barra de progreso */}
          <div className="w-full max-w-md">
            <Progress 
              value={getProgress()} 
              className="h-2"
            />
          </div>

          {/* Descripción del estado */}
          <p className="text-sm text-gray-500 text-center">
            {status?.status === 'starting' && 'Iniciando generación del quiz...'}
            {status?.status === 'preparing' && 'Preparando el contenido...'}
            {status?.status === 'generating' && 'Generando preguntas inteligentes...'}
            {status?.status === 'processing' && 'Procesando las respuestas...'}
            {status?.status === 'completed' && '¡Quiz listo!'}
          </p>
        </div>
      </Card>
    </div>
  );
}
