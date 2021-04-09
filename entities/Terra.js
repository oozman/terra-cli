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

        // Get balance.
        const resultBalance = await wallet.lcd.bank.balance(address);
        const balance = JSON.parse(resultBalance.toJSON());

        const result = {};

        // Reformat data.
        _.each(balance, value => {
            const denom = _.get(value, "denom");
            const amount = _.parseInt(_.get(value, "amount"));

            _.set(result, denom, amount);
        });

        return {
            msg: "Your wallet info.",
            data: result
        }
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