import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/base-ui/switch"
import { Textarea } from "@/components/ui/base-ui/textarea"
import { configFieldsAtomMap } from "@/utils/atoms/config"
import { ConfigItem } from "../../../components/config-item"
import { ConfigSection } from "../../../components/config-section"

export function OriginSpoofSection() {
  const [originSpoof, setOriginSpoof] = useAtom(configFieldsAtomMap.originSpoof)
  const [text, setText] = useState(() => (originSpoof?.origins || []).join("\n"))

  useEffect(() => {
    setText((originSpoof?.origins || []).join("\n"))
  }, [originSpoof?.origins])

  const handleBlur = () => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    void setOriginSpoof({
      ...originSpoof,
      origins: lines,
    })
  }

  return (
    <ConfigSection title="跨域 Origin 伪装名单 (CORS Origin Spoofing)">
      <ConfigItem
        id="origin-spoof-enable"
        title="启用 Origin 请求头伪装"
        description="向目标服务发起请求时，将 Origin 头修改为目标源自身（类似 KISS Translator 的 禁用Origin名单），解决本地 Ollama 或自建反向代理的跨域限制。"
      >
        <Switch
          checked={originSpoof?.enabled ?? true}
          onCheckedChange={(checked) => {
            void setOriginSpoof({
              ...originSpoof,
              enabled: checked,
            })
          }}
        />
      </ConfigItem>
      {originSpoof?.enabled && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
          <label htmlFor="origin-spoof-textarea" className="text-sm font-medium">
            目标源列表（每行一个 URL 或 Origin，例如 http://localhost:11434）
          </label>
          <Textarea
            id="origin-spoof-textarea"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            placeholder={"http://localhost:11434\nhttps://fanyi.youdao.com"}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            离开输入框后自动保存并生效。配置生效后，发往这些地址的请求将自动伪装同源 Origin。
          </p>
        </div>
      )}
    </ConfigSection>
  )
}
