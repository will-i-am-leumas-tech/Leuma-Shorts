function noop() {}

const LEVEL_ORDER = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export function createLogger({ level = process.env.LOG_LEVEL || "info" } = {}) {
  const activeLevel = LEVEL_ORDER[level] ?? LEVEL_ORDER.info;

  function shouldLog(requestedLevel) {
    return (LEVEL_ORDER[requestedLevel] ?? LEVEL_ORDER.info) <= activeLevel;
  }

  function write(stream, prefix, args) {
    stream.write(`${prefix} ${args.map(String).join(" ")}\n`);
  }

  return {
    level,
    debug(...args) {
      if (shouldLog("debug")) {
        write(process.stdout, "[debug]", args);
      }
    },
    info(...args) {
      if (shouldLog("info")) {
        write(process.stdout, "[info]", args);
      }
    },
    warn(...args) {
      if (shouldLog("warn")) {
        write(process.stderr, "[warn]", args);
      }
    },
    error(...args) {
      if (shouldLog("error")) {
        write(process.stderr, "[error]", args);
      }
    },
    child() {
      return this;
    },
    silent: {
      debug: noop,
      info: noop,
      warn: noop,
      error: noop,
      child() {
        return this;
      },
    },
  };
}
