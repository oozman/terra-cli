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
     * Get total Anchor deposit.
     *
     * @param address
     * @param options
     * @returns {Promise<{msg: string, data: {total: number}}>}
     */
    async anchorTotalDeposit(address, options) {

        const lcdUrl = _.get(options, "lcdUrl", "https://tequila-lcd.terra.dev");
        const chainId = _.get(options, "chainId", "tequila-0004");
        const addressProviderId = _.get(options, "addressProviderId", "tequila0004");
        const denom = _.get(options, "denom", "uusd");

        const addressProvider = new anchorLib.AddressProviderFromJson(anchorLib[addressProviderId]);
        const lcd = new terra.LCDClient({URL: lcdUrl, chainID: chainId});
        const anchor = new anchorLib.Earn(lcd, addressProvider);

        let total = await anchor.getTotalDeposit({
            market: denom,
            address: address
        });

        // Convert to microns.
        total = total * 100000;

        return {
            msg: "Total Anchor deposit.",
            data: {
                total: total
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

    /**
     * Send money.
     *
     * @param amountInMicrons
     * @param denom
     * @param toAddress
     * @param options
     * @returns {Promise<{msg: string, data: (Block & TxSuccess) | (Block & TxError)}>}
     */
    async send(amountInMicrons, denom, toAddress, options) {

        const lcdUrl = _.get(options, "lcdUrl", "https://tequila-lcd.terra.dev");
        const chainId = _.get(options, "chainId", "tequila-0004");
        const mnemonic = _.get(options, "mnemonic");
        const gasAdjustment = _.get(options, "gasAdjustment", 1.4);
        const gasPrice = _.get(options, "gasPrice", "0.15uusd");

        if (_.isEmpty(mnemonic)) {
            throw new Error("Please provide your mnemonic key.");
        }

        const lcd = new terra.LCDClient({
            URL: lcdUrl,
            chainID: chainId,
        });

        const mk = new terra.MnemonicKey({
            mnemonic: mnemonic
        });
        const wallet = lcd.wallet(mk);

        // Prepare amount param.
        const amountParam = {};
        _.set(amountParam, denom, amountInMicrons);

        const send = new terra.MsgSend(
            wallet.key.accAddress,
            toAddress,
            amountParam
        );

        let result = {};

        try {
            // Let's sign it.
            const msg = await wallet.createAndSignTx({
                msgs: [send],
                gasAdjustment: gasAdjustment,
                gasPrices: gasPrice
            });

            // Let's execute.
            result = await lcd.tx.broadcast(msg);
        } catch (e) {
            const data = _.get(e, "response.data");

            if (_.isEmpty(data)) {
                throw new Error("Something is wrong. Unable to send / broadcast transaction.")
            }

            const errorMsg = _.get(data, "error");

            if (_.isEmpty(errorMsg)) {
                throw new Error("Something is wrong. Not sure what\'s the error.");
            }

            throw new Error(errorMsg);
        }

        // Successful broadcast, but something is wrong happened along the way.
        if (_.has(result, "code")) {
            throw new Error(_.get(result, "raw_log"));
        }

        return {
            msg: "Money sent.",
            data: result
        };
    }

    async anchorDeposit(amountInMicrons, denom, options) {

        const lcdUrl = _.get(options, "lcdUrl", "https://tequila-lcd.terra.dev");
        const chainId = _.get(options, "chainId", "tequila-0004");
        const addressProviderId = _.get(options, "addressProviderId", "tequila0004");
        const mnemonic = _.get(options, "mnemonic");
        const gasAdjustment = _.get(options, "gasAdjustment", 1.4);
        const gasPrice = _.get(options, "gasPrice", "0.15uusd");

        if (_.isEmpty(mnemonic)) {
            throw new Error("Please provide your mnemonic key.");
        }

        const lcd = new terra.LCDClient({
            URL: lcdUrl,
            chainID: chainId
        });

        const mk = new terra.MnemonicKey({
            mnemonic: mnemonic
        });
        const wallet = lcd.wallet(mk);

        const addressProvider = new anchorLib.AddressProviderFromJson(anchorLib[addressProviderId]);
        const anchor = new anchorLib.Earn(lcd, addressProvider);

        let result = {};

        try {

            result = await anchor.depositStable({
                market: denom,
                amount: amountInMicrons / 1000000 // Convert it back away from microns.
            }).execute(wallet, {
                gasAdjustment: gasAdjustment,
                gasPrices: gasPrice
            });
        } catch (e) {
            const data = _.get(e, "response.data");

            if (_.isEmpty(data)) {
                throw new Error("Something is wrong. Unable to send / broadcast transaction.")
            }

            const errorMsg = _.get(data, "error");

            if (_.isEmpty(errorMsg)) {
                throw new Error("Something is wrong. Not sure what\'s the error.");
            }

            throw new Error(errorMsg);
        }

        // Successful broadcast, but something is wrong happened along the way.
        if (_.has(result, "code")) {
            throw new Error(_.get(result, "raw_log"));
        }

        return {
            msg: "Money has been deposited to Anchor.",
            data: result
        };
    }
}

module.exports = Terra;