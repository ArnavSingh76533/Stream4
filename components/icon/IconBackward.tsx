import { FC } from "react"
import Icon, { IconProps } from "./Icon"

const IconBackward: FC<IconProps> = ({ className = "", sizeClassName }) => {
  return (
    <Icon className={className} sizeClassName={sizeClassName} viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z'
      />
    </Icon>
  )
}

export default IconBackward
