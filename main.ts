//% color="#2dbded" icon="\uf249"
namespace idxfont {

    let ligs: string[] = []
    let ligages: Image[] = []
    let ligwidth: number[] = []
    let letterspace: number = 1

    export function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) {
            return;
        }
        to.drawTransparentImage(src, x, y);
    }

    //%blockid=ixfont_setcharecter
    //%block="set $glyph to $imgi=screen_image_picker staying $notmove erase $bcol spacebar $scol"
    //%bcol.shadow=colorindexpicker
    //%scol.shadow=colorindexpicker
    //%group="create"
    export function setCharecter(glyph: string, imgi: Image, notmove: boolean, bcol: number, scol: number) {
        let scnwidt = true
        let scwidt = false
        let wi = 0
        let wj = 0
        let si = 0
        let imgj = image.create(1, 1)
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
                        wj = xw
                        scnwidt = false
                    }

                } else {
                    if (si > 0) {
                        wi = xw
                        scwidt = true
                    }

                }
            }
        }
        imgj = image.create(Math.abs(wj - wi), imgi.height)
        drawTransparentImage(imgi, imgj, 0 - wi, 0)
        if (scol > 0 && scol < 16) {
            imgj.replace(scol, 0)
        }
        if (ligs.indexOf(glyph) == -1) {
            ligs.push(glyph)
            ligages.push(imgj)
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
    //%block="set $PngSheet=srceen_image_picker with $GroupChar and staying char $StayChar and w $twidt h $theig and bcol $bcl scol $scl"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%group="create"
    export function setCharFromSheet(PngSheet: Image, GroupChar: string, StayChar: string, twidt: number, theig: number, bcl: number, scl: number) {
        let gwidt = Math.floor(PngSheet.width / twidt)
        let gheig = Math.floor(PngSheet.height / theig)
        let uig = image.create(twidt, theig)
        let xi = 0
        let yi = 0
        let txi = 0
        let tyi = 0
        for (let tvn = 0; tvn < GroupChar.length; tvn++) {
            uig = image.create(twidt, theig)
            xi = tvn % gwidt
            yi = Math.floor(tvn / gwidt)
            txi = xi * twidt
            tyi = yi * theig
            drawTransparentImage(PngSheet, uig, 0 - txi, 0 - tyi)
            setCharecter(GroupChar.charAt(tvn), uig, StayChar.includes(GroupChar.charAt(tvn)), bcl, scl)

        }
    }

    //%group="ArrayData"
    //%blockid=ixfont_numofglyphs
    //%block="number of glyphs"
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
        let heig = 0
        let widt = 0
        let curwidt = 0
        let uwidt = 0
        let swidt = 0
        let nwidt = 0
        let lwidt: number[] = []
        let wie = 0
        let hie = 0
        let hvi = 0
        for (let currentletter = 0; currentletter < input.length; currentletter++) {
            if (!(ligs.indexOf(input.charAt(currentletter)) == -1)) {
                uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter)))]
                nwidt = ligages[(ligs.indexOf(input.charAt(currentletter)))].width
                if (uwidt > 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (uwidt > 0) {
                    widt += Math.abs(uwidt - swidt)
                }
                heig = Math.max(heig, ligages[(ligs.indexOf(input.charAt(currentletter)))].height)
                if (iwidt > 0) {
                    if (widt >= iwidt) {
                        heig += ligages[(ligs.indexOf(input.charAt(currentletter)))].height
                    }
                }
            }
        }
        wie = 0
        widt = 0
        for (let currentletter2 = 0; currentletter2 < input.length; currentletter2++) {
            if (!(ligs.indexOf(input.charAt(currentletter2)) == -1)) {
                uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter2)))]
                nwidt = ligages[(ligs.indexOf(input.charAt(currentletter2)))].width
                lwidt.push(uwidt)
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter2) + 1))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (uwidt > 0) {
                    wie += Math.abs(uwidt - swidt)
                }
            } else if (input.charAt(currentletter2) == " ") {
                wie += 3 * letterspace
            }
            wie += 1
            widt = Math.max(widt, wie)
            if (iwidt > 0) {
                if (wie >= iwidt) {
                    wie = 0
                }
            }
        }
        hie = 0
        let output = image.create(widt, heig)
        for (let currentletter3 = 0; currentletter3 < input.length; currentletter3++) {
            if (!(ligs.indexOf(input.charAt(currentletter3)) == -1)) {
                hvi = ligages[(ligs.indexOf(input.charAt(currentletter3)))].height
                uwidt = ligwidth[(ligs.indexOf(input.charAt(currentletter3)))]
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter3)))] == 0) {
                    nwidt = ligages[(ligs.indexOf(input.charAt(currentletter3)))].width
                } else {
                    nwidt = 0
                }
                drawTransparentImage(ligages[(ligs.indexOf(input.charAt(currentletter3)))], output, curwidt - nwidt, hie + (heig - ligages[(ligs.indexOf(input.charAt(currentletter3)))].height))
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter3 + 1)))] == 0) {
                    swidt = nwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter3 + 1)))] > 0) {
                    curwidt += letterspace
                }
                if (ligwidth[(ligs.indexOf(input.charAt(currentletter3)))] > 0) {
                    curwidt += Math.abs(uwidt - nwidt)
                }
            } else if (input.charAt(currentletter3) == " ") {
                curwidt += 3 * letterspace
            }
            if (iwidt > 0) {
                if (widt >= iwidt) {
                    widt = 0
                    hie += hvi
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
