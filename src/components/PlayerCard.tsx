"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { AppPlayer } from "@/interfaces";
import { Chip, CircularProgress, Grid2 } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import { votePlayer } from "@/lib/players";
import { toast } from "react-toastify";
import _ from 'lodash'


const PlayerCard = React.forwardRef(
  (
    props: {
      player: AppPlayer;
      rank: number;
      votedId?: string;
      percent: string;
      toggleProcessing: (val: boolean) => void;
      processing?: boolean;
    },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const [state, setState] = React.useState({ loading: false });

    const { player, rank, percent, toggleProcessing, processing } = props;

    const debounceVote = React.useRef(
        _.debounce(async(id: string) => {
            try {
                setState((prev) => ({ ...prev, loading: true }));
                const result = await votePlayer(id);
                if (result.data) return toast.info(result.message);
                toast.error(result.message);
              } catch (error: any) {
                toast.error(error?.message);
              } finally {
                setState((prev) => ({ ...prev, loading: false }));
                toggleProcessing(false)
              }
        }, 1000)
      ).current;
    
      React.useEffect(() => {
        return () => {
          debounceVote.cancel();
        };
      }, [debounceVote]);
    
      const handleVoting = (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        id: string
      ) => {
        ev.preventDefault();
        toggleProcessing(true)
        debounceVote(id)
      };

    return (
      <div ref={ref}>
        <Card
          sx={{
            height: "100%",
            backgroundColor: (theme) =>
              player.id === props.votedId
                ? theme.palette.info.light
                : undefined,
          }}
        >
          <Box sx={{ height: 150 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ lg: 6, md: 6, sm: 6, xs: 6 }}>
                <Box sx={{ position: "relative" }}>
                  <Box sx={{ position: "absolute", top: 0 }}>
                    <Chip label={rank} color="default" />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography component="h6" variant="h6" sx={{
                        fontSize: { 
                            lg: "1rem", 
                            md: "1rem",
                            sm: "0.8rem",  
                            xs: "0.8rem"
                        }}}>
                      {player.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      component="p"
                      sx={{ 
                        color: "text.secondary",
                        fontSize: { 
                            lg: "1rem", 
                            md: "1rem",
                            sm: "0.8rem",  
                            xs: "0.8rem"
                        } 
                    }}
                    >
                      {player.points} votes - <em>{percent}</em>
                    </Typography>
                  </CardContent>
                  <Box sx={{ pl: 1, pb: 1 }}>
                    <LoadingButton
                      disabled={processing || state.loading}
                      loading={state.loading}
                      onClick={(ev) => handleVoting(ev, player.id)}
                      loadingIndicator={<CircularProgress color="warning" size={16} />}
                      endIcon={<FavoriteBorderOutlined />}
                    >
                      Vote
                    </LoadingButton>
                  </Box>
                </Box>
              </Grid2>
              <Grid2 size={{ lg: 6, md: 6, sm: 6, xs: 6 }}>
                <CardMedia
                  component="img"
                  sx={{ height: 200 }}
                  image={player.thumbnail}
                  alt={player.name}
                />
              </Grid2>
            </Grid2>
          </Box>
        </Card>
      </div>
    );
  }
);

PlayerCard.displayName = "PlayerCard"

export default PlayerCard;
