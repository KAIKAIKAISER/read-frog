import type { ProviderConfig } from "@/types/config/provider"
import type { Theme } from "@/types/config/theme"
import { PROVIDER_ITEMS } from "@/utils/constants/providers"

export interface SystemProviderSelectorItem {
  kind: "system"
  id: string
  logo: (theme: Theme) => string
  name: string
  disabled?: boolean
  /** Marks an option no non-Ultra account can run, shown as an "Ultra" badge. */
  requiresUltra?: boolean
}

export type ProviderSelectorOption = ProviderConfig | SystemProviderSelectorItem

export function isSystemProviderSelectorItem(
  provider: ProviderSelectorOption | null | undefined,
): provider is SystemProviderSelectorItem {
  return !!provider && typeof provider === "object" && "kind" in provider && provider.kind === "system"
}

export function getProviderLogo(
  provider: ProviderSelectorOption | null | undefined,
  theme: Theme,
): string {
  if (!provider) return ""
  if (isSystemProviderSelectorItem(provider)) {
    return provider.logo(theme)
  }
  const item = PROVIDER_ITEMS[provider.provider]
  return item ? item.logo(theme) : ""
}

export function getProviderName(provider: ProviderSelectorOption | null | undefined): string {
  return provider?.name ?? ""
}

export function isProviderSelectorOptionDisabled(
  provider: ProviderSelectorOption | null | undefined,
): boolean {
  return isSystemProviderSelectorItem(provider) && provider.disabled === true
}
