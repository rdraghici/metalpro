import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BackofficeLayout from '@/components/backoffice/BackofficeLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRFQs } from '@/lib/api/backoffice';
import type { RFQListItem, PaginatedResponse } from '@/types/backoffice';
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const BackofficeRFQList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rfqs, setRfqs] = useState<PaginatedResponse<RFQListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('companyName') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    loadRFQs();
  }, [page, statusFilter]);

  const loadRFQs = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params: any = {
        page,
        limit: 20,
        sortBy: 'submittedAt',
        sortOrder: 'desc',
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (searchTerm) {
        params.companyName = searchTerm;
      }

      const data = await getRFQs(params);
      setRfqs(data);

      // Update URL params
      const newParams: any = { page: page.toString() };
      if (statusFilter !== 'all') newParams.status = statusFilter;
      if (searchTerm) newParams.companyName = searchTerm;
      setSearchParams(newParams);
    } catch (err: any) {
      setError(err.message || 'Failed to load RFQs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadRFQs();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
        status === 'ACKNOWLEDGED' ? 'bg-blue-100 text-blue-800' :
        status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
        status === 'QUOTED' ? 'bg-green-100 text-green-800' :
        status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
        'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <BackofficeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RFQ Management</h1>
          <p className="text-gray-500 mt-1">Browse and manage customer RFQ submissions</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search by company name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="QUOTED">Quoted</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RFQ List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : rfqs && rfqs.data && rfqs.data.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  RFQs ({rfqs.pagination.total})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rfqs.data.map((rfq) => (
                    <Link
                      key={rfq.id}
                      to={`/backoffice/rfqs/${rfq.id}`}
                      className="block"
                    >
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="bg-primary/10 p-3 rounded-lg">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{rfq.companyName}</h3>
                                {getStatusBadge(rfq.status)}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Ref:</span> {rfq.referenceNumber}
                                </div>
                                <div>
                                  <span className="font-medium">Contact:</span> {rfq.contactPerson}
                                </div>
                                <div>
                                  <span className="font-medium">Email:</span> {rfq.email}
                                </div>
                                <div>
                                  <span className="font-medium">Submitted:</span>{' '}
                                  {format(new Date(rfq.submittedAt), 'MMM d, yyyy HH:mm')}
                                </div>
                              </div>
                              {rfq.estimatedTotal && (
                                <div className="mt-2 text-sm">
                                  <span className="font-medium">Estimated Value:</span>{' '}
                                  <span className="text-primary font-semibold">
                                    {rfq.estimatedTotal.toFixed(2)} RON
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {rfq.assignedToId && (
                              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Assigned
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {rfqs.pagination.pages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {rfqs.pagination.page} of {rfqs.pagination.pages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === rfqs.pagination.pages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No RFQs found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </BackofficeLayout>
  );
};

export default BackofficeRFQList;
