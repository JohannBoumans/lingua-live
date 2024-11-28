import { useRef } from "react"

export function VideoPlayer ({ muted } : { muted: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null)

    return (
        <video ref={videoRef} muted={muted} autoPlay className="h-full max-h-screen w-screen object-cover rounded-lg" />
    )
}