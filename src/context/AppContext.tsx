import React, { createContext, useContext, useState, ReactNode } from 'react';
import { sigaraPrices } from '../data/sigaraPrices';
import { invPrices } from '../data/invPrices';

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
  
  // Calculation results
  results: CalculationResults | null;
  calculateResults: () => void;
}

export interface CalculationResults {
  yearlyReturns: YearlyReturn[];
  totalInvestmentValue: number;
  totalSpentOnCigarettes: number;
  netProfit: number;
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
const getPriceFromData = (
  data: typeof sigaraPrices | typeof invPrices,
  year: string,
  month: string,
  searchKey: string,
  searchValue: string,
  priceKey: 'price' | 'value' = 'value' // <-- default artık 'value'
): number => {
  try {
    const item = data[year]?.[month]?.find(item =>
      item[searchKey]?.toLowerCase().trim() === searchValue.toLowerCase().trim()
    );

    if (item) {
      const raw = item[priceKey];
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string') {
        // Örn: "1.376,25" → 1376.25
        const parsed = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
        return isNaN(parsed) ? 0 : parsed;
      }
    }

    return 0;
  } catch {
    return 0;
  }
};
//eğer son ay verisi boşsa son müsait ay verisini getir
const getLatestAvailablePriceDate = (
  data: typeof invPrices,
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
  
  // Results
  const [results, setResults] = useState<CalculationResults | null>(null);
  
  const calculateResults = () => {
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
          const cigarettePrice = getPriceFromData(
            sigaraPrices,
            yearString,
            monthString,
            'brand',
            selectedBrand,
            'value'
          );


          console.log(`Sigara:${selectedBrand}, Yıl: ${yearString}, Ay: ${monthString}`);
console.log(sigaraPrices[yearString]?.[monthString]);


          
          // Calculate monthly cigarette expenditure
          const daysInMonth = new Date(year, month, 0).getDate();
           console.log("per cigarette Price: ",cigarettePrice)
          const monthlySpending = safeCalculate(() => cigarettePrice * packetsPerDay * daysInMonth);
          yearlyData.cigaretteSpent += monthlySpending;
          console.log("yearlyData.cigaretteSpent: ",yearlyData.cigaretteSpent)
          
          // Split spending among investments
          const amountPerInvestment = safeCalculate(() => monthlySpending / investmentCount);
          
          // Process each investment
          yearInvestments.forEach((asset) => {
            // Get investment price for this month
            const assetPrice = getPriceFromData(
              invPrices,
              yearString,
              monthString,
              'asset',
              asset,
              'value'
            );
            console.log("got asset pridce:",assetPrice)
            console.log("got asset price:", assetPrice, typeof assetPrice);
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
              const latestYear = Object.keys(invPrices).sort().pop() || '';
              const latestMonth = Object.keys(invPrices[latestYear] || {}).sort().pop() || '';
              const latestDate = getLatestAvailablePriceDate(invPrices, asset);

let latestPrice = 0;
if (latestDate) {
  latestPrice = getPriceFromData(
    invPrices,
    latestDate.year,
    latestDate.month,
    'asset',
    asset,
    'value'
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
              
            console.log("update asset latestPrice price:",latestPrice)
              
              // Update investment value
              investment.value = safeCalculate(() => investment.quantity * latestPrice);
            console.log("update inv latest value:",latestPrice)
              
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
        netProfit: safeCalculate(() => totalInvestmentValue - totalSpentOnCigarettes)
      });
    } catch (error) {
      console.error('Error calculating results:', error);
      setResults({
        yearlyReturns: [],
        totalInvestmentValue: 0,
        totalSpentOnCigarettes: 0,
        netProfit: 0
      });
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
      calculateResults
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