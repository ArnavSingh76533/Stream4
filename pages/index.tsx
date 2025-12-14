import Layout from "../components/Layout"
import { useState } from "react"
import InputText from "../components/input/InputText"
import Button from "../components/action/Button"
import { useRouter } from "next/router"
import { Tooltip } from "react-tooltip"
import useSWR from "swr"

export default function Index() {
  const router = useRouter()
  const { data } = useSWR("/api/stats", (url) =>
    fetch(url).then((r) => r.json())
  )
  const [room, setRoom] = useState("")

  return (
    <Layout meta={{ robots: "index, archive, follow" }} showNavbar={false}>
      <div className={"self-center flex justify-center items-center min-h-[70vh]"}>
        <form
          className={
            "flex flex-col gap-6 justify-center rounded-xl shadow-2xl p-8 bg-gradient-to-br from-dark-800 to-dark-900 m-8 max-w-md w-full border border-dark-700/50"
          }
          onSubmit={async (e) => {
            e.preventDefault()

            if (room.length >= 4) {
              await router.push("/room/" + room)
            }
          }}
        >
          <div className="text-center">
            <h1 className={"text-3xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-2"}>
              Welcome to Streamer
            </h1>
            <p className="text-dark-400 text-sm">Join or create a room to watch together</p>
          </div>
          
          <InputText
            value={room}
            placeholder={"Enter a room ID"}
            onChange={(value) =>
              setRoom(value.toLowerCase().replace(/[^a-z]/g, ""))
            }
          />
          
          <div className={"flex gap-3 justify-end"}>
            <Button
              tooltip={"Create a new personal room"}
              className={"px-4 py-2.5 font-medium"}
              actionClasses={
                "bg-accent-600 hover:bg-accent-700 active:bg-accent-800 shadow-lg hover:shadow-xl"
              }
              onClick={() => {
                fetch("/api/generate")
                  .then((r) => r.json())
                  .then(async ({ roomId }) => {
                    if (
                      typeof roomId === "string" &&
                      roomId.length >= 4 &&
                      roomId.match(/^[a-z]{4,}$/)
                    ) {
                      console.log("Generated new roomId:", roomId)
                      await router.push("/room/" + roomId)
                    } else {
                      throw Error("Invalid roomId generated: " + roomId)
                    }
                  })
                  .catch((error) => {
                    console.error("Failed to generate new roomId", error)
                  })
              }}
            >
              Generate room
            </Button>
            <Button
              tooltip={room.length < 4 ? "Invalid room id" : "Join room"}
              className={"px-4 py-2.5 font-medium"}
              actionClasses={
                room.length >= 4
                  ? "bg-primary-600 hover:bg-primary-700 active:bg-primary-800 shadow-lg hover:shadow-xl hover:shadow-glow"
                  : "bg-dark-700 hover:bg-dark-600 active:bg-red-700 cursor-not-allowed opacity-50"
              }
              disabled={room.length < 4}
              type={"submit"}
            >
              Join room
            </Button>
          </div>
          
          <div className={"mt-2 pt-4 border-t border-dark-700/50"}>
            <small className={"text-dark-400"}>
              <div className="font-medium text-dark-300 mb-1">Currently active:</div>
              <div className={"flex flex-row gap-4 text-sm"}>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>{data?.rooms || 0} Rooms</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-accent-500 rounded-full"></span>
                  <span>{data?.users || 0} Users</span>
                </div>
              </div>
            </small>
          </div>
        </form>
      </div>

      <Tooltip
        style={{
          backgroundColor: "var(--dark-700)",
          borderRadius: "0.5rem",
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
        }}
      />
    </Layout>
  )
}
