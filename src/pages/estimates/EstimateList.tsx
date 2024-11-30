import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle, XCircle, BarChart2, Edit2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getEstimates } from '../../lib/api/estimates';
import { formatCurrency } from '../../utils/currency';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Button from '../../components/shared/Button';

const EstimateList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEstimates();
  }, [user]);

  const fetchEstimates = async () => {
    try {
      if (!user) return;
      const data = await getEstimates(user.id);
      setEstimates(data);
    } catch (err) {
      console.error('Error fetching estimates:', err);
      setError('Failed to load estimates');
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateClick = (id: string) => {
    navigate(`/estimates/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/estimates/edit/${id}`);
  };

  const stats = {
    totalEstimates: estimates.length,
    pendingEstimates: estimates.filter(e => e.status === 'pending').length,
    approvedEstimates: estimates.filter(e => e.status === 'approved').length,
    rejectedEstimates: estimates.filter(e => e.status === 'rejected').length,
    totalRevenue: estimates
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + e.total, 0),
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Estimates</h1>
        <Link
          to="/estimates/new"
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Estimate
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Estimates</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalEstimates}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingEstimates}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.approvedEstimates}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.rejectedEstimates}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart2 className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(stats.totalRevenue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Estimate #
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                Client
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {estimates.map((estimate) => (
              <tr
                key={estimate.id}
                onClick={() => handleEstimateClick(estimate.id)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleEstimateClick(estimate.id);
                  }
                }}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center">
                    <div className="font-medium text-gray-900">{estimate.estimate_number}</div>
                    <div className="ml-4 lg:hidden">
                      <div className="font-medium text-gray-900">{estimate.client?.company}</div>
                      <div className="text-gray-500">{new Date(estimate.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {estimate.client?.company}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {new Date(estimate.created_at).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(estimate.total)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    estimate.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : estimate.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    onClick={(e) => handleEditClick(e, estimate.id)}
                    className="!p-2"
                  >
                    <span className="sr-only">Edit</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstimateList;