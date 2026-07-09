import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Paperclip, Wand2, FileSpreadsheet, Users, Tags, Sparkles, History, X } from 'lucide-react'
import { DuckLogo, SparkleIcon } from '../components/duck-logo'
import { GlassCard } from '../components/ui-bits'
import { runAgent } from '../lib/plAgent'

type Msg = { role: 'user' | 'assistant'; content: string }
type HistorySession = { date: string; messages: Msg[] }

const suggestions = [
  { icon: FileSpreadsheet, label: 'Créer un projet « Refonte CRM » avec 480k€ de revenus' },
  { icon: Users, label: 'Ajouter 3 ressources : Lead PM 950€, Tech Lead 1100€, Designer 780€' },
  { icon: Tags, label: 'Classer mes coûts par catégorie et m\'alerter au-dessus de 90%' },
  { icon: Wand2, label: 'Importer mon P&L depuis un Excel et le réconcilier' },
]

const STORAGE_KEY = 'pl-chat-history'
const SESSIONS_KEY = 'pl-chat-sessions'
const MAX_SESSIONS = 20

function loadSessions(): HistorySession[] {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]') } catch { return [] }
}

function savePreviousSession(msgs: Msg[]) {
  const userMsgs = msgs.filter((m) => m.role === 'user')
  if (!userMsgs.length) return
  const sessions = loadSessions()
  const session: HistorySession = {
    date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
    messages: msgs,
  }
  const updated = [session, ...sessions].slice(0, MAX_SESSIONS)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
}

export default function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [sessions, setSessions] = useState<HistorySession[]>(() => loadSessions())
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const initialMsg: Msg = {
    role: 'assistant',
    content: `Coin ! Coin ! 🦆 je suis l'assistant DuckCash. Décrivez votre projet — client, revenus prévus, équipe, durée — je crée la structure P&L et je remplis les lignes pour vous.`,
  }
  const [messages, setMessages] = useState<Msg[]>([initialMsg])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Keep a ref to latest messages so the unmount cleanup captures them
  const messagesRef = useRef(messages)
  useEffect(() => { messagesRef.current = messages }, [messages])
  useEffect(() => {
    return () => { savePreviousSession(messagesRef.current) }
  }, [])

  async function send(text: string) {
    const v = text.trim()
    if (!v || loading) return
    setInput('')
    const userMsg: Msg = { role: 'user', content: v }
    const withUser = [...messages, userMsg]
    setMessages(withUser)
    setLoading(true)
    try {
      const history = messages.filter((m) => m.role !== 'assistant' || messages.indexOf(m) > 0)
      const response = await runAgent(v, history)
      const assistantMsg: Msg = { role: 'assistant', content: response.text }
      const next = [...withUser, assistantMsg]
      setMessages(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } finally {
      setLoading(false)
    }
  }

  function handleShowHistory() {
    setSessions(loadSessions())
    setShowHistory(true)
  }

  function restoreSession(session: HistorySession) {
    savePreviousSession(messages)
    setMessages(session.messages)
    setShowHistory(false)
  }

  return (
    <div>
      <div className="mx-auto flex max-w-3xl flex-col items-center pt-6 pb-4 text-center">
        <DuckLogo size={72} className="mb-6" />
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <SparkleIcon size={14} />
          Assistant P&amp;L
          <span className="ml-1 inline-flex items-center gap-1 text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" /> en ligne
          </span>
        </div>
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight">
          Construisez votre P&amp;L <span className="text-gradient-ai">en langage naturel</span>
        </h1>
        <p className="mt-4 max-w-xl text-[14px] text-muted-foreground">
          DuckCash transforme vos phrases en lignes budgétaires, ressources et catégories.
          Précision financière, vitesse de conversation.
        </p>
      </div>

      <GlassCard className="mx-auto mt-6 max-w-3xl !p-0 glass-strong" glow="violet">
        {/* Conversation */}
        <div ref={scrollRef} className="max-h-[420px] space-y-4 overflow-y-auto px-6 py-6">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex gap-3'}>
              {m.role === 'assistant' && (
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card ring-gradient-ai">
                  <SparkleIcon size={14} />
                </div>
              )}
              <div
                className={
                  m.role === 'user'
                    ? 'max-w-[80%] rounded-2xl rounded-tr-sm border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-pink-500/10 px-4 py-2.5 text-[14px]'
                    : 'max-w-[80%] rounded-2xl rounded-tl-sm border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[14px] text-foreground'
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card ring-gradient-ai">
                <SparkleIcon size={14} />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-white/[0.08] p-3">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-2 focus-within:border-white/[0.15]"
          >
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
              <Paperclip className="h-4 w-4" />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
              }}
              rows={1}
              placeholder="Décrivez votre projet, vos revenus, votre équipe…"
              className="min-h-[36px] max-h-40 flex-1 resize-none bg-transparent px-1 py-2 text-[14px] placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-ai text-[#0a0b10] transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
        </div>
      </GlassCard>

      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => {
          const Icon = s.icon
          return (
            <button
              key={i}
              onClick={() => { setInput(s.label); setTimeout(() => textareaRef.current?.focus(), 0) }}
              className="group flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-left text-[13px] text-muted-foreground transition-colors hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-foreground"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-ai-soft">
                <Icon className="h-3.5 w-3.5 text-foreground" />
              </span>
              {s.label}
            </button>
          )
        })}
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl items-center justify-center gap-3 text-[12px] text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        <span>
          Pressé ?{' '}
          <Link to="/" className="text-brand hover:underline">Ouvrir le dashboard</Link>
          {' '}ou{' '}
          <Link to="/projects" className="text-brand hover:underline">parcourir mes projets</Link>.
        </span>
      </div>

      {/* History button */}
      <button
        onClick={handleShowHistory}
        className="fixed bottom-6 right-6 flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-card/90 px-3 py-2 text-[12px] text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:border-white/25 hover:text-foreground"
      >
        <History className="h-3.5 w-3.5" />
        Historique
      </button>

      {/* History drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-end justify-end" onClick={() => setShowHistory(false)}>
          <div
            className="relative m-4 mb-16 mr-6 flex max-h-[70vh] w-80 flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-card/95 shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <span className="text-[13px] font-medium">Historique des conversations</span>
              <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sessions.length === 0 ? (
                <p className="px-4 py-6 text-center text-[12px] text-muted-foreground">Aucune conversation précédente.</p>
              ) : (
                sessions.map((s, i) => {
                  const preview = s.messages.filter((m) => m.role === 'user')[0]?.content ?? ''
                  return (
                    <button
                      key={i}
                      onClick={() => restoreSession(s)}
                      className="w-full border-b border-white/[0.05] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                    >
                      <p className="text-[11px] text-muted-foreground">{s.date}</p>
                      <p className="mt-0.5 line-clamp-2 text-[12px] text-foreground/80">{preview}</p>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
