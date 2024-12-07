"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  HiOutlineBookOpen, 
  HiOutlineDocumentText,
  HiOutlineLightBulb,
  HiOutlineChevronRight 
} from "react-icons/hi";

const ReviewPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Repasar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Materias Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-violet-100 rounded-lg">
              <HiOutlineBookOpen className="h-6 w-6 text-violet-500" />
            </div>
            <h2 className="text-lg font-semibold">Materias</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Repasa el contenido por materias específicas.
          </p>
          <Button variant="outline" className="w-full">
            Ver Materias
            <HiOutlineChevronRight className="ml-2" />
          </Button>
        </Card>

        {/* Apuntes Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-100 rounded-lg">
              <HiOutlineDocumentText className="h-6 w-6 text-pink-500" />
            </div>
            <h2 className="text-lg font-semibold">Apuntes</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Revisa tus apuntes y notas importantes.
          </p>
          <Button variant="outline" className="w-full">
            Ver Apuntes
            <HiOutlineChevronRight className="ml-2" />
          </Button>
        </Card>

        {/* Quiz Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <HiOutlineLightBulb className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold">Quiz</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Pon a prueba tus conocimientos con quizzes dinámicos.
          </p>
          <Link href="/dashboard/review/quiz">
            <Button 
              className="w-full bg-gradient-to-r from-[#FF5F13] to-[#FBB041] text-white hover:opacity-90"
            >
              Comenzar Quiz
              <HiOutlineChevronRight className="ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default ReviewPage;
