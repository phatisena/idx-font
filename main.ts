//% color="#2dbded" icon="\uf249"
namespace idxfont {

    let ligs: string[] = []; let ligages: Image[] = []; let ligwidth: number[] = []; let letterspace: number = 1;

    export function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y);
    }

    export function findCommand(tvi: string, chi: string, nvi: number): boolean {
        if (chi.length != 1) { return false }
        if (((nvi < tvi.length && tvi.charAt(nvi) == " ") && (nvi + 1 < tvi.length && tvi.charAt(nvi + 1) == "\\")) && ((nvi + 2 < tvi.length && tvi.charAt(nvi + 2) == chi) && (nvi + 3 < tvi.length && tvi.charAt(nvi + 3) == " "))) { return true }
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
        let scnwidt: boolean = true; let scwidt: boolean = false; let wi: number = 0; let wj: number = 0; let si: number = 0; let imgj: Image = null;
        if (bcol > 0 && bcol < 16) {
            imgi.replace(bcol, 0)
        }
        for (let xw = 0; xw < imgi.width; xw++) {
            si = 0
            for (let yh = 0; yh < imgi.height; yh++) {
                if (scnwidt && (imgi.getPixel(xw, yh) != 0 || (scwidt && imgi.getPixel(xw + 1, yh) != 0))) {
                    si += 1
                }
            }
            if (scnwidt) {
                if (scwidt) {
                    if (si <= 0) {
                        wj = xw; scnwidt = false;
                    }
                } else {
                    if (si > 0) {
                        wi = xw; scwidt = true;
                    }
                }
            }
        }
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
    //%block="set $PngSheet=screen_image_picker with $GroupChar and staying char $StayChar width $twidt height $theig bcol $bcl scol $scl"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%group="create"
    export function setCharFromSheet(PngSheet: Image, GroupChar: string, StayChar: string, twidt: number, theig: number, bcl: number, scl: number) {
        runInParallel( function () {
            let gwidt: number = Math.round(PngSheet.width / twidt); let uig: Image = null; let txi: number = 0; let tyi: number = 0;
            for (let tvn = 0; tvn < GroupChar.length; tvn++) {
                uig = image.create(twidt, theig); txi = twidt * (tvn % gwidt); tyi = theig * Math.floor(tvn / gwidt); drawTransparentImage(PngSheet, uig, 0 - txi, 0 - tyi); setCharecter(GroupChar.charAt(tvn), uig, StayChar.includes(GroupChar.charAt(tvn)), bcl, scl);
            }
        })
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
        let heig: number = 0; let widt: number = 0; let curwidt: number = 0; let uwidt: number = 0; let swidt: number = 0; let nwidt: number = 0; let wie: number = 0; let hie: number = 0; let hvi: number = 0;
        for (let currentletter = 0; currentletter < input.length; currentletter++) {
            if (ligs.indexOf(input.charAt(currentletter)) >= 0) {
                uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter)))]; nwidt = ligages[(ligs.indexOf(input.charAt(currentletter)))].width;
                if (uwidt > 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (uwidt > 0) {
                    widt += Math.abs(uwidt - swidt)
                }
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter + 1)))] > 0) {
                    widt += letterspace
                }
                heig += Math.max(heig, hie + ligages[(ligs.indexOf(input.charAt(currentletter)))].height)
                if (iwidt > 0) {
                    if (widt >= iwidt) {
                        heig += ligages[(ligs.indexOf(input.charAt(currentletter)))].height; hie += ligages[(ligs.indexOf(input.charAt(currentletter)))].height; widt = 0;
                    } else if (findCommand(input, "n", currentletter)) {
                        heig += ligages[(ligs.indexOf(input.charAt(currentletter)))].height; hie += ligages[(ligs.indexOf(input.charAt(currentletter)))].height; widt = 0; currentletter += 3;
                    }
                }
            }
        }
        wie = 0; widt = 0;
        for (let currentletter2 = 0; currentletter2 < input.length; currentletter2++) {
            if (ligs.indexOf(input.charAt(currentletter2)) >= 0) {
                uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter2)))]; nwidt = ligages[(ligs.indexOf(input.charAt(currentletter2)))].width;
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter2 + 1, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter2 + 1, input.length - 1))))] > 0) {
                    wie += Math.abs(uwidt - swidt)
                }
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter2 + 1, input.length - 1))))] > 0) {
                    wie += letterspace
                }
            } else if (input.charAt(currentletter2) == " ") {
                wie += 3 * letterspace
            }
            widt = Math.max(widt, wie)
            if (iwidt > 0) {
                if (wie >= iwidt ) {
                    wie = 0;
                } else if (findCommand(input, "n", currentletter2)) {
                    wie = 0; currentletter2 += 3;
                }
            }
        }
        wie = 0; hie = 0; let output = image.create(widt, heig);
        for (let currentletter3 = 0; currentletter3 < input.length; currentletter3++) {
            if (ligs.indexOf(input.charAt(currentletter3)) >= 0) {
                hvi = ligages[(ligs.indexOf(input.charAt(currentletter3)))].height; uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter3)))];
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter3)))] == 0) {
                    nwidt = ligages[(ligs.indexOf(input.charAt(currentletter3)))].width
                } else {
                    nwidt = 0
                }
                drawTransparentImage(ligages[(ligs.indexOf(input.charAt(currentletter3)))], output, curwidt - nwidt, 0 + ((hie + hvi) - ligages[(ligs.indexOf(input.charAt(currentletter3)))].height))
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] == 0) {
                    swidt = nwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] > 0) {
                    curwidt += letterspace
                }
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter3)))] > 0) {
                    curwidt += Math.abs(uwidt - nwidt)
                }
            } else if (input.charAt(currentletter3) == " ") {
                curwidt += 3 * letterspace
            }
            if (ligwidth[(ligs.indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] > 0) {
                if (iwidt > 0) {
                    if (curwidt >= iwidt ) {
                        curwidt = 0; hie += hvi;
                    } else if (findCommand(input, "n", currentletter3)) {
                        curwidt = 0; hie += hvi; currentletter3 += 3;
                    }
                }
            }
        }
        if (icol > 0) {
            for (let ico = 0; ico < 16; ico++) { if (ico > 0) { output.replace(ico, icol) } }
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
