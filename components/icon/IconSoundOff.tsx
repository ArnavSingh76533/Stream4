import { FC } from "react"
import Icon, { IconProps } from "./Icon"

const IconSoundOff: FC<IconProps> = ({ className = "", sizeClassName }) => {
  return (
    <Icon className={className} sizeClassName={sizeClassName} viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='M7 9v6h4l5 5V4l-5 5H7z'
      />
    </Icon>
  )
}

export default IconSoundOff
