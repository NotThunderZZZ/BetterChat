let _isNameReg = false
let NAME = ""
let UUID = ""
let pk = ""

const net = require("node:tls")
const net_ = require("node:net")
const fs = require("fs")
const color = require("colors")
const path = require("node:path")
if(!fs.existsSync(path.resolve('./cfg.json'))) {
    fs.appendFileSync(path.resolve('./cfg.json'), JSON.stringify({address: "0.0.0.0", port: 32523}))
    console.log("[LOG] INFO: ".bgCyan + "Created configuration file %s", path.resolve("./cfg.json"))
}
const options = require('./cfg.json')
const EventEmitter = require("node:events")

/**
 * Payload class.
 * Used for further parsing business. Don't care 'bout diz
 */
class Payload {
    /**
     * 
     * @param {string} m 
     * @param {string} u 
     * @param {string | number} t 
     * @param {(string | undefined)} [n=NAME] 
     */
    constructor(m, u, t, n) {
        if(typeof m !== "string" || typeof u !== "string" || parseInt(t) == NaN) {
            throw new TypeError("Invalid input. [PAYLOAD class]") // wanna know where is the input from
        }
        this.message = m // Message
        this.user = u // UUID
        this.time = t // Timestamp
        this.name = (!!n) ? n : NAME  
    }
}

class CLUtil {
    /**
     * Create a client with provided UUID.
     * Modified code by TCP-Toolkit. Under tcp-client folder.
     * @author NullifiedTheDev
     * @param {string} _UUID
     */
    constructor(_UUID) {
        this.UUID = _UUID || UUIDGen()
        this.socket = net.connect({port: parseInt(options.port) !== NaN ? parseInt(options.port) : 32523, host: net_.isIP(options.address) ? options.address : "0.0.0.0"}, () => {
            console.log("Connected to server.")
            this.socket.setKeepAlive(5000)
            this.socket.setNoDelay(true)
        })
    }

    
    parser(inp=new Payload("*empty*", UUID, Date.now())) {
        if(!inp instanceof Payload) {
            throw new TypeError("Invalid input. [CLUtil class/parser method]")
        }
        return {hdr: "MESSAGE", msg: inp.message, uuid: inp.user, ts: inp.time, name: inp.name}
    }

    /**
         * Handles data. From TCP-Toolkit made compatible with the new chat
         * @param {Buffer} input 
         * @returns 
         */
    datahandler(input) {
        try {
            return JSON.parse(input.toString("utf-8"))
        } catch(e) {
            return {hdr: "MSG", msg: "*Message couldn't be parsed!", uuid: "coffee00-1234-1234-abcdabcd", ts: Date.now(), name: "(unknown)"}
        }
    }

    /**
     * Self explainatory name.
     * @returns... yk!
     */
    getSocket() {
        return this.socket
    }
}

net.connect({port: parseInt(options.port) !== NaN ? parseInt(options.port) : 32523, host: net_.isIP(options.address) ? options.address : "0.0.0.0"})
    .on("connect", () => {
        console.log("Connected to server.")
    })
    .on("data", (d) => {
        let JSONified = JSON.parse(d.toString("utf8"))
        if(JSONified.hdr === "ENC" && !!JSONified.pk) {pk = JSON.parse(d.toString('utf8')).pk}
        if(JSONified.hdr === "MSG") {
            
        }
    })