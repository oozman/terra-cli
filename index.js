const _ = require("lodash");
const {program} = require("commander");
const pkg = require("./package.json");
const Terra = new (require("./entities/Terra"))();
const stringify = require('fast-json-stable-stringify');

program.version(pkg.version);

program
    .command("wallet")
    .arguments("<address>")
    .description("Get wallet info.", {
        address: "Your Terra address or account number."
    })
    .option("-l, --lcd-url <value>", "Set LCD URL.", "https://tequila-lcd.terra.dev")
    .option("-c, --chain-id <value>", "Set Chain ID.", "tequila-0004")
    .action(async (address, options) => {
        console.log(stringify(await Terra.wallet(address, options)));
    });

program.parse(process.argv);