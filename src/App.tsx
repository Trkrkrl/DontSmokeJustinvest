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
            <h1 className="text-2xl font-bold text-gray-800">Sigara ve Yatırım Kıyaslama Aracı</h1>
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
    <p className="text-sm font-semibold">© 2025 Sigara vs Yatırım Kıyaslayıcı. Tüm hakları saklıdır.</p>

    <p className="text-xs mt-2 text-gray-400">
      Bu araç, sigaraya harcanan paranın uzun vadeli yatırım fırsatlarına nasıl dönüşebileceğini göstermek için tasarlanmıştır.
    </p>

    <p className="text-xs mt-4 text-gray-300">
      Daha fazla yatırım aracı eklemek ve geçmiş yıllara ait daha kapsamlı veriler sağlamak için lütfen projemizi destekleyin.
    </p>

    <div className="mt-3 flex justify-center space-x-4">
      <a
        href="https://github.com/Trkrkrl/DontSmokeJustinvest" // GitHub URL'ni buraya ekle
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:text-blue-300 underline"
      >
        GitHub üzerinden katkıda bulunun
      </a>

      <a
        href="https://patreon.com/TheKarapetti" // Patreon URL'ni buraya ekle
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-yellow-400 hover:text-yellow-300 underline"
      >
        Patreon ile destek olun
      </a>
    </div>
  </div>
</footer>

      </div>
    </AppProvider>
  );
}

export default App;