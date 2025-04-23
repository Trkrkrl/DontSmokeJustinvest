import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SigaraPriceEntry, SigaraPrices } from '../data/sigaraPrices';
import { fetchInvPrices, InvPriceEntry, InvPrices } from '../data/invPrices';
import { getAvailableAssetsByYear } from '../data/availableAssets';
import { fetchSigaraPrices } from '../data/sigaraPrices';


export interface AppContextType {
  // User inputs
  dailyCigarettes: number;
  setDailyCigarettes: (value: number) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  startedYearsAgo: number;
  setStartedYearsAgo: (value: number) => void;
  investmentCount: number;
  setInvestmentCount: (value: number) => void;
  selectedInvestments: Record<string, string[]>;
  setSelectedInvestments: (value: Record<string, string[]>) => void;
  applyToAllYears: Record<number, boolean>;
  setApplyToAllYears: (value: Record<number, boolean>) => void;
  isLoadingData: boolean;
  hasUserSelectedStartYear: boolean;
  setHasUserSelectedStartYear: (val: boolean) => void;
  shouldTriggerCalculation: boolean;
  setTriggerCalculateResult: (val: boolean) => void;
  hasCalculationTriggered: boolean;
  setAllDatasFetched: (val: boolean) => void;
  hasAllDatasFetched: boolean;
  isCalculating: boolean;

  setShouldTriggerCalculation: (val: boolean) => void;


  // Calculation results
  // results: CalculationResults | null;
  // calculateResults: () => void;
}

export interface CalculationResults {
  yearlyReturns: YearlyReturn[];
  totalInvestmentValue: number;
  totalSpentOnCigarettes: number;
  netProfit: number;
  roiPercent?: number; // 👈 yeni alan
}

export interface YearlyReturn {
  year: number;
  investmentValue: number;
  cigaretteSpent: number;
  investments: {
    asset: string;
    quantity: number;
    value: number;
  }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to safely perform calculations
const safeCalculate = (operation: () => number): number => {
  try {
    const result = operation();
    return Number.isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
};

// Helper function to get price from data
export const getCigarettePriceFromData = (
  data: SigaraPrices,
  year: string,
  month: string,
  brand: string
): number => {
  try {
    const entries = data[year]?.[month];
    if (!entries) return 0;

    const item = entries.find(entry =>
      entry.brand.toLowerCase().trim() === brand.toLowerCase().trim()
    );

    if (!item) return 0;

    const raw = item.value;

    if (typeof raw === 'number') return raw;

    if (typeof raw === 'string') {
      const parsed = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  } catch (error) {
    console.error('getCigarettePriceFromData error:', error);
    return 0;
  }
};
export const getInvestmentPriceFromData = (
  data: InvPrices,
  year: string,
  month: string,
  asset: string
): number => {
  try {
    const entries = data[year]?.[month];
    if (!entries) return 0;

    const item = entries.find(entry =>
      entry.asset.toLowerCase().trim() === asset.toLowerCase().trim()
    );

    if (!item) return 0;

    const raw = item.value;

    if (raw === 'Data Not Available') return 0;

    if (typeof raw === 'number') return raw;

    if (typeof raw === 'string') {
      const parsed = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  } catch (error) {
    console.error('getInvestmentPriceFromData error:', error);
    return 0;
  }
};
//eğer son ay verisi boşsa son müsait ay verisini getir
const getLatestAvailablePriceDate = (
  data: InvPrices,
  asset: string
): { year: string; month: string } | null => {
  const sortedYears = Object.keys(data).sort((a, b) => Number(a) - Number(b)).reverse();

  for (const year of sortedYears) {
    const months = Object.keys(data[year]).sort((a, b) => Number(a) - Number(b)).reverse();
    for (const month of months) {
      const found = data[year][month].find(
        (entry) => entry.asset?.toLowerCase().trim() === asset.toLowerCase().trim()
      );
      if (found && typeof found.value !== 'undefined' && found.value !== '' && found.value !== 'Data Not Available') {
        return { year, month };
      }
    }
  }

  return null;
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User inputs
  const [dailyCigarettes, setDailyCigarettes] = useState<number>(10);
  const [selectedBrand, setSelectedBrand] = useState<string>('L&M');
  const [startedYearsAgo, setStartedYearsAgo] = useState<number>(5);
  const [investmentCount, setInvestmentCount] = useState<number>(1);
  const [selectedInvestments, setSelectedInvestments] = useState<Record<string, string[]>>({});
  const [applyToAllYears, setApplyToAllYears] = useState<Record<number, boolean>>({});
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const [hasUserSelectedStartYear, setHasUserSelectedStartYear] = useState(false);
  const [hasCalculationTriggered, setTriggerCalculateResult] = useState(false);
  const [hasAllDatasFetched, setAllDatasFetched] = useState(false);
  // AppProvider.tsx – state’lerin yanına ekle
  const [isCalculating, setIsCalculating] = useState(false);





  // Results
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [invPricesData, setInvPricesData] = useState<InvPrices>({});
  const [sigaraPricesData, setSigaraPricesData] = useState<SigaraPrices>({});
  const [shouldTriggerCalculation, setShouldTriggerCalculation] = useState(false);

  useEffect(() => {
    if (hasUserSelectedStartYear && hasCalculationTriggered && hasAllDatasFetched) {
      console.log("🚀 Tüm veriler geldi, hesaplama başlatılıyor");
      calculateResults();
    }
  }, [hasUserSelectedStartYear, hasCalculationTriggered, hasAllDatasFetched]);

  useEffect(() => {
    if (!hasUserSelectedStartYear) return; // yıl henüz seçilmemişse veri çekme
    const loadData = async () => {

      setIsLoadingData(true); // <-- Başlangıçta loading

      const currentYear = new Date().getFullYear();
      const startYear = currentYear - startedYearsAgo;
      const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => (startYear + i).toString());

      const available = await getAvailableAssetsByYear();
      const filteredAssetsByYear: Record<string, string[]> = {};

      for (const year of years) {
        if (available[year]) {
          filteredAssetsByYear[year] = available[year];
        }
      }

      const allResults: InvPrices = {};
      for (const year of years) {
        const partialResult = await fetchInvPrices([year], { [year]: filteredAssetsByYear[year] || [] });
        if (Object.keys(partialResult).length > 0) {
          allResults[year] = partialResult[year];
        }
      }

      setInvPricesData(allResults);



      // 🔄 Sigara fiyat verisini çek
      // 🔄 Sigara fiyatlarını sadece ihtiyaç olan yıllar için çek

      const cigarettePrices = await fetchSigaraPrices(years);
      setSigaraPricesData(cigarettePrices);
      setAllDatasFetched(true)

      // if (

      //   hasCalculationTriggered && hasAllDatasFetched
      // ) {
      //   calculateResults();
      // }

      // ⬇️ loadData() en SON satırı
      setAllDatasFetched(true);          // veriler hazır
      setIsCalculating(true);            // loading göstergesi açık kalsın
      calculateResults();                // hesaplama başlasın
      // setIsLoadingData(false); // <--Sigara Fiyatları çekimi Tamamlandı


    };

    loadData();
  }, [startedYearsAgo, hasUserSelectedStartYear, hasCalculationTriggered, hasAllDatasFetched]);


  const calculateResults = () => {
    if (hasAllDatasFetched) {
      try {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - startedYearsAgo;

        const packetsPerDay = safeCalculate(() => Math.max(0, dailyCigarettes / 20));
        const yearlyReturns: YearlyReturn[] = [];

        let totalInvestmentValue = 0;
        let totalSpentOnCigarettes = 0;

        // Calculate for each year
        for (let year = startYear; year <= currentYear; year++) {
          const yearString = year.toString();
          const yearlyData: YearlyReturn = {
            year,
            investmentValue: 0,
            cigaretteSpent: 0,
            investments: []
          };

          // Get selected investments for this year
          const yearInvestments = Array(investmentCount).fill('USD');
          for (let i = 0; i < investmentCount; i++) {
            if (selectedInvestments[yearString]?.[i]) {
              yearInvestments[i] = selectedInvestments[yearString][i];
            } else if (applyToAllYears[i]) {
              // Find the first selected asset for this index
              for (let y = year; y >= startYear; y--) {
                const prevYearStr = y.toString();
                if (selectedInvestments[prevYearStr]?.[i]) {
                  yearInvestments[i] = selectedInvestments[prevYearStr][i];
                  break;
                }
              }
            }
          }

          // Calculate monthly expenditures and investments
          for (let month = 1; month <= 12; month++) {
            const monthString = month.toString(); // direk "1", "2", ..., "12"


            // Skip future months in current year
            if (year === currentYear && month > new Date().getMonth() + 1) {
              continue;
            }

            // Get cigarette price for this month
            const cigarettePrice = getCigarettePriceFromData(
              sigaraPricesData,
              yearString,
              monthString,

              selectedBrand,

            );

            // Calculate monthly cigarette expenditure
            const daysInMonth = new Date(year, month, 0).getDate();

            const monthlySpending = safeCalculate(() => cigarettePrice * packetsPerDay * daysInMonth);
            yearlyData.cigaretteSpent += monthlySpending;


            // Split spending among investments
            const amountPerInvestment = safeCalculate(() => monthlySpending / investmentCount);

            // Process each investment
            yearInvestments.forEach((asset) => {
              // Get investment price for this month
              const assetPrice = getInvestmentPriceFromData(
                invPricesData,
                yearString,
                monthString,

                asset,

              );

              if (assetPrice > 0) {
                // Calculate quantity purchased
                const quantity = safeCalculate(() => amountPerInvestment / assetPrice);

                // Find or create investment entry
                let investment = yearlyData.investments.find((inv) => inv.asset === asset);
                if (!investment) {
                  investment = { asset, quantity: 0, value: 0 };
                  yearlyData.investments.push(investment);
                }

                // Add quantity to investment
                investment.quantity += quantity;

                // Get latest price for the asset
                const latestYear = Object.keys(invPricesData).sort().pop() || '';
                const latestMonth = Object.keys(invPricesData[latestYear] || {}).sort().pop() || '';
                const latestDate = getLatestAvailablePriceDate(invPricesData, asset);

                let latestPrice = 0;
                if (latestDate) {
                  latestPrice = getInvestmentPriceFromData(
                    invPricesData,
                    latestDate.year,
                    latestDate.month,
                    asset,
                  );
                }

                investment.value = safeCalculate(() => investment.quantity * latestPrice);
                /* const latestPrice = getPriceFromData(
                   invPrices,
                   latestYear,
                   latestMonth,
                   'asset',
                   asset,
                   'value'
                 );*/

                // Update investment value
                investment.value = safeCalculate(() => investment.quantity * latestPrice);

              }
            });
          }

          // Calculate total investment value for the year
          yearlyData.investmentValue = safeCalculate(() =>
            yearlyData.investments.reduce((sum, inv) => sum + (inv.value || 0), 0)
          );

          totalInvestmentValue += yearlyData.investmentValue;
          totalSpentOnCigarettes += yearlyData.cigaretteSpent;

          yearlyReturns.push(yearlyData);
        }

        setResults({
          yearlyReturns,
          totalInvestmentValue,
          totalSpentOnCigarettes,
          netProfit: safeCalculate(() => totalInvestmentValue - totalSpentOnCigarettes),
          roiPercent: safeCalculate(() => {
            if (totalSpentOnCigarettes === 0) return 0;
            return ((totalInvestmentValue - totalSpentOnCigarettes) / totalSpentOnCigarettes) * 100;
          })
        });
        setIsLoadingData(false); // <--Sigara Fiyatları çekimi Tamamlandı

      } catch (error) {
        console.error('Error calculating results:', error);
        setResults({
          yearlyReturns: [],
          totalInvestmentValue: 0,
          totalSpentOnCigarettes: 0,
          netProfit: 0
        });
        setIsLoadingData(false); // <--Sigara Fiyatları çekimi Tamamlandı

      }

    }

  };

  return (
    <AppContext.Provider value={{
      dailyCigarettes,
      setDailyCigarettes,
      selectedBrand,
      setSelectedBrand,
      startedYearsAgo,
      setStartedYearsAgo,
      investmentCount,
      setInvestmentCount,
      selectedInvestments,
      setSelectedInvestments,
      applyToAllYears,
      setApplyToAllYears,
      results,
      calculateResults,
      isLoadingData,
      hasUserSelectedStartYear,
      setHasUserSelectedStartYear
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};