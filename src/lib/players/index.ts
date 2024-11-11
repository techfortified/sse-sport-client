import { axiosAPI } from "@/config"
import { AppPlayer } from "@/interfaces"

export const votePlayer = async(playerId: string) =>{
    try {
        const result = await axiosAPI.post("/players/votes", { playerId } )
        return { data: result.data as AppPlayer, message: "Player voted"}
    } catch (error: any) {
        let message = error?.message
        if(error?.response){
            message = error?.response?.data
        }
        return { data: null, message }
    }
}