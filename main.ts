//% block=IdxFont
//% color="#2dbded" 
//% icon="\uf249"
namespace idxfont {

    let ligs: string[][] = []; let ligages: Image[][] = []; let ligwidth: number[][] = []; let ligdir: number[][] = []; let ligcol: number[][] = []; let ligul: number[][] = []; let storeid: number[] = []; let letterspace: number = 1; let curid = 0;
    
    export function newtableid() {
        storeid.push(curid); ligs.push([]); ligages.push([]); ligwidth.push([]); ligdir.push([]); ligcol.push([]); ligul.push([]); curid += 1; return storeid.length - 1;
    }

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
    //%block="set table id $gid and set letter $glyph to img $imgi=screen_image_picker and the letter can move? $notmove and stay on or under the letter? $onthechar erase col $bcol spacebar col $scol base col $mcol guard col $ncol"
    //%bcol.shadow=colorindexpicker
    //%scol.shadow=colorindexpicker
    //%mcol.shadow=colorindexpicker
    //%ncol.shadow=colorindexpicker
    //%group="create"
    export function setCharecter(gid: number,glyph: string, imgi: Image, notmove: boolean, onthechar: boolean, bcol: number, scol: number, mcol: number, ncol: number) {
        let tid = 0
        if (storeid.indexOf(gid) < 0) {
            tid = newtableid()
        } else {
            tid = gid
        }
        
        let sncol = true  ;let scnwidt = true; let scwidt = false; let wi = 0; let wj = 0; let si = 0; let imgj = image.create(imgi.width, imgi.height);
        if (bcol > 0 && bcol < 16) {
            imgi.replace(bcol, 0)
        }
        for (let xw = 0; xw < imgi.width; xw++) {
            si = 0
            for (let yh = 0; yh < imgi.height; yh++) {
                if (imgi.getPixel(xw, yh) != 0 || (scwidt && imgi.getPixel(xw + 1, yh) != 0)) { si += 1 }
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
        if (ligs[tid].indexOf(glyph) < 0) {
            ligul[tid].push(ncol)
            ligcol[tid].push(mcol)
            ligs[tid].push(glyph); ligages[tid].push(imgj);
            if (notmove) {
                if (onthechar) {
                    ligdir[tid].push(10)
                } else {
                    ligdir[tid].push(-10)
                }
                ligwidth[tid].push(0)
            } else {
                ligwidth[tid].push(imgj.width)
                ligdir[tid].push(0)
            }
        } else {
            ligul[tid][ligs[tid].indexOf(glyph)] = ncol
            ligcol[tid][ligs[tid].indexOf(glyph)] = mcol
            ligages[tid][ligs[tid].indexOf(glyph)] = imgj
            if (notmove) {
                if (onthechar) {
                    ligdir[tid][ligs[tid].indexOf(glyph)] = 10
                } else {
                    ligdir[tid][ligs[tid].indexOf(glyph)] = -10
                }
                ligwidth[tid][ligs[tid].indexOf(glyph)] = 0
            } else {
                ligwidth[tid][ligs[tid].indexOf(glyph)] = imgj.width
                ligdir[tid][ligs[tid].indexOf(glyph)] = 0
            }
        }
    }

    //%blockid=ixfont_setcharfromimgsheet
    //%block="set table id $tid and set img sheet $PngSheet=screen_image_picker with letters $GroupChar staying letters $StayChar letters on the letters $CharOnChar width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    export function setCharFromSheet(tid: number, PngSheet: Image, GroupChar: string, StayChar: string, CharOnChar: string, twid: number, thei: number, bcl: number, scl: number, mcl: number, ncl: number) {
        let gwid = Math.round(PngSheet.width / twid); let uig = image.create(twid, thei); let txi = 0; let tyi = 0;
        for (let tvn = 0; tvn < GroupChar.length; tvn++) {
            uig = image.create(twid, thei); txi = twid * (tvn % gwid); tyi = thei * Math.floor(tvn / gwid); drawTransparentImage(PngSheet, uig, 0 - txi, 0 - tyi); setCharecter(tid, GroupChar.charAt(tvn), uig, StayChar.includes(GroupChar.charAt(tvn)),CharOnChar.includes(GroupChar.charAt(tvn)), bcl, scl, mcl, ncl);
        }
    }

    //%blockid=ixfont_numofglyphs
    //%block="number of glyphs in table id $tid"
    //%group="datainfo"
    export function NumOfGlyphs(tid: number): number {
        return ligs[tid].length
    }

    //%blockid=ixfont_arrofgypimg
    //%block="array of glyph images in table id $tid"
    //%group="datainfo"
    export function ImageArray(tid: number): Image[] {
        return ligages[tid]
    }

    //%blockid=ixfont_arrofglyphs
    //%block="array of glyphs in table id $tid"
    //%group="datainfo"
    export function GlyphArray(tid: number): String[] {
        return ligs[tid]
    }

    //%blockid=ixfont_setimgfromtext
    //%block="create the image of text $input in page width $iwidt from table id $tid and fill col $icol"
    //%icol.shadow=colorindexpicker
    //%group="render"
    export function SetImage(input: string, iwidt: number,tid: number, icol: number) {
        let heig = 0; let widt = 0; let curwidt = 0; let uwidt = 0; let swidt = 0; let nwidt = 0; let wie = 0; let hie = 0; let hvi = 0;
        for (let currentletter = 0; currentletter < input.length; currentletter++) {
            if (!(ligs[tid].indexOf(input.charAt(currentletter)) < 0)) {
                uwidt = ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter)))]
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter)))] <= 0) {
                    nwidt = ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter)))].width
                } else {
                    nwidt = 0
                }
                if (uwidt > 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter)))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter + 1, input.length - 1))))] > 0) {
                    wie += letterspace
                }
                hvi = ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter)))].height
            } else if (input.charAt(currentletter) == " ") {
                wie += 3 * letterspace
            } else {
                wie += 2 * letterspace
            }
            heig = Math.max(heig, hie + hvi)
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter)) {
                    hie += hvi; wie = 0;
                    if (findCommand(input, "n", currentletter)) {
                        currentletter += 3
                    }
                }
            } else if (findCommand(input, "n", currentletter)) {
                    currentletter += 3
            }
        }
        wie = 0; widt = 0;
        for (let currentletter2 = 0; currentletter2 < input.length; currentletter2++) {
            if (!(ligs[tid].indexOf(input.charAt(currentletter2)) < 0)) {
                uwidt = ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter2)))]
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter2)))] <= 0) {
                    nwidt = ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter2)))].width
                } else {
                    nwidt = 0
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter2 + 1, input.length - 1))))] <= 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter2)))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter2 + 1, input.length - 1))))] > 0) {
                    wie += letterspace
                }
            } else if (input.charAt(currentletter2) == " ") {
                wie += 3 * letterspace
            } else {
                wie += 2 * letterspace
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
        let scwidt = true;  let underc = false; let sc = 0; let scnwidt = false; let rimg = image.create(8, 8); let output = image.create(widt, heig); hie = 0; wie = 0; curwidt = 0;
        for (let currentletter3 = 0; currentletter3 < input.length; currentletter3++) {
            wie = 0
            if (!(ligs[tid].indexOf(input.charAt(currentletter3)) < 0)) {
                hvi = ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))].height; uwidt = ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))];
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))] <= 0) {
                    nwidt = ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))].width
                } else {
                    nwidt = 0
                }
                scwidt = false; scnwidt = false; wie = 0; rimg = ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))].clone(); let ccol = ligul[tid][ligs[tid].indexOf(input.charAt(currentletter3))];
                if (ligwidth[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1)))] > 0 && ligdir[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1)))] == 0) {
                    rimg.replace(ccol, ligcol[tid][ligs[tid].indexOf(input.charAt(currentletter3))])
                } else if (ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter3))] > 0 && ligdir[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1)))] < 0) {
                    rimg.replace(ccol, 0)
                } else if (ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter3))] > 0 && ligdir[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1)))] > 0) {
                    rimg.replace(ccol, ligcol[tid][ligs[tid].indexOf(input.charAt(currentletter3))])
                }
                if (Math.abs(ligdir[tid][ligs[tid].indexOf(input.charAt(currentletter3))]) > 0 && Math.abs(ligdir[tid][ligs[tid].indexOf(input.charAt(Math.max(currentletter3 - 1, 0)))]) == 0) {
                    sc = 1; wie = 0;
                    while (sc > 0) {
                        sc = 0
                        for (let yh = 0; yh < rimg.height; yh++) {
                            if (output.getPixel((curwidt - letterspace) - wie, hie + yh) == rimg.getPixel(rimg.width - 1, yh) && (output.getPixel((curwidt - letterspace) - wie, hie + yh) != 0 && output.getPixel((curwidt - letterspace) - wie, hie + yh) != 0)) {
                                sc += 1
                            }
                        }
                        if (sc > 0 || (sc == 0 && wie > 0)) {
                            wie += 1
                        }
                    }
                }
                if (wie != 0) { wie = Math.abs(wie) }
                drawTransparentImage( rimg, output, curwidt - (nwidt + wie), hie + (hvi - ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))].height))
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))] > 0) {
                    curwidt += Math.abs(uwidt - nwidt)
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] > 0) {
                    curwidt += letterspace
                }
            } else if (input.charAt(currentletter3) == " ") {
                curwidt += 3 * letterspace
            } else {
                curwidt += 2 * letterspace
            }
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
        if (icol > 0) {
            for (let ico = 1; ico < 16; ico++) {
                output.replace(ico, icol)
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