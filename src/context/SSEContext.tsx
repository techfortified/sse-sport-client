'use client'

import { createContext, useContext, useEffect, useState } from "react"

interface SSEContextType {
    sseSource: EventSource | null
}

const SSEContext = createContext<SSEContextType>({ sseSource: null})


const SSEContextProvider = (props: any) => {
    const [eventSource, setEventSource] = useState<EventSource | null>(null)

    useEffect(() => {
      
        const sseSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/stream`, { withCredentials: true })

        setEventSource(sseSource)

        sseSource?.addEventListener("message", (event: MessageEvent<any>) => {
            console.log(`Client is connected to server stream: ${event.data}`)
        })

        sseSource.onerror = (ev) =>{
            console.log("Sse error: ", + ev)
        }

      return () => {
        sseSource?.close()
      }
    }, [])


    return <SSEContext.Provider value={{ sseSource: eventSource}}>
        {props.children}
    </SSEContext.Provider>
    
}

export const useSSEContext = ():SSEContextType => useContext(SSEContext)

export default SSEContextProvider