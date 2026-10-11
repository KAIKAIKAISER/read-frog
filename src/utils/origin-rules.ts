import { logger } from "@/utils/logger"

const SPOOF_ORIGIN_RULE_ID_START = 75000
const SPOOF_ORIGIN_RULE_ID_END = 75999

export async function updateOriginSpoofRules(origins: string[]): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.declarativeNetRequest) {
    return
  }

  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
    const removeRuleIds = existingRules
      .filter((r) => r.id >= SPOOF_ORIGIN_RULE_ID_START && r.id <= SPOOF_ORIGIN_RULE_ID_END)
      .map((r) => r.id)

    const addRules: chrome.declarativeNetRequest.Rule[] = []
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
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            requestHeaders: [
              {
                header: "Origin",
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: targetOrigin,
              },
            ],
          },
          condition: {
            urlFilter: `${targetOrigin}/*`,
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
            ],
          },
        })
      } catch (e) {
        logger.warn("[OriginRules] Invalid origin pattern:", trimmed, e)
      }
    }

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules,
    })

    logger.info(`[OriginRules] Updated ${addRules.length} spoofed Origin rule(s)`)
  } catch (error) {
    logger.error("[OriginRules] Failed to update dynamic rules:", error)
  }
}
