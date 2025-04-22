import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import UserInputForm from './components/UserInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  const [showResults, setShowResults] = useState(false);
  
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Calculator className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Sigara Yatırım Hesaplayıcı</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {!showResults ? (
            <UserInputForm onComplete={() => setShowResults(true)} />
          ) : (
            <ResultsDisplay onReset={() => setShowResults(false)} />
          )}
        </main>
        
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">© 2025 Sigara Yatırım Hesaplayıcı. Tüm hakları saklıdır.</p>
            <p className="text-xs mt-2 text-gray-400">
              Bu hesaplayıcı, sigaraya harcanan paranın yatırım potansiyelini göstermek için tasarlanmıştır.
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;