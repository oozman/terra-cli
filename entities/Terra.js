const _ = require("lodash");
const terra = require("@terra-money/terra.js");
const anchorLib = require("@anchor-protocol/anchor.js");
const axios = require("axios");

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
    async anchorAPY(options) {

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

    /**
     * Get transaction.
     *
     * @param hash
     * @param options
     * @returns {Promise<{msg: string, data: {fee: any, gas_used: any, gas_wanted: any, txhash, height: any}}>}
     */
    async transaction(hash, options) {

        const apiUrl = _.get(options, "apiUrl", "https://tequila-fcd.terra.dev");

        const result = await axios.get(apiUrl + "/txs/" + hash);

        // Reformat fees.
        const fees = _.get(result, "data.tx.value.fee.amount", []);
        const mappedFees = {
            amount: {},
            gas: 0
        };
        _.map(fees, fee => {
            const denom = _.get(fee, "denom");
            const amount = _.parseInt(_.get(fee, "amount"));

            _.set(mappedFees["amount"], denom, amount);
        });

        // Get gas.
        mappedFees["gas"] = _.parseInt(_.get(result, "data.tx.value.fee.gas", 0));

        const data = {
            txhash: hash,
            fees: mappedFees,
            gas_used: _.parseInt(_.get(result, "data.gas_used", 0)),
            gas_wanted: _.parseInt(_.get(result, "data.gas_wanted", 0)),
            height: _.parseInt(_.get(result, "data.height", 0))
        }

        return {
            msg: "Transaction info.",
            data: data
        }
    }
}

module.exports = Terra;