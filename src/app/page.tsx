import { AppPlayer } from "@/interfaces";
import { HomeClient } from "@/components";

const url = process.env.NEXT_PUBLIC_API_URL + "/players"

export const dynamic = "force-dynamic"

export default async function Home() {

  const result = await fetch(url, { method: "GET", next: { revalidate: 0 }});

  if(!result.ok) return <p>Error: Fetching players data failed</p> 

  const players: AppPlayer[] = await result.json();


  return (
    <div>
      <main>
        <HomeClient players={players} />
        </main>
    </div>
  );
}
