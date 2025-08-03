//% weight=100 color=#0fbc11 icon="\uf2c2"
const RC522_CS = DigitalPin.P16 // Change if you use another pin
const RC522_RST = DigitalPin.P12 // Optional reset pin

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

namespace NTAG {
    //% block="NTAG write page %page data %text"
    //% page.min=4 page.max=39
    export function ntagWrite(page: number, text: string): void {
        let buf = pins.createBuffer(4)
        for (let i = 0; i < 4; i++) {
            buf.setUint8(i, text.charCodeAt(i) || 32)
        }
        serial.writeLine("Would write to page " + page + ": " + text)
    }

    //% block="NTAG read page %page"
    //% page.min=4 page.max=39
    export function ntagRead(page: number): string {
        serial.writeLine("Would read page " + page)
        return "DEMO"
    }
}
