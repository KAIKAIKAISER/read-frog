import { useAtom } from "jotai"
import { Switch } from "@/components/ui/base-ui/switch"
import { Textarea } from "@/components/ui/base-ui/textarea"
import { configFieldsAtomMap } from "@/utils/atoms/config"
import { ConfigItem } from "../../../components/config-item"
import { ConfigSection } from "../../../components/config-section"

export function OriginSpoofSection() {
  const [originSpoof, setOriginSpoof] = useAtom(configFieldsAtomMap.originSpoof)
  const defaultText = (originSpoof?.origins || []).join("\n")

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value
      .split(/[\n,;，；\s]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    const uniqueLines = Array.from(new Set(lines))
    void setOriginSpoof({
      ...originSpoof,
      origins: uniqueLines,
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
            目标源列表（支持换行、中英文逗号 , ，、分号 ; ； 或空格分隔）
          </label>
          <Textarea
            key={defaultText}
            id="origin-spoof-textarea"
            rows={4}
            defaultValue={defaultText}
            onBlur={handleBlur}
            placeholder={"http://localhost:11434, https://fanyi.youdao.com\nhttps://dict.youdao.com"}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            离开输入框后自动保存并生效。支持使用换行、中英文逗号或分号分隔多个域名。保存后将自动格式化并伪装同源 Origin。
          </p>
        </div>
      )}
    </ConfigSection>
  )
}
