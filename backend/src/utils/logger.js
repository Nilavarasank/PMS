function timestamp() {
  return new Date().toISOString();
}

function format(level, message, meta) {
  const extra = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp()}] ${level.toUpperCase()} ${message}${extra}`;
}

const logger = {
  info(message, meta) {
    console.log(format('info', message, meta));
  },
  warn(message, meta) {
    console.warn(format('warn', message, meta));
  },
  error(message, meta) {
    console.error(format('error', message, meta));
  },
};

module.exports = logger;
