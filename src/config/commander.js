const { Command } = require('commander')

const program = new Command()

program.option('--mode <mode>', 'Enviroment mode', 'production')
program.parse()

module.exports = {
  program
}