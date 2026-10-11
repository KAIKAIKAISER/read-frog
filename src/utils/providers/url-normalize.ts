/**
 * Normalizes OpenAI-compatible base URL.
 * Automatically removes redundant `/chat/completions`, `/completions`, `/chat`,
 * removes trailing slashes, and ensures Ollama endpoints have `/v1`.
 */
export function normalizeOpenAIBaseURL(rawUrl?: string | null): string {
  if (!rawUrl) return ""
  const url = rawUrl.trim()
  if (!url) return ""

  try {
    const parsed = new URL(url)
    let pathname = parsed.pathname.replace(/\/+$/, "")
    if (pathname.endsWith("/chat/completions")) {
      pathname = pathname.slice(0, -"/chat/completions".length)
    } else if (pathname.endsWith("/completions")) {
      pathname = pathname.slice(0, -"/completions".length)
    } else if (pathname.endsWith("/chat")) {
      pathname = pathname.slice(0, -"/chat".length)
    }
    pathname = pathname.replace(/\/+$/, "")

    // If local Ollama port 11434 was entered without path or with root /, append /v1
    if (parsed.port === "11434" && (pathname === "" || pathname === "/")) {
      pathname = "/v1"
    }

    parsed.pathname = pathname
    parsed.hash = ""
    return parsed.toString().replace(/\/+$/, "")
  } catch {
    // If URL parsing fails, fall back to string manipulation
    let cleaned = url.replace(/\/+$/, "")
    if (cleaned.endsWith("/chat/completions")) {
      cleaned = cleaned.slice(0, -"/chat/completions".length)
    } else if (cleaned.endsWith("/completions")) {
      cleaned = cleaned.slice(0, -"/completions".length)
    } else if (cleaned.endsWith("/chat")) {
      cleaned = cleaned.slice(0, -"/chat".length)
    }
    return cleaned.replace(/\/+$/, "")
  }
}
