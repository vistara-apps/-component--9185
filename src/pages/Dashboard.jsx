import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Vote, BarChart3 } from 'lucide-react'
import { usePoll } from '../context/PollContext'

const Dashboard = () => {
  const { polls, getStats } = usePoll()
  const stats = getStats()

  const chartData = polls.slice(0, 5).map(poll => ({
    name: poll.title.length > 20 ? poll.title.substring(0, 20) + '...' : poll.title,
    votes: poll.totalVotes
  }))

  const pieData = polls.slice(0, 4).map((poll, index) => ({
    name: poll.title.length > 15 ? poll.title.substring(0, 15) + '...' : poll.title,
    value: poll.totalVotes,
    color: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][index % 4]
  }))

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className="text-green-400 text-sm mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const RecentPoll = ({ poll }) => (
    <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      <h4 className="font-semibold text-white mb-2">{poll.title}</h4>
      <p className="text-gray-400 text-sm mb-3">{poll.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{poll.totalVotes} votes</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          poll.status === 'active' 
            ? 'bg-green-900/50 text-green-400 border border-green-800' 
            : 'bg-gray-800 text-gray-400'
        }`}>
          {poll.status}
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your polls.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Polls"
          value={stats.totalPolls}
          icon={BarChart3}
          trend="+12% from last month"
          color="bg-purple-600"
        />
        <StatCard
          title="Active Polls"
          value={stats.activePolls}
          icon={Vote}
          trend="+5% from last week"
          color="bg-blue-600"
        />
        <StatCard
          title="Total Votes"
          value={stats.totalVotes}
          icon={Users}
          trend="+18% from last month"
          color="bg-green-600"
        />
        <StatCard
          title="Avg Votes/Poll"
          value={stats.avgVotesPerPoll}
          icon={TrendingUp}
          trend="+8% from last month"
          color="bg-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Poll Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="votes" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Vote Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Polls */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Polls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {polls.slice(0, 4).map(poll => (
            <RecentPoll key={poll.id} poll={poll} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard