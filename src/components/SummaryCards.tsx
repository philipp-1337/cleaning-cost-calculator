import SkeletonLoader from './SkeletonLoader';
import { formatCurrency, getBalanceLabel } from '../utils/formatters';

type SummaryCardsProps = {
  totalCosts: number;
  totalPaid: number;
  balance: number;
  loading: boolean;
};

export default function SummaryCards({ 
  totalCosts, 
  totalPaid, 
  balance, 
  loading 
}: SummaryCardsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center min-h-[90px]">
        <p className="text-sm text-gray-600 mb-1">Gesamt Kosten</p>
        {loading ? (
          <SkeletonLoader height="32px" width="60%" />
        ) : (
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalCosts)}
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center min-h-[90px]">
        <p className="text-sm text-gray-600 mb-1">Bereits gezahlt</p>
        {loading ? (
          <SkeletonLoader height="32px" width="60%" />
        ) : (
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center min-h-[90px]">
        <p className="text-sm text-gray-600 mb-1">Saldo</p>
        {loading ? (
          <>
            <SkeletonLoader height="32px" width="60%" />
            <SkeletonLoader height="16px" width="40%" style={{ marginTop: '8px' }} />
          </>
        ) : (
          <>
            <p className={`text-2xl font-bold ${
              balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getBalanceLabel(balance)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}