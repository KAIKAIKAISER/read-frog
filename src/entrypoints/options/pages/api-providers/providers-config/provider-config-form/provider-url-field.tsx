import type { APIProviderConfig } from "@/types/config/provider"
import { useSelector } from "@tanstack/react-store"
import { isDedicatedLLMProvider, isOpenResponsesLLMProviderConfig } from "@/types/config/provider"
import { PROVIDER_URL_PLACEHOLDERS } from "@/utils/constants/providers"
import { i18n } from "@/utils/i18n"
import { normalizeOpenAIBaseURL } from "@/utils/providers/url-normalize"
import { ConnectionTestButton } from "./components/connection-button"
import { withForm } from "./form"

export const ProviderURLField = withForm({
  ...{ defaultValues: {} as APIProviderConfig },
  render: function Render({ form }) {
    const providerConfig = useSelector(form.store, (state) => state.values)
    const providerType = providerConfig.provider

    if (providerType === "deepl") {
      return null
    }

    if (isOpenResponsesLLMProviderConfig(providerConfig)) {
      return (
        <form.AppField name="url">
          {(field) => (
            <div className="flex flex-col gap-2">
              <field.InputFieldAutoSave
                label={i18n.t("options.apiProviders.form.fields.url")}
                placeholder={PROVIDER_URL_PLACEHOLDERS[providerType]}
                labelExtra={<ConnectionTestButton providerConfig={providerConfig} />}
              />
              <p className="text-xs text-muted-foreground">
                填写完整的响应端点 URL（例如 https://api.example.com/v1/responses）。
              </p>
            </div>
          )}
        </form.AppField>
      )
    }

    const isOptionalBaseURL = isDedicatedLLMProvider(providerType)
    const labelText = `${i18n.t("options.apiProviders.form.fields.baseURL")}${
      isOptionalBaseURL ? ` (${i18n.t("options.apiProviders.form.fields.optional")})` : ""
    }`

    return (
      <form.AppField name="baseURL">
        {(field) => (
          <div className="flex flex-col gap-2">
            <field.InputFieldAutoSave
              label={labelText}
              placeholder={
                providerType === "openai-compatible"
                  ? "https://api.openai.com/v1 或 http://localhost:11434/v1"
                  : PROVIDER_URL_PLACEHOLDERS[providerType]
              }
              onBlur={(e) => {
                if (providerType === "openai-compatible") {
                  const raw = e.target.value
                  const normalized = normalizeOpenAIBaseURL(raw)
                  if (normalized && normalized !== raw) {
                    field.handleChange(normalized)
                  }
                }
              }}
              labelExtra={
                (providerType === "ollama" || providerType === "openai-compatible") && (
                  <ConnectionTestButton providerConfig={providerConfig} />
                )
              }
            />
            {providerType === "openai-compatible" && (
              <div className="flex flex-col gap-1.5 rounded-lg border border-border/80 bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <span>💡</span>
                  <span>OpenAI 兼容模式 API 填写说明</span>
                </div>
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    <strong>标准格式</strong>：填写 API 基础端点，通常以 <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">/v1</code> 结尾（例如：<code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">https://api.openai.com/v1</code>）。
                  </li>
                  <li>
                    <strong>本地模型地址参考</strong>：
                    Ollama 为 <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">http://localhost:11434/v1</code>，LM Studio 为 <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">http://localhost:1234/v1</code>，vLLM 为 <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">http://localhost:8000/v1</code>。
                  </li>
                  <li>
                    <strong>智能容错</strong>：若粘贴时带有了 <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">/chat/completions</code> 等末尾路径，插件会自动为您去除多余部分。
                  </li>
                  <li>
                    <strong>无需密钥</strong>：本地模型或免密反代 API Key 可直接留空，不影响测试和使用。
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </form.AppField>
    )
  },
})
