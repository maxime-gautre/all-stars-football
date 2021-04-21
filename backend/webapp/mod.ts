import { Application, Context, Router, oakCors } from "../deps.ts";
import { getPlayers, PlayerContext } from "./src/domain/players.ts";
import { listPlayers } from "./src/adapters/repositoryPlayers.ts";
import { loggerContext } from "./logger.ts";

const playerContext: PlayerContext = {
  listPlayers,
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
  });

const app = new Application();
app.use(oakCors({
  origin: '*', // todo be more restrictive
  optionsSuccessStatus: 200,
}));
app.use(router.allowedMethods());
app.use(router.routes());

loggerContext.logger.info("Server running at http://localhost:8080/");
await app.listen({ port: 8080 });
