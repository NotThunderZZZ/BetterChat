const crypto = require('crypto'); 
const net = require("tls")
const fs = require("fs")
const color = require("colors")
const path = require("node:path")
if(!fs.existsSync(path.resolve('./cfg.json'))) {
    fs.appendFileSync(path.resolve('./cfg.json'), JSON.stringify({port: 32523}))
    console.log("[LOG] INFO: ".bgCyan + "Created configuration file %s", path.resolve("./cfg.json"))
}
const config = require('./cfg.json')

let pk;

function gen() { 
    const keyPair = crypto.generateKeyPairSync('rsa-pss', { 
        modulusLength: 1024, 
        publicKeyEncoding: { 
            type: 'spki', 
            format: 'pem',
        }, 
        privateKeyEncoding: { 
            type: 'pkcs8', 
            format: 'pem', 
            cipher: 'aes-256-cbc', 
            passphrase: '' // crypto.createHash("sha512")
            //     .update(crypto.createHash("sha512")
            //         .update(Date.now().toString())
            //         .digest("hex")
            //         .replace(/e/gi, Date.now().toString().repeat(57))
            //         .toString())
            //     .digest("hex")
            //     .toString()
            //     .repeat(445)
            //     .slice(24,88)
        } 
    });
    pk = keyPair.publicKey
} 

gen()

const s = net.createServer().listen(config.port, "0.0.0.0", 256, () => {
    process.stdout.write('Sucess! Listening on ' + s.address().address + ':' + s.address().port + '\nNotice: Packets sent by client will not be parsed.\n')
})

s.on("connection", (sk) => {
    sk.setKeepAlive(5000);
    sk.setNoDelay(true)
    sk.setEncoding("utf-8")
    sk.write(JSON.stringify({"hdr": "ENC", "pk": pk}, "", " "))
    sk.on("error", () => {console.log("w")})
}).on("error", () => {
    console.log("w")
})

// process.on("beforeExit", () => {
//     fs.rmSync(path.resolve("./public_key"))
// })