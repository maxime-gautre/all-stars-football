import { Application, Context, oakCors, Router } from "../deps.ts";
import { getPlayers, PlayerContext } from "./src/domain/players.ts";
import {
  listPlayers,
  listPlayersById,
  searchPlayers,
  updatePlayersVoteCount,
} from "./src/datasources/repositoryPlayers.ts";
import { loggerContext } from "./logger.ts";
import { vote, VoteContext } from "./src/domain/vote.ts";
import { getLastVote, saveVote } from "./src/datasources/repositoryVote.ts";
import {
  InvalidVoteException,
  searchPlayersValidator,
  votePayloadValidator,
} from "./src/domain/types.ts";
import { parseBody, parseQueryParams } from "./src/helpers/oak/parse.ts";

const playerContext: PlayerContext = {
  listPlayers,
  searchPlayers,
  ...loggerContext,
};

const voteContext: VoteContext = {
  getLastVote,
  saveVote,
  listPlayersById,
  updatePlayersVoteCount,
  ...loggerContext,
};

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Ok";
  })
  .get("/players", async ({ response }: Context) => {
    const players = await getPlayers(playerContext)();
    response.status = 200;
    response.body = players;
  })
  .get(
    "/search",
    (ctx: Context) =>
      parseQueryParams(ctx, searchPlayersValidator, async (searchParams) => {
        const players = await getPlayers(playerContext)(
          searchParams.search,
          searchParams.sortBy,
          searchParams.positions,
        );
        ctx.response.status = 200;
        ctx.response.body = players;
      }),
  )
  .post(
    "/vote",
    (ctx: Context) =>
      parseBody(ctx, votePayloadValidator, async (votePayload) => {
        try {
          const savedVote = await vote(voteContext)(votePayload);
          ctx.response.status = 200;
          ctx.response.body = savedVote;
        } catch (error) {
          if (error instanceof InvalidVoteException) {
            ctx.response.status = 400;
            ctx.response.body = {
              message: "Invalid vote",
              errors: error.errors,
            };
          }
        }
      }),
  );

const app = new Application();
app.use(oakCors({
  origin: "*", // todo be more restrictive
  optionsSuccessStatus: 200,
}));
app.use(router.allowedMethods());
app.use(router.routes());

loggerContext.logger.info("Server running at http://localhost:8080/");
await app.listen({ port: 8080 });
