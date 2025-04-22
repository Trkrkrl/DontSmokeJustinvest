import React from 'react';
import { YearlyReturn } from '../context/AppContext';

interface InvestmentChartProps {
  yearlyReturns: YearlyReturn[];
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({ yearlyReturns }) => {
  if (yearlyReturns.length === 0) {
    return <div>Veri bulunamadı</div>;
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Find the max value for scaling
  const maxValue = Math.max(
    ...yearlyReturns.map(yr => Math.max(yr.investmentValue, yr.cigaretteSpent))
  );
  
  // Calculate chart dimensions
  const chartHeight = 300;
  const chartWidth = '100%';
  const barWidth = `${90 / (yearlyReturns.length * 2)}%`;
  const barMargin = `${10 / (yearlyReturns.length * 2)}%`;
  
  // Calculate the scale factor
  const scale = maxValue > 0 ? chartHeight / maxValue : 0;
  
  return (
    <div className="relative w-full overflow-x-auto">
      <div style={{ height: `${chartHeight + 60}px`, width: chartWidth }} className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-30 w-16 flex flex-col justify-between">
          {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => (
            <div key={i} className="flex items-center justify-end pr-2" style={{ height: '20px', position: 'absolute', bottom: `${fraction * chartHeight}px`, right: 0 }}>
              <span className="text-xs text-gray-500">{formatCurrency(maxValue * (1 - fraction))}</span>
            </div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="ml-16 h-full relative border-l border-b border-gray-300">
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map((fraction, i) => (
            <div 
              key={i} 
              className="absolute w-full border-t border-gray-200"
              style={{ bottom: `${fraction * chartHeight}px` }}
            />
          ))}
          
          {/* Data bars */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-full">
            {yearlyReturns.map((yr, idx) => (
              <div key={idx} className="flex items-end" style={{ width: `${100 / yearlyReturns.length}%` }}>
                {/* Cigarette spent bar */}
                <div 
                  className="relative bg-red-500 hover:bg-red-600 transition-colors duration-300"
                  style={{ 
                    height: `${(yr.cigaretteSpent * scale)}px`, 
                    width: barWidth,
                    marginLeft: barMargin,
                    marginRight: barMargin
                  }}
                  title={`Sigaraya Harcanan: ${formatCurrency(yr.cigaretteSpent)}`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1 whitespace-nowrap">
                    Sigaraya Harcanan: {formatCurrency(yr.cigaretteSpent)}
                  </div>
                </div>
                
                {/* Investment value bar */}
                <div 
                  className="relative bg-green-500 hover:bg-green-600 transition-colors duration-300"
                  style={{ 
                    height: `${(yr.investmentValue * scale)}px`, 
                    width: barWidth,
                    marginLeft: barMargin,
                    marginRight: barMargin
                  }}
                  title={`Yatırım Değeri: ${formatCurrency(yr.investmentValue)}`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1 whitespace-nowrap">
                    Yatırım Değeri: {formatCurrency(yr.investmentValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="absolute w-full flex items-center justify-around" style={{ bottom: -30 }}>
            {yearlyReturns.map((yr, idx) => (
              <div key={idx} className="text-xs text-gray-500" style={{ width: `${100 / yearlyReturns.length}%`, textAlign: 'center' }}>
                {yr.year}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center mr-6">
          <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600">Sigaraya Harcanan</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600">Yatırım Değeri</span>
        </div>
      </div>
    </div>
  );
};

export default InvestmentChart;