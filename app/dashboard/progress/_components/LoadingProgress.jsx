import { Card } from "@/components/ui/card";

export default function LoadingProgress() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tu Progreso</h1>

      {/* Estadísticas Principales Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-full animate-pulse">
                <div className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-300 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráfico Skeleton */}
      <Card className="p-6 mb-6">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
      </Card>

      {/* Progreso por Materia Skeleton */}
      <Card className="p-6">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-2 bg-gray-100 rounded animate-pulse" />
              <div className="flex justify-between mt-1">
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
