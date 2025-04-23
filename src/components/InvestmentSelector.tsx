import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { getAvailableAssetsByYear } from '../data/availableAssets';



interface InvestmentSelectorProps {
  startYear: number;
}

const InvestmentSelector: React.FC<InvestmentSelectorProps> = ({ startYear }) => {
  const {
    investmentCount,
    selectedInvestments,
    setSelectedInvestments,
    applyToAllYears,
    setApplyToAllYears
  } = useAppContext();

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const [availableAssets, setAvailableAssets] = useState<Record<string, string[]>>({});
  useEffect(() => {

    const loadAssets = async () => {

      const data = await getAvailableAssetsByYear();
     // console.log("availables: ", data)
      setAvailableAssets(data);
    };
    loadAssets();
  }, []);

  // Extract unique investment assets from the invPrices data, filtering out those with invalid or missing values per year
  const assetsByYear = useMemo(() => {
    const map: Record<number, Set<string>> = {};
    years.forEach((year) => {
      const yearStr = year.toString();
      map[year] = new Set(availableAssets[yearStr] || []);
    });
    return map;
  }, [availableAssets, years]);

  const handleInvestmentChange = (year: number, index: number, asset: string) => {
    const yearStr = year.toString();
    const newSelectedInvestments = { ...selectedInvestments };

    if (!newSelectedInvestments[yearStr]) {
      newSelectedInvestments[yearStr] = [];
    }

    newSelectedInvestments[yearStr][index] = asset;
    setSelectedInvestments(newSelectedInvestments);

    if (applyToAllYears[index]) {
      years.forEach(y => {
        const yStr = y.toString();
        if (!newSelectedInvestments[yStr]) {
          newSelectedInvestments[yStr] = [];
        }
        newSelectedInvestments[yStr][index] = asset;
      });
      setSelectedInvestments(newSelectedInvestments);
    }
  };

  const handleApplyToAllYearsChange = (index: number, checked: boolean) => {
    const newApplyToAllYears = { ...applyToAllYears };
    newApplyToAllYears[index] = checked;
    setApplyToAllYears(newApplyToAllYears);

    if (checked) {
      let selectedAsset = '';
      for (const year of years) {
        const yearStr = year.toString();
        if (selectedInvestments[yearStr] && selectedInvestments[yearStr][index]) {
          selectedAsset = selectedInvestments[yearStr][index];
          break;
        }
      }

      if (!selectedAsset) {
        selectedAsset = Array.from(assetsByYear[years[0]])[0] || '';
      }

      if (selectedAsset) {
        const newSelectedInvestments = { ...selectedInvestments };
        years.forEach(year => {
          const yearStr = year.toString();
          if (!newSelectedInvestments[yearStr]) {
            newSelectedInvestments[yearStr] = [];
          }
          newSelectedInvestments[yearStr][index] = selectedAsset;
        });
        setSelectedInvestments(newSelectedInvestments);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: investmentCount }).map((_, index) => (
            <div key={`investment-${index}`} className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Yatırım Aracı {index + 1}
              </h3>

              <div className="flex items-center mb-3">
                <input
                  id={`apply-all-${index}`}
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  checked={!!applyToAllYears[index]}
                  onChange={(e) => handleApplyToAllYearsChange(index, e.target.checked)}
                />
                <label htmlFor={`apply-all-${index}`} className="ml-2 block text-sm text-gray-600">
                  Tüm yıllara uygula
                </label>
              </div>

              {applyToAllYears[index] ? (
                <div className="mb-2">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={
                      (years[0] && selectedInvestments[years[0].toString()] &&
                        selectedInvestments[years[0].toString()][index]) || ''
                    }
                    onChange={(e) => handleInvestmentChange(years[0], index, e.target.value)}
                  >
                    <option value="">Yatırım aracı seçin</option>
                    {Array.from(assetsByYear[years[0]]).map(asset => (
                      <option key={asset} value={asset}>{asset}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {years.map(year => (
                    <div key={`year-${year}-inv-${index}`} className="flex items-center">
                      <span className="w-16 text-sm font-medium text-gray-700">{year}:</span>
                      <select
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                        value={
                          (selectedInvestments[year.toString()] &&
                            selectedInvestments[year.toString()][index]) || ''
                        }
                        onChange={(e) => handleInvestmentChange(year, index, e.target.value)}
                      >
                        <option value="">Seçin</option>
                        {Array.from(assetsByYear[year]).map(asset => (
                          <option key={asset} value={asset}>{asset}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentSelector;