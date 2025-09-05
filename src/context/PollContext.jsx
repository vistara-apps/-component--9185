import React, { createContext, useContext, useState, useEffect } from 'react'

const PollContext = createContext()

export const usePoll = () => {
  const context = useContext(PollContext)
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider')
  }
  return context
}

export const PollProvider = ({ children }) => {
  const [polls, setPolls] = useState([
    {
      id: 1,
      title: "What's your favorite programming language?",
      description: "Help us understand the community preferences",
      options: [
        { id: 1, text: "JavaScript", votes: 45 },
        { id: 2, text: "Python", votes: 38 },
        { id: 3, text: "TypeScript", votes: 25 },
        { id: 4, text: "Rust", votes: 12 }
      ],
      totalVotes: 120,
      createdAt: new Date('2024-01-15'),
      status: 'active'
    },
    {
      id: 2,
      title: "Best framework for web development?",
      description: "Share your experience with modern frameworks",
      options: [
        { id: 1, text: "React", votes: 52 },
        { id: 2, text: "Vue", votes: 28 },
        { id: 3, text: "Angular", votes: 15 },
        { id: 4, text: "Svelte", votes: 8 }
      ],
      totalVotes: 103,
      createdAt: new Date('2024-01-10'),
      status: 'active'
    },
    {
      id: 3,
      title: "Remote work preference",
      description: "How do you prefer to work?",
      options: [
        { id: 1, text: "Fully remote", votes: 65 },
        { id: 2, text: "Hybrid", votes: 42 },
        { id: 3, text: "Office only", votes: 18 }
      ],
      totalVotes: 125,
      createdAt: new Date('2024-01-05'),
      status: 'completed'
    }
  ])

  const [userVotes, setUserVotes] = useState({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const createPoll = (pollData) => {
    const newPoll = {
      id: Date.now(),
      ...pollData,
      options: pollData.options.map((option, index) => ({
        id: index + 1,
        text: option,
        votes: 0
      })),
      totalVotes: 0,
      createdAt: new Date(),
      status: 'active'
    }
    setPolls(prev => [newPoll, ...prev])
    return newPoll
  }

  const votePoll = (pollId, optionId) => {
    const voteKey = `${pollId}-${optionId}`
    if (userVotes[pollId]) {
      return false // Already voted
    }

    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 }
            }
            return option
          }),
          totalVotes: poll.totalVotes + 1
        }
      }
      return poll
    }))

    setUserVotes(prev => ({ ...prev, [pollId]: optionId }))
    return true
  }

  const deletePoll = (pollId) => {
    setPolls(prev => prev.filter(poll => poll.id !== pollId))
  }

  const getStats = () => {
    const totalPolls = polls.length
    const activePolls = polls.filter(poll => poll.status === 'active').length
    const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0)
    const avgVotesPerPoll = totalPolls > 0 ? Math.round(totalVotes / totalPolls) : 0

    return {
      totalPolls,
      activePolls,
      totalVotes,
      avgVotesPerPoll
    }
  }

  const getFilteredPolls = () => {
    let filtered = polls

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(poll => 
        poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poll.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(poll => poll.status === filterStatus)
    }

    return filtered
  }

  const duplicatePoll = (pollId) => {
    const originalPoll = polls.find(poll => poll.id === pollId)
    if (!originalPoll) return null

    const duplicatedPoll = {
      ...originalPoll,
      id: Date.now(),
      title: `${originalPoll.title} (Copy)`,
      options: originalPoll.options.map(option => ({
        ...option,
        votes: 0
      })),
      totalVotes: 0,
      createdAt: new Date(),
      status: 'active'
    }

    setPolls(prev => [duplicatedPoll, ...prev])
    return duplicatedPoll
  }

  const updatePollStatus = (pollId, status) => {
    setPolls(prev => prev.map(poll => 
      poll.id === pollId ? { ...poll, status } : poll
    ))
  }

  const value = {
    polls,
    userVotes,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    createPoll,
    votePoll,
    deletePoll,
    getStats,
    getFilteredPolls,
    duplicatePoll,
    updatePollStatus
  }

  return (
    <PollContext.Provider value={value}>
      {children}
    </PollContext.Provider>
  )
}
