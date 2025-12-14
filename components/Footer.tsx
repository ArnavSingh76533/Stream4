import { FC } from "react"
import IconGithub from "./icon/IconGithub"
import NewTabLink from "./action/NewTabLink"
import IconCopyright from "./icon/IconCopyright"

interface Props {
  error?: number
}

const Footer: FC<Props> = ({ error }) => {
  return (
    <footer className={"flex flex-col bg-gradient-to-r from-dark-900 to-dark-800 py-3 px-6 border-t border-dark-700/50 mt-auto"}>
      {error && <div className="text-red-400 font-medium mb-2">Error {error}</div>}
      <div className={"text-sm flex flex-col gap-2 sm:flex-row sm:items-center text-dark-400"}>
        <div className={"flex flex-row items-center gap-1"}>
          <IconCopyright sizeClassName={"h-3 w-3"}/>
          <NewTabLink href={"t.me/yucant"}>Charlie</NewTabLink>
          2022
        </div>

        <div className="flex flex-row items-center gap-1">
          Icons by
          <NewTabLink href={"https://heroicons.com"}>Heroicons</NewTabLink>
          and
          <NewTabLink href={"https://fontawesome.com"}>Font Awesome</NewTabLink>
        </div>

        <NewTabLink
          className={"ml-auto flex items-center gap-1 hover:text-primary-500 transition-colors"}
          href={"shivam413-Streamer.hf.space"}
        >
          <IconGithub className={"w-4 h-4"} /> Github
        </NewTabLink>
      </div>
    </footer>
  )
}

export default Footer
