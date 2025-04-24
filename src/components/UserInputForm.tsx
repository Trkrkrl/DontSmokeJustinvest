import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Cigarette, DollarSign, BarChart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { sigaraPrices } from '../data/sigaraPrices';
import InvestmentSelector from './InvestmentSelector';
import { useTranslation } from 'react-i18next';


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
    calculateResults,
    setHasUserSelectedStartYear
  } = useAppContext();

  const [step, setStep] = useState(1);
  const { t } = useTranslation();


  // Extract unique brands from the sigaraPrices data
  // const brands = new Set<string>();
  // Object.values(sigaraPrices).forEach(monthsData => {
  //   Object.values(monthsData).forEach(brandsData => {
  //     brandsData.forEach(brand => {
  //       brands.add(brand.brand);
  //     });
  //   });
  // });
  //simdilik sigaralar sabit 2004 e kadar hep bu markaları fiyatları emvcut
  const brands: string[] = ["L&M", "Parliament", "Marlboro Uzun", "Marlboro Kısa", "Lark Kısa", "Lark Uzun", "Camel", "Winston"];

  const handlePrevStep = () => {
    setStep(step => Math.max(1, step - 1));
  };

  const handleNextStep = () => {
    setStep(step => Math.min(4, step + 1));
  };


  const handleSubmit = () => {
    console.log("Formdan gönderilen brand:", selectedBrand);
    setHasUserSelectedStartYear(true);
    calculateResults(selectedBrand);


    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 card animate-fadeIn">
      {/* Progress indicator */}
      <div className="bg-gray-100 px-6 py-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">{t(`userInputForm.step${step}.step`)}</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${i <= step ? 'bg-green-500' : 'bg-gray-300'
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
              <h2 className="text-xl font-bold text-gray-800">{t(`userInputForm.step${step}.title`)}</h2>
            </div>

            <div className="mb-4">
              <label htmlFor="dailyCigarettes" className="block text-sm font-medium text-gray-700 mb-1">
                {t(`userInputForm.step${step}.dailyCount`)}
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
                {t('userInputForm.step1.packageInfo', {
                  packs: (dailyCigarettes / 20).toFixed(1)
                })}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                {t(`userInputForm.step1.brand`)}
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
              <h2 className="text-xl font-bold text-gray-800">{t(`userInputForm.step${step}.title`)}</h2>
            </div>

            <div className="mb-4">
              <label htmlFor="startedYearsAgo" className="block text-sm font-medium text-gray-700 mb-1">
                {t(`userInputForm.step2.question`)}
              </label>
              <input
                id="startedYearsAgo"
                type="number"
                min="1"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none form-input"
                value={startedYearsAgo}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setStartedYearsAgo(value);
                  setHasUserSelectedStartYear(true);
                }}

              />
              <p className="mt-1 text-sm text-gray-500">
                {t('userInputForm.step2.since', {
                  year: new Date().getFullYear() - startedYearsAgo
                })}

              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">{t(`userInputForm.step${step}.title`)}</h2>
            </div>

            <div className="mb-4">
              <label htmlFor="investmentCount" className="block text-sm font-medium text-gray-700 mb-1">
                {t(`userInputForm.step3.question`)}

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
                {t(`userInputForm.step3.info`)}
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">{t(`userInputForm.step${step}.title`)}</h2>
            </div>

            <p className="mb-4 text-sm text-gray-600">
              {t(`userInputForm.step4.info`)}
              <br />
              <span className="text-xs text-gray-500 italic">
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
            {t(`userInputForm.actions.back`)}

          </button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <button
            onClick={handleNextStep}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 btn"
          >
            {t(`userInputForm.actions.next`)}

            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 btn"
          >
            {t(`userInputForm.actions.report`)}

            <BarChart className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserInputForm;