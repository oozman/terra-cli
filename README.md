# terra-cli

Yet another Terra Money cli, but a little simpler.

<img src="https://i.imgur.com/4UY9o5p.gif"/>

## Usage

### via Node

1. Clone this repository.
2. Do `npm install`
3. Run `node index {command}`

### via Binary

1. Download your binary of choice. See: [#Binaries](https://github.com/oozman/terra-cli#binaries) section below.
2. Run command `./tcli {command}`

## Commands

Here the current available commands.

### Wallet
Get wallet balances.

```
./tcli wallet [options] <address>
```

**Options:**
```
  -l, --lcd-url <value>   Set LCD URL. (default: "https://tequila-lcd.terra.dev")
  -c, --chain-id <value>  Set Chain ID. (default: "tequila-0004")
```

**Example:**
```
  ./tcli wallet terra12vyjr9ges6gv56aj020fsux09cqzr5s0p5sfq4
```

### Anchor APY
Get current Anchor APY.

```
./tcli anchor-apy [options]
```

**Options:**
```
  -l, --lcd-url <value>              Set LCD URL. (default: "https://tequila-lcd.terra.dev")
  -c, --chain-id <value>             Set Chain ID. (default: "tequila-0004")
  -a, --address-provider-id <value>  Set Address Provider ID. (default: "tequila0004")
  -d, --denom <value>                Set Market Denomination. [uusd, ukrw] (default: "uusd")
```

**Example:**

```
  ./tcli anchor-apy
```

### Anchor Deposit
Allows you to deposit your money to Anchor.

```
./tcli anchor-deposit [options] <amountInMicrons> <denom>
```

**Options:**
```
  -l, --lcd-url <value>         Set LCD URL. (default: "https://tequila-lcd.terra.dev")
  -c, --chain-id <value>        Set Chain ID. (default: "tequila-0004")
  -m, --mnemonic <value>        Set your mnemonic key.
  -g, --gas-adjustment <value>  Set gas adjustment. (default: "1.4")
  -p, --gas-price <value>       Set gas price. (default: "0.15uusd")
```

**Example:**

_Deposits 25 UST to Anchor_

```
  ./tcli anchor-deposit 25000000 uusd --mnemonic "word1 word2 ... word24"
```

### Anchor Total Deposit
Get your total money deposited in Anchor.

```
./tcli anchor-total-deposit [options] <address>
```

**Options:**
```
  -l, --lcd-url <value>              Set LCD URL. (default: "https://tequila-lcd.terra.dev")
  -c, --chain-id <value>             Set Chain ID. (default: "tequila-0004")
  -a, --address-provider-id <value>  Set Address Provider ID. (default: "tequila0004")
  -d, --denom <value>                Set Market Denomination. [uusd, ukrw] (default: "uusd")
```

**Example:**

```
  ./tcli anchor-total-deposit terra12vyjr9ges6gv56aj020fsux09cqzr5s0p5sfq4
```

### Anchor Borrow Summary
Get anchor borrow summary.

```
./tcli anchor-borrow-summary [options] <address>
```

**Options:**
```
  -l, --lcd-url <value>              Set LCD URL. (default: "https://tequila-lcd.terra.dev")
  -c, --chain-id <value>             Set Chain ID. (default: "tequila-0004")
  -a, --address-provider-id <value>  Set Address Provider ID. (default: "tequila0004")
  -d, --denom <value>                Set Market Denomination. [uusd, ukrw] (default: "uusd")
```

**Example:**

```
  ./tcli anchor-borrow-summary terra12vyjr9ges6gv56aj020fsux09cqzr5s0p5sfq4
```

### Transaction
Get transaction details of a given hash id.

```
./tcli transaction [options] <hash>
```

**Options:**
```
  -a, --api-url <value>  Set base API URL. (default: "https://tequila-fcd.terra.dev")
```

**Example:**

```
  ./tcli transaction 1F87E2F124B2A42B646EB21999453B170A84FF90356943B97A1448D9BBE52B4F
```

### Send
Allows you to send money to a Terra account address.

```
./tcli send [options] <amountInMicrons> <denom> <toAddress>
```

**Options:**
```
  -l, --lcd-url <value>         Set LCD URL. (default: "https://tequila-lcd.terra.dev")
  -c, --chain-id <value>        Set Chain ID. (default: "tequila-0004")
  -m, --mnemonic <value>        Set your mnemonic key.
  -g, --gas-adjustment <value>  Set gas adjustment. (default: "1.4")
  -p, --gas-price <value>       Set gas price. (default: "0.15uusd")
```

**Example:**

_Sends 50 UST to a specific Terra account adddress_

```
  ./tcli send 50000000 uusd terra12vyjr9ges6gv56aj020fsux09cqzr5s0p5sxxx --mnemonic "word1 word2 ... word24"
```

## Binaries
You can also download the bundled binaries here:

- Linux: https://terra-cli.surge.sh/1.0.0/tcli
- macOS: https://terra-cli.surge.sh/1.0.0/tcli-mac
- Windows: https://terra-cli.surge.sh/1.0.0/tcli-win.exe

## License

```
MIT License

Copyright (c) 2021 Oozman <hi@oozman>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
