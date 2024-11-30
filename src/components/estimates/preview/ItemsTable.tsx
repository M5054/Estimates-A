import React from 'react';
import { formatCurrency } from '../../../utils/currency';

interface Item {
  description: string;
  quantity: number;
  rate: number;
}

interface ItemsTableProps {
  items: Item[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

const ItemsTable: React.FC<ItemsTableProps> = ({
  items = [],
  subtotal = 0,
  taxRate = 0,
  taxAmount = 0,
  total = 0,
}) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Description</th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold">Quantity</th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold">Rate</th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {safeItems.map((item, index) => {
                const amount = (parseFloat(item.quantity.toString()) || 0) * 
                             (parseFloat(item.rate.toString()) || 0);
                return (
                  <tr key={index}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-pre-wrap">
                      {item.description}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 text-right">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 text-right">
                      {formatCurrency(amount)}
                    </td>
                  </tr>
                );
              })}
              {safeItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-4 text-sm text-gray-500 text-center">
                    No items added
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-gray-900">
              <tr>
                <td colSpan={3} className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-gray-900 text-right">
                  Subtotal:
                </td>
                <td className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-gray-900 text-right">
                  {formatCurrency(subtotal)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-gray-900 text-right">
                  Tax ({taxRate}%):
                </td>
                <td className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-gray-900 text-right">
                  {formatCurrency(taxAmount)}
                </td>
              </tr>
              <tr className="border-t border-gray-900">
                <td colSpan={3} className="px-4 sm:px-6 py-3 text-sm sm:text-base font-bold text-gray-900 text-right">
                  Total:
                </td>
                <td className="px-4 sm:px-6 py-3 text-sm sm:text-base font-bold text-gray-900 text-right">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsTable;