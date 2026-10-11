import { describe, expect, it } from "vitest"
import { normalizeOpenAIBaseURL } from "../url-normalize"

describe("normalizeOpenAIBaseURL", () => {
  it("removes /chat/completions suffix", () => {
    expect(normalizeOpenAIBaseURL("http://localhost:11434/v1/chat/completions")).toBe(
      "http://localhost:11434/v1",
    )
    expect(normalizeOpenAIBaseURL("https://api.openai.com/v1/chat/completions")).toBe(
      "https://api.openai.com/v1",
    )
  })

  it("removes /chat and /completions suffix", () => {
    expect(normalizeOpenAIBaseURL("http://localhost:11434/chat/completions")).toBe(
      "http://localhost:11434/v1",
    )
    expect(normalizeOpenAIBaseURL("https://api.deepseek.com/chat")).toBe("https://api.deepseek.com")
  })

  it("appends /v1 for Ollama default port 11434 when path is empty", () => {
    expect(normalizeOpenAIBaseURL("http://localhost:11434")).toBe("http://localhost:11434/v1")
    expect(normalizeOpenAIBaseURL("http://127.0.0.1:11434/")).toBe("http://127.0.0.1:11434/v1")
  })

  it("strips trailing slashes", () => {
    expect(normalizeOpenAIBaseURL("https://example.com/v1/")).toBe("https://example.com/v1")
  })

  it("preserves query parameters", () => {
    expect(
      normalizeOpenAIBaseURL("https://example.com/v1/chat/completions?api-version=2026#frag"),
    ).toBe("https://example.com/v1?api-version=2026")
  })

  it("handles empty or null values gracefully", () => {
    expect(normalizeOpenAIBaseURL("")).toBe("")
    expect(normalizeOpenAIBaseURL(null)).toBe("")
    expect(normalizeOpenAIBaseURL(undefined)).toBe("")
  })
})
