const dotenv = require('dotenv')
const fs = require('fs')
const env = fs.readFileSync('.env')
const buf = Buffer.from(env)
const currentConfig = dotenv.parse(buf)

function updateEnv(config = {}, eol = '\n'){
  const envContents = Object.entries({...currentConfig, ...config})
    .map(([key,val]) => `${key}=${val}`)
    .join(eol)
  fs.writeFileSync('.env', envContents);
}

module.exports = updateEnv