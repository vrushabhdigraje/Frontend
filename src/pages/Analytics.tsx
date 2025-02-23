import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  category: string;
  date: string;
}

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const totalTransactions = transactions.length;
  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const incomePercent = (totalIncome / (totalIncome + totalExpenses)) * 100;
  const expensePercent = (totalExpenses / (totalIncome + totalExpenses)) * 100;

  const categories = Array.from(new Set(transactions.map(t => t.category)));
  const categoryStats = categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.category === category);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percent = (total / (totalIncome + totalExpenses)) * 100;
    return { category, total, percent };
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-semibold text-gray-900">${totalIncome - totalExpenses}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-semibold text-green-600">${totalIncome}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ArrowUpCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${incomePercent}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">{incomePercent.toFixed(1)}% of total</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-600">${totalExpenses}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowDownCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-red-500 rounded-full"
                style={{ width: `${expensePercent}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">{expensePercent.toFixed(1)}% of total</p>
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {categoryStats.map(({ category, total, percent }) => (
            <div key={category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{category}</span>
                <span className="text-sm text-gray-500">${total}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-500 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;