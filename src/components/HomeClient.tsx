"use client";
import { AppPlayer } from "@/interfaces";
import { Box, Container, Fade, Grid2, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import PlayerCard from "./PlayerCard";
import FlipMove from "react-flip-move";
import { useSSEContext } from "@/context/SSEContext";


const calTotalVotes = (players: AppPlayer[]) => {
  return players.reduce((prev, curr) => {
    return prev + curr.points;
  }, 0);
};

const getPercentage = (total: number, votes: number) => {
    if(votes === 0 && total === 0) {
        return `0.00%`
    }
    return `${((votes / total) * 100).toFixed(2)}%`;
};

const HomeClient = ({ players }: { players: AppPlayer[] }) => {
  const [state, setState] = useState<{
    players: AppPlayer[];
    votedPlayerId?: string;
    processing: boolean;
  }>({ players: players, votedPlayerId: undefined, processing: false });

  const { sseSource } = useSSEContext();

  useEffect(() => {
    console.log("sseSource ", sseSource);
    const updateVote = (ev: MessageEvent) => {
      console.log("SSE stream received ", ev);
      const arg: AppPlayer = JSON.parse(ev.data);
      setState((prev) => ({
        ...prev,
        players: prev.players.map((item) => (item.id === arg.id ? arg : item)),
        votedPlayerId: arg.id,
      }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, votedPlayerId: undefined }));
      }, 1500);
    };
    // SSE stream to update player votes
    sseSource?.addEventListener("player_voted", updateVote);
    return () => {
      sseSource?.removeEventListener("player_voted", updateVote);
    };
  }, [sseSource]);

  const toggleProcessing = (val: boolean) => {
    setState(prev => ({...prev, processing: val}))
  }

  const sortPlayers = useMemo(
    () => state.players.sort((a, b) => b.points - a.points),
    [state.players]
  );

  const totalVotes = useMemo(() => calTotalVotes(sortPlayers), [sortPlayers]);

  return (
    <Box
      sx={{
        backgroundImage: "url(/bg2.jpg)",
        minHeight: "100vh",
        width: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: "8px",
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          height: "100%",
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              color: "white",
              py: 3,
              fontFamily: "cursive",
            }}
          >
            Vote Your Favourite Player
          </Typography>
          <Box>
            <Grid2 container spacing={2}>
              <FlipMove typeName={null}>
                {sortPlayers.map((player, index) => (
                  <Grid2
                    size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}
                    key={player.id}
                  >
                    {" "}
                    <Fade in={player.id === state.votedPlayerId}>
                      <PlayerCard
                        votedId={state.votedPlayerId}
                        rank={index + 1}
                        percent={getPercentage(totalVotes, player.points)}
                        player={player}
                        processing={state.processing}
                        toggleProcessing={toggleProcessing}
                      />
                    </Fade>
                  </Grid2>
                ))}
              </FlipMove>
            </Grid2>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeClient;
