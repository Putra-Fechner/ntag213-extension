//% weight=100 color=#0fbc11 icon="\uf2c2"
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
