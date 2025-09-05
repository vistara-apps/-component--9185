import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Users, Vote, Calendar, Award } from 'lucide-react'
import { usePoll } from '../context/PollContext'

const Analytics = () => {
  const { polls, getStats } = usePoll()
  const stats = getStats()

  // Generate daily vote data for the last 7 days
  const dailyVoteData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      votes: Math.floor(Math.random() * 20) + 5 // Simulated data
    }
  })

  // Poll engagement data
  const engagementData = polls.map(poll => ({
    name: poll.title.length > 15 ? poll.title.substring(0, 15) + '...' : poll.title,
    votes: poll.totalVotes,
    engagement: ((poll.totalVotes / 100) * 100).toFixed(1) // Simulated engagement rate
  }))

  // Category distribution (simulated)
  const categoryData = [
    { name: 'Technology', value: 35, color: '#8b5cf6' },
    { name: 'Business', value: 25, color: '#3b82f6' },
    { name: 'Lifestyle', value: 20, color: '#10b981' },
    { name: 'Education', value: 20, color: '#f59e0b' }
  ]

  const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const TopPoll = ({ poll, rank }) => {
    const colors = ['bg-yellow-600', 'bg-gray-500', 'bg-orange-600']
    const icons = ['🥇', '🥈', '🥉']
    
    return (
      <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
        <div className={`w-8 h-8 ${colors[rank]} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
          {rank + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{poll.title}</p>
          <p className="text-gray-400 text-sm">{poll.totalVotes} votes</p>
        </div>
        <span className="text-xl">{icons[rank]}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Detailed insights into your poll performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Engagement"
          value="87.5%"
          change="+12.3% from last week"
          icon={TrendingUp}
          color="bg-green-600"
          trend="up"
        />
        <MetricCard
          title="Avg Response Time"
          value="2.4m"
          change="-15.2% from last week"
          icon={Calendar}
          color="bg-blue-600"
          trend="up"
        />
        <MetricCard
          title="Active Users"
          value="1,247"
          change="+8.1% from last week"
          icon={Users}
          color="bg-purple-600"
          trend="up"
        />
        <MetricCard
          title="Poll Completion"
          value="93.2%"
          change="+5.7% from last week"
          icon={Award}
          color="bg-orange-600"
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Votes */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Vote Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyVoteData}>
                <defs>
                  <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="votes"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorVotes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Poll Engagement */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Poll Engagement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData.slice(0, 5)}>
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
                <Bar dataKey="votes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
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

        {/* Top Performing Polls */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Polls</h3>
          <div className="space-y-3">
            {polls
              .sort((a, b) => b.totalVotes - a.totalVotes)
              .slice(0, 3)
              .map((poll, index) => (
                <TopPoll key={poll.id} poll={poll} rank={index} />
              ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-800/30">
            <p className="text-sm text-purple-200">
              💡 <strong>Insight:</strong> Polls with clear, specific questions get 40% more engagement
            </p>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h4 className="text-md font-semibold text-white mb-3">Peak Activity</h4>
          <p className="text-2xl font-bold text-purple-400">2:00 PM</p>
          <p className="text-gray-400 text-sm mt-1">Most votes received</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h4 className="text-md font-semibold text-white mb-3">Best Day</h4>
          <p className="text-2xl font-bold text-blue-400">Tuesday</p>
          <p className="text-gray-400 text-sm mt-1">Highest engagement</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h4 className="text-md font-semibold text-white mb-3">Avg Options</h4>
          <p className="text-2xl font-bold text-green-400">3.2</p>
          <p className="text-gray-400 text-sm mt-1">Per poll</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics