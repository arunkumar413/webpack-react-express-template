
const pino = require('pino');
const fs = require('node:fs');
const path = require('node:path');

const logDir = path.join(__dirname, 'logs');

fs.mkdirSync(logDir, { recursive: true });

const allLogs = pino.destination({
  dest: path.join(logDir, 'app.log'),
  sync: false
});

const errorLogs = pino.destination({
  dest: path.join(logDir, 'error.log'),
  sync: false
});

const streams = [
  { level: 'info', stream: allLogs },
  { level: 'error', stream: errorLogs }
];

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime
  },
  pino.multistream(streams)
);

module.exports = logger;
