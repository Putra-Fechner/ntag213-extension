//% weight=100 color=#0fbc11 icon="\uf2c2"

const RC522_CS = DigitalPin.P16
const RC522_RST = DigitalPin.P12

function spiWrite(address: number, value: number): void {
    pins.digitalWritePin(RC522_CS, 0)
    pins.spiWrite((address << 1) & 0x7E)
    pins.spiWrite(value)
    pins.digitalWritePin(RC522_CS, 1)
}

function spiRead(address: number): number {
    pins.digitalWritePin(RC522_CS, 0)
    pins.spiWrite(((address << 1) & 0x7E) | 0x80)
    const result = pins.spiWrite(0)
    pins.digitalWritePin(RC522_CS, 1)
    return result
}

function sendRawCommand(data: Buffer): void {
    pins.digitalWritePin(RC522_CS, 0)
    for (let i = 0; i < data.length; i++) {
        pins.spiWrite(data[i])
    }
    pins.digitalWritePin(RC522_CS, 1)
}

function initRC522() {
    pins.spiFrequency(1000000)
    pins.spiFormat(8, 0)
    pins.digitalWritePin(RC522_CS, 1)
}

namespace NTAG {
    //% block="NTAG write page %page data %text"
    //% page.min=4 page.max=39
    export function ntagWrite(page: number, text: string): void {
        initRC522()

        let buf = pins.createBuffer(6)
        buf.setUint8(0, 0xA2)         // Write command for NTAG213
        buf.setUint8(1, page)         // Page number
        for (let i = 0; i < 4; i++) {
            buf.setUint8(i + 2, text.charCodeAt(i) || 32) // 4 bytes of data
        }

        sendRawCommand(buf)
        serial.writeLine("Wrote to page " + page + ": " + text)
    }

    //% block="NTAG read page %page"
    //% page.min=4 page.max=39
    export function ntagRead(page: number): string {
        initRC522()

        // Send 0x30 command to read 4 pages (16 bytes)
        let send = pins.createBuffer(2)
        send.setUint8(0, 0x30)
        send.setUint8(1, page)

        pins.digitalWritePin(RC522_CS, 0)
        for (let i = 0; i < 2; i++) {
            pins.spiWrite(send[i])
        }

        // Read 16 bytes; we’ll take the first 4 only
        let result = ""
        for (let i = 0; i < 4; i++) {
            let byte = pins.spiWrite(0)
            result += String.fromCharCode(byte)
        }

        pins.digitalWritePin(RC522_CS, 1)
        serial.writeLine("Read from page " + page + ": " + result)
        return result
    }
}
