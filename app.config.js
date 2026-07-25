const fs = require('fs');
const path = require('path');

const appJson = require('./app.json');

function readEnvValue(name) {
  if (process.env[name]) {
    return process.env[name];
  }

  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    return '';
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  const prefix = `${name}=`;
  const line = lines.find((item) => item.startsWith(prefix));

  return line ? line.slice(prefix.length).trim() : '';
}

module.exports = ({ config }) => ({
  ...appJson.expo,
  ...config,
  extra: {
    ...(appJson.expo.extra || {}),
    ...(config.extra || {}),
    yandexMapsApiKey: readEnvValue('EXPO_PUBLIC_YANDEX_MAPS_API_KEY'),
  },
});
