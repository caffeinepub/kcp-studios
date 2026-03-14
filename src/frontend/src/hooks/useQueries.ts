import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitHighScore() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      gameName,
      playerName,
      score,
    }: {
      gameName: string;
      playerName: string;
      score: number;
    }) => {
      if (!actor) return;
      await actor.addHighScore(gameName, playerName, BigInt(score));
    },
  });
}
