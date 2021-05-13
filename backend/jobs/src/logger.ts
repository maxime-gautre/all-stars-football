import { log } from "../../deps.ts";

export type LoggerContext = {
  logger: log.Logger;
};

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },

  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },

    tests: {
      level: "CRITICAL",
      handlers: ["console"],
    },
  },
});

export const loggerContext: LoggerContext = {
  logger: log.getLogger(),
};
