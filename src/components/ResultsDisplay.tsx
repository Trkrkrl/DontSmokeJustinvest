import React, { useState } from 'react';
import { ArrowLeft, Printer, BarChart3, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import InvestmentChart from './InvestmentChart';
import { useTranslation } from 'react-i18next';

interface ResultsDisplayProps {
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ onReset }) => {
  const [showChart, setShowChart] = useState(false);
  const { results, isLoadingData, dailyCigarettes, selectedBrand, startedYearsAgo, isCalculating } = useAppContext();
  const { t } = useTranslation();


  if (isLoadingData || isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4" />
        <p className="text-gray-600">{t("resultsDisplay.loadingData")}</p>
      </div>
    );
  }


  if (!results) {
    return (
      <div className="text-center p-8">
        <p>{t("resultsDisplay.noResultsYet")}</p>
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none btn"
        >
          {t("resultsDisplay.goBack")}
        </button>
      </div>
    );
  }

  // Toplam yatırımları hesapla
  const totalInvestments: { [asset: string]: { quantity: number; value: number } } = {};
  results.yearlyReturns.forEach((yearData) => {
    yearData.investments.forEach((investment) => {
      // console.log("inv: ", investment)
      const { asset, quantity, value } = investment;
      if (!totalInvestments[asset]) {
        totalInvestments[asset] = { quantity: 0, value: 0 };
      }
      totalInvestments[asset].quantity += quantity;
      totalInvestments[asset].value += value;
    });
  });
  //-
  // Yeni: Her yatırım aracının maliyeti ve getirisi hesaplanıyor
  const assetDetails = Object.entries(totalInvestments).map(([asset, data]) => {
    let totalSpent = 0;

    results.yearlyReturns.forEach(yearData => {
      const monthlySpent = yearData.cigaretteSpent;
      const assetShare = yearData.investments.filter(inv => inv.asset === asset).length
        / yearData.investments.length;

      totalSpent += monthlySpent * assetShare;
    });

    const roi = totalSpent > 0 ? ((data.value - totalSpent) / totalSpent) * 100 : 0;

    return {
      asset,
      quantity: data.quantity,
      value: data.value,
      spent: totalSpent,
      roi,
      percentOfTotal: data.value / results.totalInvestmentValue * 100
    };
  });

  //-

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fadeIn">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h2 className="text-xl font-bold text-white">{t("resultsDisplay.investmentReport")}</h2>
          <p className="text-blue-100 text-sm">
            {t('resultsDisplay.ifYouHaveInvestedDailyInsteadOfSmoking', {
              dailyCigarettess:  dailyCigarettes ,
              selectedBrandd: selectedBrand
            })}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Printer className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-700">{t("resultsDisplay.spentOnCigarettesTotal")}</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(results.totalSpentOnCigarettes)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {t('resultsDisplay.investmentOnYearsTotal', {
                  startedYearsAgoo: startedYearsAgo
                })}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-700">{t("resultsDisplay.investmentValue")}</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(results.totalInvestmentValue)}</p>
              <p className="text-xs text-gray-500 mt-1">{t("resultsDisplay.todaysTotalValue")}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-700">{t("resultsDisplay.netProfit")}</h3>
              </div>
              <p className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(results.netProfit)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {results.netProfit >= 0 ? 'Kazanç' : 'Kayıp'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Chart Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowChart(!showChart)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none btn"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          {showChart ? t("resultsDisplay.showChart") : t("resultsDisplay.showGraph")}
        </button>
      </div>

      {/* Results Display */}
      {showChart ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">{t("resultsDisplay.investmentValueGraph")}</h3>
          <InvestmentChart yearlyReturns={results.yearlyReturns} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <h3 className="bg-gray-50 px-6 py-3 text-lg font-medium text-gray-700">{t("resultsDisplay.annualInvestmentDetails")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("resultsDisplay.year")}Yıl</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("resultsDisplay.spentOnCigarette")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("resultsDisplay.investmentValue")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("resultsDisplay.roi")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.yearlyReturns.map((yearData) => {
                  const returnRate = yearData.cigaretteSpent > 0
                    ? ((yearData.investmentValue / yearData.cigaretteSpent) - 1) * 100
                    : 0;

                  return (
                    <tr key={yearData.year} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{yearData.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(yearData.cigaretteSpent)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(yearData.investmentValue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${returnRate >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {returnRate >= 0 ? '+' : ''}{returnRate.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assetDetails.map((detail) => (
          <div key={detail.asset} className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h4 className="text-md font-medium text-gray-700 mb-2">{detail.asset}</h4>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">{t("resultsDisplay.totalAmount")}</span>{' '}
              {detail.quantity.toFixed(4)}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">{t("resultsDisplay.todaysValue")}</span>{' '}
              {formatCurrency(detail.value)}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">{t("resultsDisplay.totalCost")}</span>{' '}
              {formatCurrency(detail.spent)}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">{t("resultsDisplay.profitReturn")}</span>{' '}
              <span className={`font-semibold ${detail.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {detail.roi >= 0 ? '+' : ''}{detail.roi.toFixed(2)}%
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {t('resultsDisplay.totalIncPercentage', {
                totalIncPercentage: detail.percentOfTotal.toFixed(2)
              })}

            </p>
          </div>
        ))}
      </div>



      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          onClick={onReset}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none btn"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("resultsDisplay.newCalculation")}
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none btn"
        >
          <Printer className="h-4 w-4 mr-2" />
          {t("resultsDisplay.printReport")}

        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
