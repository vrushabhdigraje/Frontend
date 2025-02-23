import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, LogOut, BarChart3, List, Plus, Search } from 'lucide-react';
import Analytics from './Analytics';
import AddTransactionModal from './AddTransactionModal';
import { Transaction, TransactionType } from '../types/transaction';

const initialTransactions: Transaction[] = [
  { id: 1, type: 'credit', amount: 5000, category: 'Salary', date: '2024-03-15' },
  { id: 2, type: 'expense', amount: 100, category: 'Food', date: '2024-03-14' },
  { id: 3, type: 'expense', amount: 200, category: 'Transportation', date: '2024-03-13' },
  { id: 4, type: 'credit', amount: 1000, category: 'Freelance', date: '2024-03-12' },
  { id: 5, type: 'expense', amount: 300, category: 'Entertainment', date: '2024-03-11' },
];

const Home = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [view, setView] = useState<'table' | 'analytics'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '365' | 'custom'>('7');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.max(...transactions.map(t => t.id)) + 1
    };
    setTransactions([transaction, ...transactions]);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Type filter
      if (typeFilter !== 'all' && transaction.type !== typeFilter) {
        return false;
      }

      // Search filter
      if (searchTerm && !transaction.category.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Time filter
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (timeFilter) {
        case '7':
          return daysDiff <= 7;
        case '30':
          return daysDiff <= 30;
        case '365':
          return daysDiff <= 365;
        default:
          return true;
      }
    });
  }, [transactions, timeFilter, typeFilter, searchTerm]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <HomeIcon className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">Finance Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('table')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'analytics' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
              </button>
              <Link
                to="/login"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Balance</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              ${(totalIncome - totalExpenses).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="px-4 sm:px-0 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="7">Last Week</option>
              <option value="30">Last Month</option>
              <option value="365">Last Year</option>
              <option value="custom">Custom</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="credit">Income</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Transaction
          </button>
        </div>

        {/* Content */}
        {view === 'table' ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            transaction.type === 'credit'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                          ${transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Analytics transactions={filteredTransactions} />
        )}
      </main>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
};

export default Home;