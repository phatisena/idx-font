//% color="#2dbded" icon="\uf249"
namespace idxfont {

    let ligs: string[] = []; let ligages: Image[] = []; let ligwidth: number[] = []; let letterspace: number = 1;

    export function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y)
    }

    export function findCommand(tvj: string, chj: string = "", nvj: number): boolean {
        if (((nvj < tvj.length && tvj.charAt(nvj)) && (nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && chj.length <= 0) && (nvj + 3 < tvj.length && tvj.charAt(nvj + 3) == " "))) { return true }
        if (chj.length != 1) { return false }
        if (((nvj < tvj.length && tvj.charAt(nvj) == " ") && (nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && tvj.charAt(nvj + 2) == chj) && (nvj + 3 < tvj.length && tvj.charAt(nvj + 3) == " "))) { return true }
        return false
    }

    export function runInParallel(handler: () => void) {
        control.runInParallel(handler);      
    }

    //%blockid=ixfont_setcharecter
    //%block="set $glyph to $imgi=screen_image_picker staying $notmove erase $bcol spacebar $scol"
    //%bcol.shadow=colorindexpicker
    //%scol.shadow=colorindexpicker
    //%group="create"
    export function setCharecter(glyph: string, imgi: Image, notmove: boolean, bcol: number, scol: number) {
        let scnwidt = true; let scwidt = false; let wi = 0; let wj = 0; let si = 0; let imgj = image.create(imgi.width, imgi.height);
        if (bcol > 0 && bcol < 16) {
            imgi.replace(bcol, 0)
        }
        for (let xw = 0; xw < imgi.width; xw++) {
            si = 0
            for (let yh = 0; yh < imgi.height; yh++) {
                if (scnwidt && (imgi.getPixel(xw, yh) != 0 || (scwidt && imgi.getPixel(xw + 1, yh) != 0))) { si += 1 }
            }
            if (scnwidt) {
                if (scwidt) {
                    if (si <= 0) { wj = xw; scnwidt = false; }
                } else {
                    if (si > 0) { wi = xw; scwidt = true; }
                }
            }
        }
        if (scnwidt) { wj = imgi.width; scnwidt = false; }
        imgj = image.create(Math.abs(wj - wi), imgi.height); drawTransparentImage(imgi, imgj, 0 - wi, 0);
        if (scol > 0 && scol < 16) {
            imgj.replace(scol, 0)
        }
        if (ligs.indexOf(glyph) < 0) {
            ligs.push(glyph); ligages.push(imgj);
            if (notmove) {
                ligwidth.push(0)
            } else {
                ligwidth.push(imgj.width)
            }
        } else {
            ligages[ligs.indexOf(glyph)] = imgj
            if (notmove) {
                ligwidth[ligs.indexOf(glyph)] = 0
            } else {
                ligwidth[ligs.indexOf(glyph)] = imgj.width
            }
        }
    }

    //%blockid=ixfont_setcharfromimgsheet
    //%block="set $PngSheet=screen_image_picker with $GroupChar staying char $StayChar w $twid h $thei bcol $bcl scol $scl"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%group="create"
    export function setCharFromSheet(PngSheet: Image, GroupChar: string, StayChar: string, twid: number, thei: number, bcl: number, scl: number) {
        let gwid = Math.round(PngSheet.width / twid); let uig = image.create(twid, thei); let txi = 0; let tyi = 0;
        for (let tvn = 0; tvn < GroupChar.length; tvn++) {
            uig = image.create(twid, thei); txi = twid * (tvn % gwid); tyi = thei * Math.floor(tvn / gwid); drawTransparentImage(PngSheet, uig, 0 - txi, 0 - tyi); setCharecter(GroupChar.charAt(tvn), uig, StayChar.includes(GroupChar.charAt(tvn)), bcl, scl);
        }
    }

    //%blockid=ixfont_numofglyphs
    //%block="number of glyphs"
    //%group="datainfo"
    export function NumOfGlyphs(): number {
        return ligs.length
    }

    //%blockid=ixfont_arrofgypimg
    //%block="array of glyph images"
    //%group="datainfo"
    export function ImageArray(): Image[] {
        return ligages
    }

    //%blockid=ixfont_arrofglyphs
    //%block="array of glyphs"
    //%group="datainfo"
    export function GlyphArray(): String[] {
        return ligs
    }

    //%blockid=ixfont_setimgfromtext
    //%block="create the image of $input in $iwidt and fill $icol"
    //%icol.shadow=colorindexpicker
    //%group="render"
    export function SetImage(input: string, iwidt: number, icol: number) {
        let heig = 0; let widt = 0; let curwidt = 0; let uwidt = 0; let swidt = 0; let nwidt = 0; let wie = 0; let hie = 0; let hvi = 0;
        for (let currentletter = 0; currentletter < input.length; currentletter++) {
            if (!(ligs.indexOf(input.charAt(currentletter)) < 0)) {
                uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter)))]
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter)))] <= 0) {
                    nwidt = ligages[(ligs.indexOf(input.charAt(currentletter)))].width
                } else {
                    nwidt = 0
                }
                if (uwidt > 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter)))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter + 1, input.length - 1))))] > 0) {
                    wie += letterspace
                }
                hvi = hie + ligages[(ligs.indexOf(input.charAt(currentletter)))].height; heig = Math.max(heig, hvi);
                if (iwidt > 0) {
                    if (wie >= iwidt || findCommand(input, "n", currentletter)) {
                        hie += ligages[(ligs.indexOf(input.charAt(currentletter)))].height; wie = 0;
                        if (findCommand(input, "n", currentletter)) {
                            currentletter += 3
                        }
                    }
                } else if (findCommand(input, "n", currentletter)) {
                    currentletter += 3
                }
            }
        }
        wie = 0; widt = 0;
        for (let currentletter2 = 0; currentletter2 < input.length; currentletter2++) {
            if (!(ligs.indexOf(input.charAt(currentletter2)) < 0)) {
                uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter2)))]
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter2)))] <= 0) {
                    nwidt = ligages[(ligs.indexOf(input.charAt(currentletter2)))].width
                } else {
                    nwidt = 0
                }
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter2 + 1, input.length - 1))))] <= 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter2)))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter2 + 1, input.length - 1))))] > 0) {
                    wie += letterspace
                }
            } else if (input.charAt(currentletter2) == " ") {
                wie += 3 * letterspace
            }
            widt = Math.max(widt, wie)
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter2)) {
                    wie = 0
                    if (findCommand(input, "n", currentletter2)) {
                        currentletter2 += 3
                    }
                }
            } else if (findCommand(input, "n", currentletter2)) {
                currentletter2 += 3
            }
        }
        let output = image.create(widt, heig); hie = 0; wie = 0; curwidt = 0;
        for (let currentletter3 = 0; currentletter3 < input.length; currentletter3++) {
            if (!(ligs.indexOf(input.charAt(currentletter3)) < 0)) {
                hvi = ligages[(ligs.indexOf(input.charAt(currentletter3)))].height; uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter3)))];
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter3)))] <= 0) {
                    nwidt = ligages[(ligs.indexOf(input.charAt(currentletter3)))].width
                } else {
                    nwidt = 0
                }
                drawTransparentImage(ligages[(ligs.indexOf(input.charAt(currentletter3)))], output, curwidt - nwidt, hie + (hvi - ligages[(ligs.indexOf(input.charAt(currentletter3)))].height))
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter3)))] > 0) {
                    curwidt += Math.abs(uwidt - nwidt)
                }
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] > 0) {
                    curwidt += letterspace
                }
            } else if (input.charAt(currentletter3) == " ") {
                curwidt += 3 * letterspace
            }
            if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] > 0) {
                if (iwidt > 0) {
                    if (curwidt >= iwidt || findCommand(input, "n", currentletter3)) {
                        curwidt = 0; hie += hvi;
                        if (findCommand(input, "n", currentletter3)) {
                            currentletter3 += 3
                        }
                    }
                } else if (findCommand(input, "n", currentletter3)) {
                    currentletter3 += 3
                }
            }
        }
        if (icol > 0) {
            for (let ico = 0; ico < 16; ico++) {
                if (ico > 0) {
                    output.replace(ico, icol)
                }
            }
        }
        return output
    }

    //%blockid=ixfont_setletterspacing
    //%block="set letter spacing to $input"
    //%group="modify"
    export function SetSpace(input: number) {
        letterspace = input
    }

    //%blockid=ixfont_changeletterspacing
    //%block="change letter spacing by $input"
    //%group="modify"
    export function ChangeSpace(input: number) {
        letterspace += input
    }


}
