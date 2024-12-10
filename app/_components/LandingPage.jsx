import Link from 'next/link';
import Header from './Header';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header Minimalista */}
      <nav className="w-full py-4 px-6 flex justify-between items-center bg-white border-b border-gray-100">
        <Link href="/" className="text-2xl font-bold text-gray-800">Kunno</Link>
        <div className="flex gap-4 items-center">
          <Link href="/resources" className="text-gray-600 hover:text-gray-800">Recursos</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-800">Precios</Link>
          <Link href="/auth/login" className="text-gray-600 hover:text-gray-800">Iniciar Sesión</Link>
          <Link 
            href="/auth/register" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <motion.h1 
            className="text-6xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Piensa, planea y aprende
            <br />
            <span className="text-gray-400">todo en un solo lugar</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Gestiona tu aprendizaje de manera eficiente y mejora tu productividad con IA
          </motion.p>

          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              href="/explore-course"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explorar demo
            </Link>
            <Link 
              href="/download"
              className="px-8 py-3 bg-white text-gray-800 rounded-lg border border-gray-200 hover:border-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Descargar App
            </Link>
          </motion.div>
        </div>

        {/* Floating Cards */}
        <div className="relative mt-32">
          {/* Task Card */}
          <motion.div 
            className="absolute -left-4 top-0 bg-white p-6 rounded-xl shadow-lg w-72"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Notas del Curso</h3>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-blue-500"></div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-green-500"></div>
              </div>
            </div>
          </motion.div>

          {/* Calendar Card */}
          <motion.div 
            className="absolute -right-4 top-20 bg-white p-6 rounded-xl shadow-lg w-72"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Próximas Clases</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">13:00 - 14:45</span>
                <span className="text-blue-500">Hoy</span>
              </div>
              <div className="text-gray-800">Clase de IA Avanzada</div>
            </div>
          </motion.div>

          {/* Integration Card */}
          <motion.div 
            className="mx-auto bg-white p-8 rounded-xl shadow-lg max-w-2xl relative z-10 mt-40"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-center">Integraciones Disponibles</h3>
            <div className="flex justify-center gap-6">
              <motion.img 
                src="/google-icon.png" 
                alt="Google" 
                className="w-10 h-10 object-contain"
                whileHover={{ scale: 1.1 }}
              />
              <motion.img 
                src="/slack-icon.png" 
                alt="Slack" 
                className="w-10 h-10 object-contain"
                whileHover={{ scale: 1.1 }}
              />
              <motion.img 
                src="/calendar-icon.png" 
                alt="Calendar" 
                className="w-10 h-10 object-contain"
                whileHover={{ scale: 1.1 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-5 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default LandingPage;
