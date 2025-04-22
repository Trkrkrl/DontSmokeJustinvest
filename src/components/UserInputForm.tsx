import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Cigarette, DollarSign, BarChart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { sigaraPrices } from '../data/sigaraPrices';
import InvestmentSelector from './InvestmentSelector';

interface UserInputFormProps {
  onComplete: () => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onComplete }) => {
  const {
    dailyCigarettes, 
    setDailyCigarettes,
    selectedBrand, 
    setSelectedBrand,
    startedYearsAgo, 
    setStartedYearsAgo,
    investmentCount, 
    setInvestmentCount,
    calculateResults
  } = useAppContext();

  const [step, setStep] = useState(1);
  
  // Extract unique brands from the sigaraPrices data
  const brands = new Set<string>();
  Object.values(sigaraPrices).forEach(monthsData => {
    Object.values(monthsData).forEach(brandsData => {
      brandsData.forEach(brand => {
        brands.add(brand.brand);
      });
    });
  });
  
  const handlePrevStep = () => {
    setStep(step => Math.max(1, step - 1));
  };
  
  const handleNextStep = () => {
    setStep(step => Math.min(4, step + 1));
  };

  
  const handleSubmit = () => {
 console.log("Formdan gönderilen brand:", selectedBrand);
    calculateResults(selectedBrand); 
   

    onComplete();
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 card animate-fadeIn">
      {/* Progress indicator */}
      <div className="bg-gray-100 px-6 py-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Adım {step}/4</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                className={`h-2 w-8 rounded-full ${
                  i <= step ? 'bg-green-500' : 'bg-gray-300'
                } transition-colors duration-300`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Form content */}
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center mb-4">
              <Cigarette className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Sigara Tüketimi</h2>
            </div>
            
            <div className="mb-4">
              <label htmlFor="dailyCigarettes" className="block text-sm font-medium text-gray-700 mb-1">
                Günlük kaç adet sigara içiyorsunuz?
              </label>
              <input
                id="dailyCigarettes"
                type="number"
                min="1"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none form-input"
                value={dailyCigarettes}
                onChange={(e) => setDailyCigarettes(parseInt(e.target.value) || 0)}
              />
              <p className="mt-1 text-sm text-gray-500">
                Bu {(dailyCigarettes / 20).toFixed(1)} paket sigara ediyor.
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Hangi marka sigara içiyorsunuz?
              </label>
              <select
                id="brand"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none form-input"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value.trim())}
              >
                {Array.from(brands).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center mb-4">
              <BarChart className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Sigara Kullanım Süresi</h2>
            </div>
            
            <div className="mb-4">
              <label htmlFor="startedYearsAgo" className="block text-sm font-medium text-gray-700 mb-1">
                Kaç yıl önce sigaraya başladınız?
              </label>
              <input
                id="startedYearsAgo"
                type="number"
                min="1"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none form-input"
                value={startedYearsAgo}
                onChange={(e) => setStartedYearsAgo(parseInt(e.target.value) || 0)}
              />
              <p className="mt-1 text-sm text-gray-500">
                {new Date().getFullYear() - startedYearsAgo} yılından beri sigara kullanıyorsunuz.
              </p>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Yatırım Araçları</h2>
            </div>
            
            <div className="mb-4">
              <label htmlFor="investmentCount" className="block text-sm font-medium text-gray-700 mb-1">
                Kaç farklı yatırım aracı kullanmak istersiniz?
              </label>
              <select
                id="investmentCount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none form-input"
                value={investmentCount}
                onChange={(e) => setInvestmentCount(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Sigara harcamalarınız seçtiğiniz yatırım araçları arasında eşit olarak bölünecektir.
              </p>
            </div>
          </div>
        )}
        
        {step === 4 && (
         <div className="space-y-4 animate-fadeIn">
         <div className="flex items-center mb-4">
           <DollarSign className="w-6 h-6 text-green-500 mr-2" />
           <h2 className="text-xl font-bold text-gray-800">Yatırım Araçları Seçimi</h2>
         </div>
       
         <p className="mb-4 text-sm text-gray-600">
           Her yıl için farklı yatırım araçları seçebilirsiniz. “Tüm yıllara uygula” kutucuğunu işaretlerseniz,
           seçtiğiniz araç tüm yıllara otomatik olarak atanır.
           <br />
           <span className="text-xs text-gray-500 italic">
             * Bazı yatırım araçlarına ait veriler 2010 öncesinde mevcut olmayabilir. Her yıl için  geçerli verisi olan araçlar listelenmektedir.
           </span>
         </p>
       
         <InvestmentSelector startYear={new Date().getFullYear() - startedYearsAgo} />
       </div>
       
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between">
        {step > 1 ? (
          <button
            onClick={handlePrevStep}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 btn"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Geri
          </button>
        ) : (
          <div></div>
        )}
        
        {step < 4 ? (
          <button
            onClick={handleNextStep}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 btn"
          >
            İleri
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 btn"
          >
            Raporu Hazırla
            <BarChart className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserInputForm;