import { browser } from "#imports"
import { logger } from "@/utils/logger"

const SPOOF_ORIGIN_RULE_ID_START = 75000
const SPOOF_ORIGIN_RULE_ID_END = 75999

export async function updateOriginSpoofRules(origins: string[]): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof browser === "undefined" || !browser.declarativeNetRequest) {
    return
  }

  try {
    const existingRules = await browser.declarativeNetRequest.getDynamicRules()
    const removeRuleIds = existingRules
      .filter((r) => r.id >= SPOOF_ORIGIN_RULE_ID_START && r.id <= SPOOF_ORIGIN_RULE_ID_END)
      .map((r) => r.id)

    // DeclarativeNetRequest dynamic rule structure
    const addRules = []
    let currentId = SPOOF_ORIGIN_RULE_ID_START

    for (const rawOrigin of origins) {
      const trimmed = rawOrigin.trim()
      if (!trimmed) continue

      try {
        const urlStr = trimmed.startsWith("http://") || trimmed.startsWith("https://")
          ? trimmed
          : `https://${trimmed}`
        const url = new URL(urlStr)
        const targetOrigin = url.origin

        addRules.push({
          id: currentId++,
          priority: 1,
          action: {
            type: "modifyHeaders" as const,
            requestHeaders: [
              {
                header: "Origin",
                operation: "set" as const,
                value: targetOrigin,
              },
            ],
          },
          condition: {
            urlFilter: `${targetOrigin}/*`,
            resourceTypes: ["xmlhttprequest" as const],
          },
        })
      } catch (e) {
        logger.warn("[OriginRules] Invalid origin pattern:", trimmed, e)
      }
    }

    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules,
    })

    logger.info(`[OriginRules] Updated ${addRules.length} spoofed Origin rule(s)`)
  } catch (error) {
    logger.error("[OriginRules] Failed to update dynamic rules:", error)
  }
}
