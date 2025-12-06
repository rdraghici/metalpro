import { useEffect, useState } from 'react';
import BackofficeLayout from '@/components/backoffice/BackofficeLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getKPIs, getRFQTrend, getRevenueTrend, getRFQs, type RFQTrendData, type RevenueTrendData } from '@/lib/api/backoffice';
import type { DashboardKPIs, RFQListItem } from '@/types/backoffice';
import { FileText, Clock, DollarSign, CheckCircle2, AlertCircle, TrendingUp, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const BackofficeDashboard = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [rfqTrend, setRfqTrend] = useState<RFQTrendData[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendData[]>([]);
  const [recentRFQs, setRecentRFQs] = useState<RFQListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [kpiData, rfqTrendData, revenueTrendData, rfqsData] = await Promise.all([
          getKPIs(),
          getRFQTrend(),
          getRevenueTrend(),
          getRFQs({ page: 1, limit: 5, sortBy: 'submittedAt', sortOrder: 'desc' }),
        ]);
        setKpis(kpiData);
        setRfqTrend(rfqTrendData);
        setRevenueTrend(revenueTrendData);
        setRecentRFQs(rfqsData.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <BackofficeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </BackofficeLayout>
    );
  }

  if (error) {
    return (
      <BackofficeLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      </BackofficeLayout>
    );
  }

  // Calculate unique customers
  const uniqueCompanies = recentRFQs.length > 0
    ? new Set(recentRFQs.map(rfq => rfq.companyName)).size
    : 0;

  const stats = [
    {
      title: 'Total RFQs',
      value: kpis?.totalRFQs || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/backoffice/rfqs?page=1',
    },
    {
      title: 'Pending RFQs',
      value: kpis?.pendingRFQs || 0,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/backoffice/rfqs?page=1&status=SUBMITTED',
    },
    {
      title: 'Quoted',
      value: kpis?.quotedRFQs || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/backoffice/rfqs?page=1&status=QUOTED',
    },
    {
      title: 'Completed',
      value: kpis?.completedRFQs || 0,
      icon: CheckCircle2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/backoffice/rfqs?page=1&status=COMPLETED',
    },
    {
      title: 'Total Value',
      value: `${((kpis?.totalQuotedValue || 0) / 1000).toFixed(1)}K RON`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Avg Response Time',
      value: `${kpis?.avgResponseTimeHours || 0}h`,
      icon: Clock,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
    {
      title: 'Active Customers',
      value: uniqueCompanies,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <BackofficeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your back-office operations</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const CardComponent = stat.link ? Link : 'div';
            const cardProps = stat.link ? { to: stat.link } : {};

            return (
              <CardComponent key={stat.title} {...cardProps}>
                <Card className={stat.link ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </CardComponent>
            );
          })}
        </div>

        {/* RFQ Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              RFQ Volume Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rfqTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rfqTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rfqs"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="RFQs"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `${value.toLocaleString()} RON`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Revenue (RON)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent RFQ Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent RFQ Activity
            </CardTitle>
            <Link to="/backoffice/rfqs?page=1">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentRFQs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Reference</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Company</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRFQs.map((rfq) => (
                      <tr key={rfq.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link to={`/backoffice/rfqs/${rfq.id}`} className="text-blue-600 hover:underline font-medium">
                            {rfq.referenceNumber}
                          </Link>
                        </td>
                        <td className="py-3 px-4">{rfq.companyName}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rfq.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                            rfq.status === 'ACKNOWLEDGED' ? 'bg-blue-100 text-blue-800' :
                            rfq.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                            rfq.status === 'QUOTED' ? 'bg-green-100 text-green-800' :
                            rfq.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {rfq.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {rfq.finalQuoteAmount || rfq.estimatedTotal ?
                            `${((rfq.finalQuoteAmount || rfq.estimatedTotal || 0) / 1000).toFixed(1)}K RON` :
                            'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(rfq.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500">
                No recent RFQ activity
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </BackofficeLayout>
  );
};

export default BackofficeDashboard;
