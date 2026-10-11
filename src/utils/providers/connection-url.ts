import type {
  APIProviderConfig,
  ProtocolCompatibleLLMProviderConfig,
} from "@/types/config/provider"
import {
  isOpenAICompatibleLLMProviderConfig,
  isOpenResponsesLLMProviderConfig,
} from "@/types/config/provider"
import { normalizeOpenAIBaseURL } from "./url-normalize"

/** Return the configured endpoint used to connect to an API provider. */
export function getProviderConnectionURL(
  providerConfig: ProtocolCompatibleLLMProviderConfig,
): string
export function getProviderConnectionURL(providerConfig: APIProviderConfig): string | undefined
export function getProviderConnectionURL(providerConfig: APIProviderConfig): string | undefined {
  if (isOpenResponsesLLMProviderConfig(providerConfig)) {
    return providerConfig.url
  }
  if (isOpenAICompatibleLLMProviderConfig(providerConfig) && providerConfig.baseURL) {
    return normalizeOpenAIBaseURL(providerConfig.baseURL)
  }
  return providerConfig.baseURL
}
