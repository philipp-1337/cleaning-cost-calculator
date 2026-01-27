import { useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { useEntries } from './hooks/useEntries';
import { usePayments } from './hooks/usePayments';
import { useImportExport } from './hooks/useImportExport';
import { LogOut } from 'lucide-react';
import EntryForm from './components/EntryForm';
import PaymentForm from './components/PaymentForm';
import SummaryCards from './components/SummaryCards';
import CombinedList from './components/CombinedList';
import ImportExportSection from './components/ImportExportSection';
import Spinner from './Spinner';
import TabBar from './components/TabBar';

import ExpenseForm from './components/ExpenseForm';
import {
  calculateTotalPaid,
  calculateTotalExpenses,
  calculateTotalAllCosts,
  calculateBalanceWithExpenses
} from './utils/calculations';
import { useExpenses } from './hooks/useExpenses';

export default function CleaningCalculator() {
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom hooks for data management
  const {
    entries,
    loading: entriesLoading,
    addEntry,
    updateEntry,
    deleteEntry
  } = useEntries();

  const {
    payments,
    loading: paymentsLoading,
    addPayment,
    deletePayment,
    updatePayment
  } = usePayments();

  // Expenses für Summary laden
  const { expenses, loading: expensesLoading, deleteExpense, updateExpense } = useExpenses();

  // Calculate totals
  const totalCosts = calculateTotalAllCosts(entries, expenses);
  const totalPaid = calculateTotalPaid(payments);
  const balance = calculateBalanceWithExpenses(totalPaid, entries, expenses);
  const totalExpenses = calculateTotalExpenses(expenses);
  const loading = entriesLoading || paymentsLoading;

  // Import/Export functionality
  const {
    dragActive,
    handleImport,
    handleExport,
    handleHumanExport,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useImportExport(entries, payments, () => {
    // Reload page after import to fetch new data
    window.location.reload();
  });

    // Tab state: 0 = Verwaltung, 1 = Übersicht
    const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Reinigungskosten-Rechner
          </h1>
          <button
            onClick={logout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
            aria-label="Logout"
          >
            <span className="md:hidden">
              <LogOut className="h-5 w-5" />
            </span>
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>

        {/* TabBar Navigation */}
        <TabBar
          tabs={["Verwaltung", "Übersicht"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Views */}
        {activeTab === 0 ? (
          // Verwaltung View
          <>
            <ImportExportSection
              fileInputRef={fileInputRef}
              dragActive={dragActive}
              onImport={handleImport}
              onExport={handleExport}
              onHumanExport={handleHumanExport}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <EntryForm onAdd={addEntry} />
                <PaymentForm onAdd={addPayment} />
              </div>
              <div className="mt-8">
                <ExpenseForm />
              </div>
            </ImportExportSection>
          </>
        ) : (
          // Übersicht View
          <>
            <SummaryCards
              totalCosts={totalCosts}
              totalPaid={totalPaid}
              balance={balance}
              loading={loading || expensesLoading}
              totalExpenses={totalExpenses}
            />
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Übersicht</h2>
              {loading ? (
                <div className="py-12 flex justify-center items-center">
                  <Spinner />
                </div>
              ) : entries.length === 0 && payments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Noch keine Einträge vorhanden
                </p>
              ) : (
                <div className="space-y-4">
                  <CombinedList
                    entries={entries}
                    payments={payments}
                    expenses={expenses}
                    onDeleteEntry={deleteEntry}
                    onUpdateEntry={updateEntry}
                    onDeletePayment={deletePayment}
                    onUpdatePayment={updatePayment}
                    onDeleteExpense={deleteExpense}
                    onUpdateExpense={updateExpense}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}