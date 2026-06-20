/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ReceiptText, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  X, 
  Lock,
  Printer,
  Compass
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  searchQuery: string;
  currencySymbol: string;
}

export default function TransactionsView({ 
  transactions, 
  searchQuery, 
  currencySymbol 
}: TransactionsViewProps) {
  
  const [filterType, setFilterType] = useState<'All' | 'Buy' | 'Sell'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Completed' | 'Pending' | 'Failed'>('All');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filter actions
  const filtered = transactions.filter((tx) => {
    const matchesSearch = tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || tx.type === filterType;
    const matchesStatus = filterStatus === 'All' || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      {/* View Header */}
      <div>
        <h3 className="font-sans text-2xl font-extrabold text-[#191c1d] tracking-tight">Trade Ledger</h3>
        <p className="text-sm text-[#444653] dark:text-[#c4c5d5] mt-1 font-medium">
          Review, filter, and audit all processed buy/sell settlements. Click on any record to generate a cryptographic receipt.
        </p>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Filters Select row */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-[#757684]" />
            <span className="font-bold text-[#757684] uppercase">Filter:</span>
          </div>

          {/* Action toggle */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-[#f3f4f5] dark:bg-[#191520] border border-[#c4c5d5] rounded p-1.5 outline-none font-semibold focus:border-[#00288e]"
          >
            <option value="All">All Operations</option>
            <option value="Buy">Buy Long Orders</option>
            <option value="Sell">Sell Short Orders</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#f3f4f5] dark:bg-[#191520] border border-[#c4c5d5] rounded p-1.5 outline-none font-semibold focus:border-[#00288e]"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* Counter stat */}
        <div className="text-xs text-[#757684] font-bold">
          Showing <span className="text-[#00288e]">{filtered.length}</span> of {transactions.length} receipts
        </div>
      </div>

      {/* Main ledger Table */}
      <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]" id="transactions-log-table">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-[#2e3132] text-[10px] font-black text-[#757684] tracking-wider uppercase">
                <th className="py-2.5 px-2">Transaction ID</th>
                <th className="py-2.5 px-2">Settlement date</th>
                <th className="py-2.5 px-2">Cross-Asset</th>
                <th className="py-2.5 px-2 text-center">Operation</th>
                <th className="py-2.5 px-2 text-right">Execution Price</th>
                <th className="py-2.5 px-2 text-right">Shares Size</th>
                <th className="py-2.5 px-2 text-right">Settlement Total</th>
                <th className="py-2.5 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#e5e7eb]/60 dark:divide-[#2e3132]/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#757684] font-semibold">
                    No matching transactions logged.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isBuy = tx.type === 'Buy';
                  return (
                    <tr 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-[#f3f4f5]/30 dark:hover:bg-[#282435] transition-colors cursor-pointer"
                    >
                      {/* ID */}
                      <td className="py-3 px-2 font-mono font-bold text-[#00288e] dark:text-[#b8c4ff]">
                        {tx.id}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-2 font-medium text-[#757684]">
                        {tx.date}
                      </td>

                      {/* Currency / Asset */}
                      <td className="py-3 px-2 font-extrabold text-[#191c1d] dark:text-white">
                        {tx.asset}
                      </td>

                      {/* Operation Type */}
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
                          isBuy 
                            ? 'bg-[#92f5a4]/15 text-[#006d30]' 
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}>
                          {isBuy ? 'LONG BUY' : 'SHORT SELL'}
                        </span>
                      </td>

                      {/* Entry Price */}
                      <td className="py-3 px-2 text-right font-mono text-[#757684] font-semibold">
                        {currencySymbol}{tx.price.toLocaleString(undefined, { minimumFractionDigits: tx.price < 5 ? 4 : 2 })}
                      </td>

                      {/* Amount Shares */}
                      <td className="py-3 px-2 text-right font-mono font-bold">
                        {tx.amount.toLocaleString(undefined, { maximumFractionDigits: 5 })}
                      </td>

                      {/* Settlement Total */}
                      <td className="py-3 px-2 text-right font-mono font-extrabold text-[#191c1d] dark:text-white text-sm">
                        {currencySymbol}{tx.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Badge status */}
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          tx.status === 'Completed' 
                            ? 'bg-[#006d30]/10 text-[#006d30] border border-[#006d30]/20' 
                            : tx.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-[#ba1a1a]'
                        }`}>
                          {tx.status}
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic invoice detail modal popup */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in text-xs text-[#191c1d] dark:text-white"
            id="invoice-modal-card"
          >
            <button 
              onClick={() => setSelectedTx(null)}
              className="absolute right-4 top-4 p-1.5 rounded-md hover:bg-[#f3f4f5] dark:hover:bg-[#2e3132]"
              id="close-invoice-modal"
            >
              <X className="w-5 h-5 text-[#757684]" />
            </button>

            {/* Header */}
            <div className="text-center pb-5 border-b border-dashed border-[#e5e7eb] dark:border-[#2e3132]">
              <div className="w-12 h-12 bg-[#00288e]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ReceiptText className="w-6 h-6 text-[#00288e]" />
              </div>
              <h4 className="text-base font-extrabold tracking-tight">Settlement Audit Receipt</h4>
              <p className="text-[10px] text-[#757684] mt-0.5">Order ID: {selectedTx.id}</p>
            </div>

            {/* Invoice parameters list */}
            <div className="py-5 space-y-3 font-medium">
              <div className="flex justify-between">
                <span className="text-[#757684]">Valuation Date:</span>
                <span className="font-mono">{selectedTx.date} 10:14:28 UTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757684]">Asset Instrument:</span>
                <span className="font-black">{selectedTx.asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757684]">Trade Order Way:</span>
                <span className={`font-bold ${selectedTx.type === 'Buy' ? 'text-[#006d30]' : 'text-[#ba1a1a]'}`}>
                  {selectedTx.type === 'Buy' ? 'LONG PURCHASE' : 'SHORT LIQUIDATION'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757684]">Acquisition rate:</span>
                <span className="font-mono font-bold">
                  {currencySymbol}{selectedTx.price.toLocaleString(undefined, { minimumFractionDigits: selectedTx.price < 10 ? 4 : 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757684]">Filled Units size:</span>
                <span className="font-mono">{selectedTx.amount.toLocaleString()} unit(s)</span>
              </div>
              
              <div className="pt-3 border-t border-dashed border-[#e5e7eb] dark:border-[#2e3132] flex justify-between items-baseline">
                <span className="text-sm font-black text-[#191c1d] dark:text-white">Amount Settled:</span>
                <span className="text-lg font-black text-[#00288e] dark:text-[#b8c4ff] font-mono">
                  {currencySymbol}{selectedTx.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Simulated verification block */}
            <div className="p-3 bg-[#f3f4f5] dark:bg-[#191520] border border-[#e5e7eb] dark:border-[#2e3132] rounded-md flex flex-col gap-1 text-[10px] text-[#757684]">
              <p className="font-bold flex items-center gap-1 text-[#191c1d] dark:text-white uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-[#006d30]" /> Hashed Node proof
              </p>
              <p className="font-mono break-all leading-normal">
                SHA-256: d53ba8746ae62fb0efda2bcf7429dcd...3a8b41
              </p>
            </div>

            {/* Actions button */}
            <div className="mt-5 flex gap-2 justify-end">
              <button 
                onClick={() => window.print()}
                className="px-3 py-1.5 border border-[#c4c5d5] hover:bg-[#f3f4f5] rounded text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all text-[#191c1d]"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
              <button 
                onClick={() => setSelectedTx(null)}
                className="px-4 py-1.5 bg-[#00288e] hover:bg-[#173bab] text-white rounded text-[11px] font-bold active:scale-95 transition-all"
              >
                Dismiss Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
