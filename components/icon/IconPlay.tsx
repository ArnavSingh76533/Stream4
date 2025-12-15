import { FC } from "react"
import Icon, { IconProps } from "./Icon"

const IconPlay: FC<IconProps> = ({ className = "", sizeClassName }) => {
  return (
    <Icon
      className={className}
      sizeClassName={sizeClassName}
      viewBox='0 0 24 24'
    >
      <path
        fill='currentColor'
        d='M8 5v14l11-7z'
      />
    </Icon>
  )
}

export default IconPlay
