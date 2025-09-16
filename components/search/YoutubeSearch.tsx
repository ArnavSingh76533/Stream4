"use client"
import { FC, useState } from "react"
import { Socket } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "../../lib/socket"

type Result = {
  id: string
  title: string
  url: string
  duration?: number
  thumbnails?: { url: string; width?: number; height?: number }[]
}

interface Props {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, ms = 5000) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(input, { ...init, signal: controller.signal })
    return res
  } finally {
    clearTimeout(t)
  }
}

async function searchViaServer(q: string, limit = 8): Promise<Result[] | null> {
  try {
    const r = await fetchWithTimeout(`/api/search?q=${encodeURIComponent(q)}&limit=${limit}`, {}, 5000)
    if (!r.ok) return null
    const data = await r.json()
    return Array.isArray(data?.results) ? data.results : null
  } catch {
    return null
  }
}

async function searchViaPipedClient(q: string, limit = 8): Promise<Result[] | null> {
  // Browser → public Piped instances to bypass server DNS issues
  const instances = [
    "https://pipedapi.kavin.rocks",
    "https://piped.video",
    "https://piped.mha.fi",
    "https://piped-api.garudalinux.org",
  ]
  for (const base of instances) {
    try {
      const url = new URL("/search", base)
      url.searchParams.set("q", q)
      const r = await fetchWithTimeout(url.toString(), { cache: "no-store" }, 6000)
      if (!r.ok) continue
      const data = await r.json()
      const items: any[] = Array.isArray(data?.items) ? data.items : []
      const results = items
        .filter((it) => it?.type?.toLowerCase() === "video" && it?.id && it?.title)
        .slice(0, limit)
        .map((it) => {
          const id = it.id
          return {
            id,
            title: it.title,
            url: `https://www.youtube.com/watch?v=${id}`,
            duration: typeof it.duration === "number" ? it.duration : undefined,
            thumbnails: it.thumbnail ? [{ url: it.thumbnail }] : undefined,
          } as Result
        })
      if (results.length) return results
    } catch {
      // try next instance
    }
  }
  return null
}

const YoutubeSearch: FC<Props> = ({ socket }) => {
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [error, setError] = useState<string | null>(null)

  const search = async () => {
    const query = q.trim()
    if (!query) return
    setLoading(true)
    setError(null)
    setResults([])

    // 1) Try server endpoint (YT API key or Piped server-side)
    let found: Result[] | null = await searchViaServer(query, 8)

    // 2) Fallback: Browser → Piped directly (bypasses server DNS)
    if (!found || found.length === 0) {
      found = await searchViaPipedClient(query, 8)
    }

    if (!found || found.length === 0) {
      setError("No results or all search methods failed.")
    } else {
      setResults(found)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          className="input flex-1 bg-neutral-800 p-2 rounded-md outline-none"
          placeholder="Search YouTube (e.g., titanium sia)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search()
          }}
        />
        <button onClick={search} className="btn bg-primary-700 hover:bg-primary-600 px-3 rounded-md">
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div className="grid gap-2">
        {results.map((r) => (
          <div key={r.id} className="flex items-center gap-3 p-2 rounded-md border">
            {r.thumbnails?.[0]?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.thumbnails[0].url} alt="" className="w-16 h-9 object-cover rounded-sm" />
            )}
            <div className="flex-1 overflow-hidden">
              <div className="truncate">{r.title}</div>
              <div className="opacity-60 text-xs truncate">{r.url}</div>
            </div>
            <button
              className="btn bg-primary-800 hover:bg-primary-700 px-3 rounded-md"
              onClick={() => socket?.emit("playUrl", r.url)}
            >
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default YoutubeSearch