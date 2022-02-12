var shell = require('shelljs');
const fs = require('fs')

const getConfig = () => {
  return JSON.parse(fs.readFileSync('config.json'))
}

var config = getConfig()

var args = process.argv.slice(2)

var network = args[0]

console.log(typeof config['deployed'][network])

console.log(network)

for(var i in config['deployed'][network]) {

  console.log('truffle run verify ' + i + "@" + config['deployed'][network][i] + " --network " + network)
  shell.exec('truffle run verify ' + i + "@" + config['deployed'][network][i] + " --network " + network)
}
