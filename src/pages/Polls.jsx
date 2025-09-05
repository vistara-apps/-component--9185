import React, { useState } from 'react'
import { Vote, Trash2, Clock, Users, CheckCircle } from 'lucide-react'
import { usePoll } from '../context/PollContext'

const Polls = () => {
  const { polls, userVotes, votePoll, deletePoll } = usePoll()
  const [filter, setFilter] = useState('all')

  const filteredPolls = polls.filter(poll => {
    if (filter === 'active') return poll.status === 'active'
    if (filter === 'completed') return poll.status === 'completed'
    return true
  })

  const handleVote = (pollId, optionId) => {
    const success = votePoll(pollId, optionId)
    if (!success) {
      alert('You have already voted on this poll!')
    }
  }

  const PollCard = ({ poll }) => {
    const hasVoted = userVotes[poll.id]
    const userVotedOption = hasVoted

    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{poll.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{poll.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {poll.totalVotes} votes
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {poll.createdAt.toLocaleDateString()}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                poll.status === 'active' 
                  ? 'bg-green-900/50 text-green-400 border border-green-800' 
                  : 'bg-gray-800 text-gray-400'
              }`}>
                {poll.status}
              </span>
            </div>
          </div>
          <button
            onClick={() => deletePoll(poll.id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {poll.options.map(option => {
            const percentage = poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(1) : 0
            const isUserChoice = userVotedOption === option.id

            return (
              <div key={option.id} className="relative">
                <button
                  onClick={() => handleVote(poll.id, option.id)}
                  disabled={hasVoted || poll.status === 'completed'}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                    hasVoted || poll.status === 'completed'
                      ? 'cursor-not-allowed border-gray-700 bg-gray-800/50'
                      : 'cursor-pointer border-gray-700 hover:border-purple-500 hover:bg-purple-900/20'
                  } ${isUserChoice ? 'border-purple-500 bg-purple-900/30' : ''}`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center">
                      <span className="text-white font-medium">{option.text}</span>
                      {isUserChoice && (
                        <CheckCircle className="w-4 h-4 ml-2 text-purple-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 text-sm">{option.votes}</span>
                      <span className="text-gray-400 text-sm">{percentage}%</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg"
                       style={{ width: `${percentage}%` }} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Polls</h1>
          <p className="text-gray-400">Manage and participate in polls</p>
        </div>
        
        {/* Filter */}
        <div className="mt-4 sm:mt-0">
          <div className="flex bg-gray-800 rounded-lg p-1">
            {['all', 'active', 'completed'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  filter === filterType
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Polls Grid */}
      {filteredPolls.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPolls.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Vote className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No polls found</h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'Create your first poll to get started!' : `No ${filter} polls available.`}
          </p>
        </div>
      )}
    </div>
  )
}

export default Polls