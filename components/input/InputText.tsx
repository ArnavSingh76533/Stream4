import { FC, useRef } from "react"
import IconClose from "../icon/IconClose"
import classNames from "classnames"

interface Props {
  value: string
  placeholder: string
  onChange: (value: string) => void
  required?: boolean
  className?: string
  icon?: any
}

const InputText: FC<Props> = ({
  value,
  onChange,
  placeholder,
  icon,
  className = "",
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className={classNames(
        "rounded-lg grow flex flex-row items-center bg-dark-800 border border-dark-700/50 focus-within:border-primary-500/50 transition-all duration-200",
        className
      )}
    >
      {icon && <div className={"ml-2"}>{icon}</div>}
      <input
        ref={inputRef}
        size={1}
        className={"grow rounded-lg bg-transparent px-3 py-2.5 outline-none " + className}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={"text"}
        required={required}
        onFocus={() => inputRef.current?.select()}
      />
      {value && (
        <div className={"p-2 cursor-pointer hover:text-red-400 transition-colors"} onClick={() => onChange("")}>
          <IconClose />
        </div>
      )}
    </div>
  )
}

export default InputText
