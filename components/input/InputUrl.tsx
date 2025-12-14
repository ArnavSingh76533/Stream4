import { FC, ReactNode, useEffect, useRef, useState } from "react"
import classNames from "classnames"
import IconClose from "../icon/IconClose"
import { isUrl } from "../../lib/utils"

interface Props {
  url: string
  placeholder: string
  tooltip: string
  onSubmit?: () => void
  onChange: (url: string) => void
  className?: string
  children?: ReactNode
}

const InputUrl: FC<Props> = ({
  url,
  placeholder,
  tooltip,
  onSubmit,
  onChange,
  className,
  children,
}) => {
  const [valid, setValid] = useState(url === "" || isUrl(url))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValid(url === "" || isUrl(url))
  }, [url])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (onSubmit) {
          onSubmit()
        }
      }}
      className={classNames("flex flex-col", className)}
    >
      <div
        className={"rounded-lg grow flex flex-row items-center bg-dark-800 border border-dark-700/50 focus-within:border-primary-500/50 transition-all duration-200 overflow-hidden"}
      >
        <input
          ref={inputRef}
          size={1}
          className={classNames("grow bg-transparent p-2.5 outline-none")}
          placeholder={placeholder}
          value={url}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          type={"text"}
          onFocus={() => inputRef.current?.select()}
        />
        {url && (
          <div className={"p-2 cursor-pointer hover:text-red-400 transition-colors"} onClick={() => onChange("")}>
            <IconClose />
          </div>
        )}
        <div>
          <button
            type={"submit"}
            data-tooltip-content={tooltip}
            className={classNames(
              "px-4 py-2.5 font-medium transition-all duration-200",
              valid
                ? "bg-primary-600 hover:bg-primary-700 active:bg-primary-800"
                : "bg-red-600 hover:bg-red-700 active:bg-red-800"
            )}
          >
            {children}
          </button>
        </div>
      </div>
      {!valid && <div className={"text-red-400 text-sm mt-1"}>Invalid url</div>}
    </form>
  )
}

export default InputUrl
