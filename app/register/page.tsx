// app/register/page.tsx

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [teamName, setTeamName] = useState('')
  const [captainName, setCaptainName] = useState('')
  const [players, setPlayers] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const updatePlayer = (index: number, value: string) => {
    const updated = [...players]
    updated[index] = value
    setPlayers(updated)
  }

  const addPlayer = () => {
    setPlayers([...players, ''])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const cleanPlayers = players.filter((p) => p.trim() !== '')

    if (!teamName.trim()) {
      setMessage('Team name is required.')
      setLoading(false)
      return
    }

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: teamName.trim(),
        captain_name: captainName.trim() || null,
      })
      .select()
      .single()

    if (teamError) {
      setMessage(teamError.message)
      setLoading(false)
      return
    }

    if (cleanPlayers.length > 0) {
      const playerRows = cleanPlayers.map((name) => ({
        name: name.trim(),
        team_id: team.id,
      }))

      const { error: playersError } = await supabase
        .from('players')
        .insert(playerRows)

      if (playersError) {
        setMessage(playersError.message)
        setLoading(false)
        return
      }
    }

    setMessage('Team registered successfully!')
    setTeamName('')
    setCaptainName('')
    setPlayers(['', '', '', ''])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-4xl font-bold mb-2">Register Team</h1>
        <p className="text-zinc-400 mb-8">
          Sign up your team for the Beer Olympics.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-zinc-900 p-6 border border-zinc-800"
        >
          <div>
            <label className="block mb-2 font-medium">Team name</label>
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="Shot Callers"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Captain name</label>
            <input
              value={captainName}
              onChange={(e) => setCaptainName(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none focus:border-yellow-400"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Players</label>

            <div className="space-y-3">
              {players.map((player, index) => (
                <input
                  key={index}
                  value={player}
                  onChange={(e) => updatePlayer(index, e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none focus:border-yellow-400"
                  placeholder={`Player ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addPlayer}
              className="mt-3 text-sm text-yellow-400 hover:text-yellow-300"
            >
              + Add another player
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-400 px-4 py-3 font-bold text-black hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register team'}
          </button>

          {message && (
            <p className="text-center text-sm text-zinc-300">{message}</p>
          )}
        </form>
      </div>
    </main>
  )
}