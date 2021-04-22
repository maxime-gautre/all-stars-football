import { Application, Context, getQuery, oakCors, Router } from "../deps.ts";
import { getPlayers, PlayerContext } from "./src/domain/players.ts";
import {
  listPlayers,
  searchPlayers,
} from "./src/adapters/repositoryPlayers.ts";
import { loggerContext } from "./logger.ts";
import get = Reflect.get;

const playerContext: PlayerContext = {
  listPlayers,
  searchPlayers,
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
  .get("/search", async (ctx: Context) => {
    const params = getQuery(ctx);
    const searchQuery = params.search ?? undefined;
    const players = await getPlayers(playerContext)(searchQuery);
    ctx.response.status = 200;
    ctx.response.body = players;
  });

const app = new Application();
app.use(oakCors({
  origin: "*", // todo be more restrictive
  optionsSuccessStatus: 200,
}));
app.use(router.allowedMethods());
app.use(router.routes());

loggerContext.logger.info("Server running at http://localhost:8080/");
await app.listen({ port: 8080 });
