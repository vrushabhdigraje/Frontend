import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, LogOut, BarChart3, List, Plus } from 'lucide-react';
import Analytics from './Analytics';

const transactions = [
  { id: 1, type: 'credit', amount: 5000, category: 'Salary', date: '2024-03-15' },
  { id: 2, type: 'expense', amount: 100, category: 'Food', date: '2024-03-14' },
  { id: 3, type: 'expense', amount: 200, category: 'Transportation', date: '2024-03-13' },
  { id: 4, type: 'credit', amount: 1000, category: 'Freelance', date: '2024-03-12' },
  { id: 5, type: 'expense', amount: 300, category: 'Entertainment', date: '2024-03-11' },
];

const Home = () => {
  const [view, setView] = useState<'table' | 'analytics'>('table');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <HomeIcon className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">Finance Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('table')}
                className={`p-2 rounded-lg ${
                  view === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`p-2 rounded-lg ${
                  view === 'analytics' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
              </button>
              <Link
                to="/login"
                className="flex items-center text-gray-600 hover:text-gray-900"
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
        {/* Header Actions */}
        <div className="px-4 sm:px-0 mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="7">Last Week</option>
              <option value="30">Last Month</option>
              <option value="365">Last Year</option>
              <option value="custom">Custom</option>
            </select>
            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="credit">Income</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Transaction
          </button>
        </div>

        {/* Content */}
        {view === 'table' ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
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
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                        ${transaction.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Analytics transactions={transactions} />
        )}
      </main>
    </div>
  );
};

export default Home;