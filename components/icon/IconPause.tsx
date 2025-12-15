import { FC } from "react"
import Icon, { IconProps } from "./Icon"

const IconPause: FC<IconProps> = ({ className = "", sizeClassName }) => {
  return (
    <Icon
      className={className}
      sizeClassName={sizeClassName}
      viewBox='0 0 24 24'
    >
      <path
        fill='currentColor'
        d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'
      />
    </Icon>
  )
}

export default IconPause
