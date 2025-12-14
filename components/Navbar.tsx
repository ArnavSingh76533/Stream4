import Link from "next/link"
import Image from "next/image"
import { getSiteDomain, getSiteName } from "../lib/env"
import Button from "./action/Button"
import IconShare from "./icon/IconShare"
import React, { useState } from "react"
import Modal from "./modal/Modal"
import InputClipboardCopy from "./input/InputClipboardCopy"
import { Tooltip } from "react-tooltip"

const Navbar = ({ roomId }: { roomId?: string }) => {
  const [showShare, setShowShare] = useState(false)

  return (
    <div className={"py-2 px-4 flex flex-row gap-2 items-stretch bg-gradient-to-r from-dark-900 to-dark-800 border-b border-dark-700/50 shadow-lg"}>
      <Link
        href={"/"}
        className={
          "flex p-2 shrink-0 flex-row gap-2 items-center rounded-lg action"
        }
      >
        <Image
          src={"/logo_white.png"}
          alt={"Web-SyncPlay logo"}
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span className={"hide-below-sm font-semibold text-lg"}>{getSiteName()}</span>
      </Link>
      {roomId && (
        <>
          <Modal
            title={"Invite your friends"}
            show={showShare}
            close={() => setShowShare(false)}
          >
            <div className="text-dark-300 mb-3">Share this link to let more people join in on the fun</div>
            <InputClipboardCopy
              className={"bg-dark-1000 rounded-lg"}
              value={getSiteDomain() + "/room/" + roomId}
            />
          </Modal>
          <Button
            tooltip={"Share the room link"}
            id={"navbar"}
            actionClasses={"hover:bg-primary-700 active:bg-primary-800 shadow-md hover:shadow-glow"}
            className={"ml-auto px-4 py-2 bg-primary-600 font-medium"}
            onClick={() => setShowShare(true)}
          >
            <div className={"flex items-center mx-1"}>
              <IconShare className={"mr-2"} />
              Share
            </div>
          </Button>
        </>
      )}

      <Tooltip
        anchorId={"navbar"}
        place={"bottom"}
        style={{
          backgroundColor: "var(--dark-700)",
          borderRadius: "0.5rem",
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
        }}
      />
    </div>
  )
}

export default Navbar
