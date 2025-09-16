import type { NextApiRequest, NextApiResponse } from "next"
import { execFile } from "node:child_process"

type YtResult = {
  id: string
  title: string
  url: string
}

function run(cmd: string, args: string[]) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    execFile(cmd, args, { maxBuffer: 16 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return reject(Object.assign(err, { stdout, stderr }))
      resolve({ stdout, stderr })
    })
  })
}

// Extract the first YouTube watch URL from yt-dlp verbose output.
function extractFirstYoutubeUrl(text: string): string | null {
  // Look for explicit "Extracting URL: <url>" first
  const explicit = text.match(/Extracting URL:\s*(https?:\/\/[^\s]+)/i)
  if (explicit?.[1]) return explicit[1]

  // Fallback: find any YouTube watch URL in output
  const anyWatch = text.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w\-]{6,}/i)
  if (anyWatch?.[0]) return anyWatch[0]

  return null
}

// Pull the 11-char YouTube video id from a watch URL
function videoIdFromUrl(u: string): string | null {
  try {
    const url = new URL(u)
    const id = url.searchParams.get("v")
    if (id) return id
  } catch {
    // ignore
  }
  // Fallback quick parse
  const m = u.match(/[?&]v=([\w\-]{6,})/)
  return m?.[1] || null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q || "").toString().trim()
  if (!q) return res.status(400).json({ error: "Missing q" })

  try {
    // Use exactly the approach that works in your environment:
    // yt-dlp "ytsearch:<query>"
    // We also add --skip-download to avoid writing files to disk.
    const term = `ytsearch:${q}`
    const { stdout, stderr } = await run("yt-dlp", [term, "--no-warnings", "--skip-download"])

    const url = extractFirstYoutubeUrl(stdout + "\n" + stderr)
    if (!url) {
      return res.status(502).json({
        error: "no_url_found",
        detail: "yt-dlp did not print a watch URL. Full logs are suppressed in production.",
      })
    }

    const id = videoIdFromUrl(url) || ""
    const results: YtResult[] = [
      {
        id,
        url,
        // Use the query as a placeholder title; client can show this or just use Play.
        title: q,
      },
    ]
    return res.json({ results, source: "yt-dlp-ytsearch" })
  } catch (err: any) {
    console.error("yt-dlp search failed", err)
    return res.status(500).json({
      error: "search_failed",
      detail: err?.stderr || err?.message || "unknown_error",
    })
  }
}