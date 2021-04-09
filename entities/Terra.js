const _ = require("lodash");
const terra = require("@terra-money/terra.js");
const anchorLib = require("@anchor-protocol/anchor.js");

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

    /**
     * Get Anchor APY.
     *
     * @param options
     * @returns {Promise<{msg: string, data: {apy: number}}>}
     */
    async getAnchorAPY(options) {

        const lcdUrl = _.get(options, "lcdUrl", "https://tequila-lcd.terra.dev");
        const chainId = _.get(options, "chainId", "tequila-0004");
        const addressProviderId = _.get(options, "addressProviderId", "tequila0004");
        const denom = _.get(options, "denom", "uusd");

        const addressProvider = new anchorLib.AddressProviderFromJson(anchorLib[addressProviderId]);

        const lcd = new terra.LCDClient({URL: lcdUrl, chainID: chainId});

        const anchor = new anchorLib.Earn(lcd, addressProvider);

        return {
            msg: "Current Anchor APY.",
            data: {
                apy: await anchor.getAPY({
                    market: denom
                })
            }
        }
    }
}

module.exports = Terra;