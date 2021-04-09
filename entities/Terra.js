const _ = require("lodash");
const terra = require("@terra-money/terra.js");

class Terra {

    /**
     * Get wallet info.
     *
     * @param address
     * @param options
     */
    async wallet(address, options) {

        const lcdUrl = _.get(options, "lcdUrl", "https://tequila-lcd.terra.dev");
        const chainId = _.get(options, "chainId", "tequila-0004");

        const lcd = new terra.LCDClient({
            URL: lcdUrl,
            chainID: chainId,
        });

        const mk = new terra.MnemonicKey();
        const wallet = lcd.wallet(mk);

        const resultBalance = await wallet.lcd.bank.balance(address);
        const balance = JSON.parse(resultBalance.toJSON());

        return _.map(balance, value => {
            value.amount = _.parseInt(_.get(value, "amount"));
            return value;
        });
    }
}

module.exports = Terra;