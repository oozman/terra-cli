const _ = require("lodash");
const {program} = require("commander");
const pkg = require("./package.json");
const Terra = new (require("./entities/Terra"))();
const stringify = require('fast-json-stable-stringify');

program.version(pkg.version);

/**
 * Command: wallet [options] <address>
 */
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

/**
 * Command: anchor-apy [options]
 */
program
    .command("anchor-apy")
    .description("Get current Anchor APY.")
    .option("-l, --lcd-url <value>", "Set LCD URL.", "https://tequila-lcd.terra.dev")
    .option("-c, --chain-id <value>", "Set Chain ID.", "tequila-0004")
    .option("-a, --address-provider-id <value>", "Set Address Provider ID.", "tequila0004")
    .option("-d, --denom <value>", "Set Market Denomination. [uusd, ukrw]", "uusd")
    .action(async (options) => {
        console.log(stringify(await Terra.anchorAPY(options)));
    });

/**
 * Command: transaction [options] <hash>
 */
program
    .command("transaction")
    .arguments("<hash>")
    .description("Get transaction info.", {
        hash: "Your Terra hash id."
    })
    .option("-a, --api-url <value>", "Set base API URL.", "https://tequila-fcd.terra.dev")
    .action(async (hash, options) => {
        console.log(stringify(await Terra.transaction(hash, options)));
    });

program.parse(process.argv);