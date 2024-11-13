//% block="Idx Font"
//% color="#2dbded" 
//% icon="\uf249"
namespace idxfont {

    let ligs: string[][] = []; let ligages: Image[][] = []; let ligwidth: number[][] = []; let ligsubw: number[][] = []; let ligdir: number[][] = []; let ligcol: number[][] = []; let ligul: number[][] = []; let storeid: number[] = []; let letterspace: number = 1; let curid = 0;

    export function newtableid() {
        storeid.push(curid); ligs.push([]); ligages.push([]); ligwidth.push([]); ligsubw.push([]); ligdir.push([]); ligcol.push([]); ligul.push([]); curid += 1; return storeid.length - 1;
    }

    export function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y)
    }

    export function findCommand(tvj: string, chj: string = "", nvj: number): boolean {
        if (((nvj < tvj.length && tvj.charAt(nvj)) && (nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && chj.length <= 0))) { return true }
        if (chj.length != 1) { return false }
        if (((nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && tvj.charAt(nvj + 2) == chj))) { return true }
        return false
    }

    export function runInParallel(handler: () => void) {
        control.runInParallel(handler);
    }

    export function SetImgFrame(ImgF: Image, Wh: number, Ht: number) {
        let ImgOutput = image.create(Wh, Ht)
        let Twidt = Math.floor(ImgF.width / 3)
        let Theig = Math.floor(ImgF.height / 3)
        let ImgTable: Image[] = []
        let Uimg: Image = null
        let sw = 0
        let sh = 0
        for (let hj = 0; hj < 3; hj++) {
            for (let wi = 0; wi < 3; wi++) {
                Uimg = image.create(Twidt, Theig)
                drawTransparentImage(ImgF, Uimg, 0 - wi * Twidt, 0 - hj * Theig)
                ImgTable.push(Uimg.clone())
            }
        }
        for (let wi = 0; wi < Math.floor(Wh / Twidt); wi++) {
            for (let hj = 0; hj < Math.floor(Ht / Theig); hj++) {
                sw = Math.min(wi * Twidt, Wh - Twidt)
                sh = Math.min(hj * Theig, Ht - Theig)
                if (hj == 0 && wi == 0) {
                    drawTransparentImage(ImgTable[0], ImgOutput, sw, sh)
                } else if (hj == Math.floor(Ht / Theig) - 1 && wi == Math.floor(Wh / Twidt) - 1) {
                    drawTransparentImage(ImgTable[8], ImgOutput, sw, sh)
                } else if (hj == Math.floor(Ht / Theig) - 1 && wi == 0) {
                    drawTransparentImage(ImgTable[6], ImgOutput, sw, sh)
                } else if (hj == 0 && wi == Math.floor(Wh / Twidt) - 1) {
                    drawTransparentImage(ImgTable[2], ImgOutput, sw, sh)
                } else {
                    if (wi > 0 && wi < Math.floor(Wh / Twidt) - 1) {
                        if (hj == 0) {
                            drawTransparentImage(ImgTable[1], ImgOutput, sw, sh)
                        } else if (hj == Math.floor(Ht / Theig) - 1) {
                            drawTransparentImage(ImgTable[7], ImgOutput, sw, sh)
                        } else {
                            drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                        }
                    } else if (hj > 0 && hj < Math.floor(Ht / Theig) - 1) {
                        if (wi == 0) {
                            drawTransparentImage(ImgTable[3], ImgOutput, sw, sh)
                        } else if (wi == Math.floor(Wh / Twidt) - 1) {
                            drawTransparentImage(ImgTable[5], ImgOutput, sw, sh)
                        } else {
                            drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                        }
                    } else {
                        drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                    }
                }
            }
        }
        return ImgOutput
    }

    //%blockid=ixfont_setcharecter
    //%block="set |table id $gid and set letter $glyph to img $imgi=screen_image_picker ||and |the letter can move? $notmove and stay on or under the letter? $onthechar and substract width $inchar erase col $bcol spacebar col $scol base col $mcol guard col $ncol"
    //%bcol.shadow=colorindexpicker
    //%scol.shadow=colorindexpicker
    //%mcol.shadow=colorindexpicker
    //%ncol.shadow=colorindexpicker
    //%group="create"
    export function setCharecter(gid: number = 0, glyph: string = "", imgi: Image = image.create(5, 8), notmove: boolean = false, onthechar: boolean = false, inchar: boolean = false, bcol: number = 0, scol: number = 0, mcol: number = 0, ncol: number = 0) {
        let tid = 0
        if (storeid.indexOf(gid) < 0) {
            tid = newtableid()
        } else {
            tid = gid
        }

        let sncol = true; let scnwidt = true; let scwidt = false; let wi = 0; let wj = 0; let si = 0; let imgj = image.create(imgi.width, imgi.height);
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
        let uwid = 0
        if (inchar) {
            for (let xw = imgi.width; xw >= 0; xw--) {
                si = 0
                for (let yh = 0; yh < imgi.height; yh++) {
                    if (imgi.getPixel(xw, yh) != 0) { si += 1 }
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
            uwid = Math.abs(wj - wi)
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
                ligsubw[tid].push(0)
            } else {
                if (uwid == 0) {
                    ligsubw[tid].push(imgj.width)
                } else {
                    ligsubw[tid].push(uwid)
                }
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
                ligsubw[tid][ligs[tid].indexOf(glyph)] = 0
            } else {
                if (uwid == 0) {
                    ligsubw[tid][ligs[tid].indexOf(glyph)] = imgj.width
                } else {
                    ligsubw[tid][ligs[tid].indexOf(glyph)] = uwid
                }
                ligwidth[tid][ligs[tid].indexOf(glyph)] = imgj.width
                ligdir[tid][ligs[tid].indexOf(glyph)] = 0
            }
        }
    }

    //%blockid=ixfont_setcharfromimgsheet
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with letters $GroupChar ||and |staying letters $StayChar letters on the letters $CharOnChar and Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    export function setCharFromSheet(tid: number = 0, PngSheet: Image = image.create(10, 16), GroupChar: string = "", StayChar: string = "", CharOnChar: string = "", CharSubW: string = "", twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
        let gwid = Math.round(PngSheet.width / twid); let uig = image.create(twid, thei); let txi = 0; let tyi = 0;
        for (let tvn = 0; tvn < GroupChar.length; tvn++) {
            uig = image.create(twid, thei); txi = twid * (tvn % gwid); tyi = thei * Math.floor(tvn / gwid); drawTransparentImage(PngSheet, uig, 0 - txi, 0 - tyi); setCharecter(tid, GroupChar.charAt(tvn), uig, StayChar.includes(GroupChar.charAt(tvn)), CharOnChar.includes(GroupChar.charAt(tvn)), CharSubW.includes(GroupChar.charAt(tvn)), bcl, scl, mcl, ncl);
        }
    }

    //%blockid=ixfont_numofglyphs
    //%block="number of glyphs ||in table id $tid"
    //%group="datainfo"
    export function NumOfGlyphs(tid: number = 0): number {
        return ligs[tid].length
    }

    //%blockid=ixfont_arrofgypimg
    //%block="array of glyph images ||in table id $tid"
    //%group="datainfo"
    export function ImageArray(tid: number = 0): Image[] {
        return ligages[tid]
    }

    //%blockid=ixfont_arrofglyphs
    //%block="array of glyphs ||in table id $tid"
    //%group="datainfo"
    export function GlyphArray(tid: number = 0): String[] {
        return ligs[tid]
    }

    //%blockid=ixfont_setimgfromtext
    //%block="create the image of |text $input in page width $iwidt from table id $tid ||and |fill col $icol and got alignment $alm and get debugalm $debugalm"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%group="render"
    export function SetTextImage(input: string, iwidt: number, tid: number, icol: number = 0, alm: number = 0, debugalm: boolean = false) {
        let uhei = 0; let outputarr: Image[] = []; let lnwit: number[] = []; let heig = 0; let widt = 0; let curwidt = 0; let uwidt = 0; let swidt = 0; let nwidt = 0; let wie = 0; let hie = 0; let hvi = 0;
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
                if (Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter))]) > 0) {
                    wie += ligsubw[tid][(ligs[tid].indexOf(input.charAt(currentletter)))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter)))] > 0) {
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
            uhei = Math.max(uhei, hvi)
            heig = Math.max(heig, hie + hvi)
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter)) {
                    wie -= letterspace
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    wie = 0;
                    if (findCommand(input, "n", currentletter)) {
                        currentletter += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter)) {
                currentletter += 2
            }
        }
        wie = 0; widt = 0; let hix = 0;
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
                if (Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter2))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter2))]) > 0) {
                    wie += ligsubw[tid][(ligs[tid].indexOf(input.charAt(currentletter2)))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter2)))] > 0) {
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
            if (false) { widt = Math.max(widt, wie) }
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter2)) {
                    wie -= letterspace
                    if (debugalm && findCommand(input, "n", currentletter2)) {
                        wie -= (3 * letterspace) + letterspace; widt = Math.max(widt, wie)
                    } else {
                        widt = Math.max(widt, wie)
                    }
                    lnwit.push(wie); wie = 0; hix += 1
                    if (findCommand(input, "n", currentletter2)) {
                        currentletter2 += 2
                    }
                } else {
                    widt = Math.max(widt, wie)
                }
            } else if (findCommand(input, "n", currentletter2)) {
                widt = Math.max(widt, wie); currentletter2 += 2;
            } else {
                widt = Math.max(widt, wie)
            }
        }
        if (hix > 0 && debugalm) { wie += letterspace + (3 * letterspace) }; wie -= letterspace; lnwit.push(wie);
        let hgi = 0; let limg = image.create(lnwit[hgi], heig); let scwidt = true; let underc = false; let sc = 0; let scnwidt = false; let rimg = image.create(8, 8); let output = image.create(widt, heig); hie = 0; wie = 0; curwidt = 0;
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
                            if (limg.getPixel((curwidt - letterspace) - wie, yh) == rimg.getPixel(rimg.width - 1, yh) && (limg.getPixel((curwidt - letterspace) - wie, yh) != 0 && limg.getPixel((curwidt - letterspace) - wie, yh) != 0)) {
                                sc += 1
                            }
                        }
                        if (sc > 0 || (sc == 0 && wie > 0)) {
                            wie += 1
                        }
                    }
                }
                if (wie != 0) { wie = Math.abs(wie) }
                if (ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter3))] > 0 && Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter3))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter3))]) > 0) {
                    drawTransparentImage(rimg, limg, (curwidt - nwidt) - Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1)))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter3))]), 0 + (hvi - ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))].height))
                } else {
                    drawTransparentImage(rimg, limg, curwidt - (nwidt + wie), 0 + (hvi - ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))].height))
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter3))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter3))]) > 0) {
                    curwidt += ligsubw[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))] > 0) {
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
            uhei = Math.max(uhei, hvi)
            if (alm < 0) {
                drawTransparentImage(limg.clone(), output, 0, hie)
            } else if (alm > 0) {
                drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
            } else if (alm == 0) {
                drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
            }
            if (icol > 0) {
                for (let ico = 1; ico < 16; ico++) {
                    output.replace(ico, icol)
                }
            }
            outputarr.push(output.clone())
            if (iwidt > 0) {
                if (curwidt >= iwidt || findCommand(input, "n", currentletter3)) {
                    if (alm < 0) {
                        drawTransparentImage(limg.clone(), output, 0, hie)
                    } else if (alm > 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
                    } else if (alm == 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
                    }
                    hgi += 1; limg = image.create(lnwit[hgi], heig); curwidt = 0;
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    if (findCommand(input, "n", currentletter3)) {
                        currentletter3 += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter3)) {
                currentletter3 += 2
            }
        }
        if (alm < 0) {
            drawTransparentImage(limg.clone(), output, 0, hie)
        } else if (alm > 0) {
            drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
        } else if (alm == 0) {
            drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
        }
        if (icol > 0) {
            for (let ico = 1; ico < 16; ico++) {
                output.replace(ico, icol)
            }
        }
        outputarr.push(output.clone())
        return output
    }

    //%blockid=ixfont_setimgframefromtext
    //%block="create the image frame of |text $input in page width $iwidt from table id $tid ||and |fill col $icol and got alignment $alm and get debugalm $debugalm"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%group="render"
    export function SetTextImageArray(input: string, iwidt: number, tid: number, icol: number = 0, alm: number = 0, debugalm: boolean = false) {
        let uhei = 0; let outputarr: Image[] = []; let lnwit: number[] = []; let heig = 0; let widt = 0; let curwidt = 0; let uwidt = 0; let swidt = 0; let nwidt = 0; let wie = 0; let hie = 0; let hvi = 0;
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
                if (Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter))]) > 0) {
                    wie += ligsubw[tid][(ligs[tid].indexOf(input.charAt(currentletter)))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter)))] > 0) {
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
            uhei = Math.max(uhei, hvi)
            heig = Math.max(heig, hie + hvi)
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter)) {
                    wie -= letterspace 
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    wie = 0;
                    if (findCommand(input, "n", currentletter)) {
                        currentletter += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter)) {
                currentletter += 2
            }
        }
        wie = 0; widt = 0; let hix = 0;
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
                if (Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter2))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter2))]) > 0) {
                    wie += ligsubw[tid][(ligs[tid].indexOf(input.charAt(currentletter2)))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter2)))] > 0) {
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
            if (false) { widt = Math.max(widt, wie) }
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter2)) {
                    wie -= letterspace
                    if (debugalm && findCommand(input, "n", currentletter2)) {
                        wie -= (3 * letterspace) + letterspace; widt = Math.max(widt, wie)
                    } else {
                        widt = Math.max(widt, wie)
                    }
                    lnwit.push(wie); wie = 0; hix += 1
                    if (findCommand(input, "n", currentletter2)) {
                        currentletter2 += 2
                    }
                } else {
                    widt = Math.max(widt, wie)
                }
            } else if (findCommand(input, "n", currentletter2)) {
                widt = Math.max(widt, wie); currentletter2 += 2;
            } else {
                widt = Math.max(widt, wie)
            }
        }
        if (hix > 0 && debugalm) { wie += letterspace + (3 * letterspace) }; wie -= letterspace; lnwit.push(wie);
        let hgi = 0; let limg = image.create(lnwit[hgi], heig); let scwidt = true; let underc = false; let sc = 0; let scnwidt = false; let rimg = image.create(8, 8); let output = image.create(widt, heig); hie = 0; wie = 0; curwidt = 0;
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
                            if (limg.getPixel((curwidt - letterspace) - wie, yh) == rimg.getPixel(rimg.width - 1, yh) && (limg.getPixel((curwidt - letterspace) - wie, yh) != 0 && limg.getPixel((curwidt - letterspace) - wie, yh) != 0)) {
                                sc += 1
                            }
                        }
                        if (sc > 0 || (sc == 0 && wie > 0)) {
                            wie += 1
                        }
                    }
                }
                if (wie != 0) { wie = Math.abs(wie) }
                if (ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter3))] > 0 && Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter3))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter3))]) > 0) {
                    drawTransparentImage(rimg, limg, (curwidt - nwidt) - Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1)))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter3))]), 0 + (hvi - ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))].height))
                } else {
                    drawTransparentImage(rimg, limg, curwidt - (nwidt + wie), 0 + (hvi - ligages[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))].height))
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + 1, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                if (Math.abs(ligsubw[tid][ligs[tid].indexOf(input.charAt(currentletter3))] - ligwidth[tid][ligs[tid].indexOf(input.charAt(currentletter3))]) > 0) {
                    curwidt += ligsubw[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(currentletter3)))] > 0) {
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
            uhei = Math.max(uhei, hvi)
            if (alm < 0) {
                drawTransparentImage(limg.clone(), output, 0, hie)
            } else if (alm > 0) {
                drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
            } else if (alm == 0) {
                drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
            }
            if (icol > 0) {
                for (let ico = 1; ico < 16; ico++) {
                    output.replace(ico, icol)
                }
            }
            outputarr.push(output.clone())
            if (iwidt > 0) {
                if (curwidt >= iwidt || findCommand(input, "n", currentletter3)) {
                    if (alm < 0) {
                        drawTransparentImage(limg.clone(), output, 0, hie)
                    } else if (alm > 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
                    } else if (alm == 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
                    }
                    hgi += 1; limg = image.create(lnwit[hgi], heig); curwidt = 0;
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    if (findCommand(input, "n", currentletter3)) {
                        currentletter3 += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter3)) {
                currentletter3 += 2
            }
        }
        if (alm < 0) {
            drawTransparentImage(limg.clone(), output, 0, hie)
        } else if (alm > 0) {
            drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
        } else if (alm == 0) {
            drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
        }
        if (icol > 0) {
            for (let ico = 1; ico < 16; ico++) {
                output.replace(ico, icol)
            }
        }
        outputarr.push(output.clone())
        return outputarr
    }

    //%blockid=ixfont_stamptexttoframe
    //%block="StampStrImgToTheFrame $Fimg=screen_image_picker Text $Txt Text width $Wval TableId $arrid || Solid col $ucol Alignment $ualm"
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%group="Frame render"
    export function StampStrToFrame(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: number = 0, ucol: number = 0, ualm: number = 0) {
        let StrImg: Image = SetTextImage(Txt, Wval, arrid, ucol, ualm)
        let gapw = Math.floor(Fimg.width / 3)
        let gaph = Math.floor(Fimg.height / 3)
        let UfImg: Image = SetImgFrame(Fimg, StrImg.width + (gapw * 3), StrImg.height + (gaph * 3))
        drawTransparentImage(StrImg.clone(), UfImg, gapw, gaph)
        return UfImg
    }

    //%blockid=ixfont_stamptextarrtoframe
    //%block="StampStrAnimToTheFrame $Fimg=screen_image_picker Text input $Txt In text width $Wval At table id $arrid ||With text color $ucol And alignment $ualm "
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%group="Frame render"
    export function StampStrArrToFrame(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: number = 0, ucol: number = 0, ualm: number = 0) {
        let StrImg: Image[] = SetTextImageArray(Txt, Wval, arrid, ucol, ualm)
        let gapw = Math.floor(Fimg.width / 3)
        let gaph = Math.floor(Fimg.height / 3)
        let UfImg: Image = SetImgFrame(Fimg, StrImg[0].width + (gapw * 3), StrImg[0].height + (gaph * 3))
        let imgArr: Image[] = []
        let uimg: Image = null
        for (let mgi = 0; mgi < StrImg.length; mgi++) {
            uimg = UfImg.clone()
            drawTransparentImage(StrImg[mgi].clone(), uimg, gapw, gaph)
            imgArr.push(uimg)
        }
        return imgArr
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

    export enum tempfont { MainFont, ArcadeFont }

    //%blockid=ixfont_presetfont
    //%block="SetupPresetFont $tempf ||with table id $tid"
    //%group="create"
    export function SetupPresetFont(tempf: tempfont, tid: number = 0) {
        switch (tempf) {
            case tempfont.MainFont:
                setCharFromSheet(
                    tid,
                    img`
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
1111111111111111111111111111111111111111111111111111111111111111111111f1f11111111f111f1111111111111111111111111
111111111111111111f1f11111111111111f11111111111111111111111f111111111f111f11111111f1f11111111111111111111111111
11ffff11111f111111f1f11111f1f1111fffff11fff111f111f11111111f111111111f111f1111111fffff1111111111111111111111111
1f111111111f11111111111111f1f111f11f11f1f1f11f111f1f1111111111111111f11111f1111111f1f111111f1111111111111111111
1ffff111111f1111111111111fffff11f11f1111ff11f1111f1f1111111111111111f11111f111111f111f11111f1111111111111111111
1f111f11111f11111111111111f1f1111fffff11111f111111f11111111111111111f11111f11111111111111fffff11111111111fffff1
11ffff11111f1111111111111fffff11111f11f111f11ff11f1f1f11111111111111f11111f1111111111111111f1111111111111111111
11111f11111111111111111111f1f111f11f11f11f11f1f11f11f111111111111111f11111f1111111111111111f1111111f11111111111
1ffff111111f11111111111111f1f1111fffff11f111fff111ff1f111111111111111f111f1111111111111111111111111f11111111111
11111111111111111111111111111111111f111111111111111111111111111111111f111f111111111111111111111111f111111111111
1111111111111111111111111111111111111111111111111111111111111111111111f1f11111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
1111111111111f1111fff111111f111111fff11111fff1111111f1111fffff1111fff1111fffff1111fff11111fff111111111111111111
111111111111f1111f111f1111ff11111f111f111f111f11111ff1111f1111111f111f1111111f111f111f111f111f11111111111111111
111111111111f1111ff11f11111f111111111f1111111f1111f1f1111f1111111f1111111111f1111f111f111f111f11111f1111111f111
11111111111f11111f1f1f11111f11111111f111111ff1111f11f1111ffff1111ffff1111111f11111fff11111ffff11111f1111111f111
1111111111f111111f11ff11111f1111111f111111111f111fffff1111111f111f111f11111f11111f111f1111111f11111111111111111
111f111111f111111f111f11111f111111f111111f111f111111f1111f111f111f111f11111f11111f111f111f111f11111f1111111f111
111f11111f11111111fff11111fff1111fffff1111fff1111111f11111fff11111fff11111f1111111fff11111fff111111f1111111f111
1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
11111111111111111111111111fff11111ffff1111fff1111ffff11111fff1111ffff1111fffff111fffff1111fff1111f111f1111fff11
1111ff11111111111ff111111f111f111f1111f11f111f111f111f111f111f111f111f111f1111111f1111111f111f111f111f11111f111
11ff11111fffff11111ff11111111f11f11ff1f11f111f111f111f111f1111111f111f111f1111111f1111111f1111111f111f11111f111
1f1111111111111111111f111111f111f1f1f1f11fffff111ffff1111f1111111f111f111fff11111fff11111f11ff111fffff11111f111
11ff11111fffff11111ff111111f1111f11fff111f111f111f111f111f1111111f111f111f1111111f1111111f111f111f111f11111f111
1111ff11111111111ff11111111111111f1111111f111f111f111f111f111f111f111f111f1111111f1111111f111f111f111f11111f111
111111111111111111111111111f111111fffff11f111f111ffff11111fff1111ffff1111fffff111f11111111fff1111f111f1111fff11
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
11111f111f111f111f1111111f111f111f111f1111fff1111ffff11111fff1111ffff11111fff1111fffff111f111f111f111f111f111f1
11111f111f11f1111f1111111ff1ff111ff11f111f111f111f111f111f111f111f111f111f111f11111f11111f111f111f111f111f1f1f1
11111f111f1f11111f1111111f1f1f111f1f1f111f111f111f111f111f111f111f111f111f111111111f11111f111f111f111f111f1f1f1
11111f111ff111111f1111111f111f111f11ff111f111f111ffff1111f111f111ffff11111fff111111f11111f111f1111f1f1111f1f1f1
1f111f111f1f11111f1111111f111f111f111f111f111f111f1111111f1f1f111f111f1111111f11111f11111f111f1111f1f11111f1f11
1f111f111f11f1111f1111111f111f111f111f111f111f111f1111111f11f1111f111f111f111f11111f11111f111f1111f1f11111f1f11
11fff1111f111f111fffff111f111f111f111f1111fff1111f11111111ff1f111f111f1111fff111111f111111fff111111f111111f1f11
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
1111111111111111111111111111fff111111111fff11111111f11111111111111f11111111111111111111111111111111111111111111
1111111111111111111111111111f1111111111111f1111111f1f11111111111111f1111111111111111111111111111111111111111111
1f111f111f111f111fffff111111f1111f11111111f111111f111f111111111111111111111111111f1111111111111111111f111111111
11f1f1111f111f1111111f111111f11111f1111111f11111111111111111111111111111111111111f1111111111111111111f111111111
11f1f11111f1f1111111f1111111f11111f1111111f111111111111111111111111111111ffff1111f1ff11111fff11111ff1f1111fff11
111f111111f1f111111f11111111f111111f111111f1111111111111111111111111111111111f111ff11f111f111f111f11ff111f111f1
11f1f111111f111111f111111111f1111111f11111f1111111111111111111111111111111ffff111f111f111f1111111f111f111fffff1
11f1f111111f11111f1111111111f1111111f11111f111111111111111111111111111111f111f111f111f111f111f111f111f111f11111
1f111f11111f11111fffff111111f11111111f1111f1111111111111111111111111111111ffff111ffff11111fff11111ffff1111ffff1
1111111111111111111111111111f1111111111111f11111111111111111111111111111111111111111111111111111111111111111111
1111111111111111111111111111fff111111111fff11111111111111fffff1111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
1111ff11111111111f111111111f1111111f11111f11111111f111111111111111111111111111111111111111111111111111111111111
111f1111111111111f111111111f1111111f11111f11111111f111111111111111111111111111111111111111111111111111111111111
11fff11111ff1f111f1ff11111111111111111111f11f11111f111111ff1f1111ffff11111fff1111f1ff11111ffff111f1ff11111ffff1
111f11111f11ff111ff11f11111f1111111f11111f1f111111f111111f1f1f111f111f111f111f111ff11f111f111f111ff11f111f11111
111f11111f111f111f111f11111f1111111f11111ff1111111f111111f1f1f111f111f111f111f111f111f111f111f111f11111111fff11
111f111111ffff111f111f11111f1111111f11111f1f111111f111111f1f1f111f111f111f111f111ffff11111ffff111f11111111111f1
111f111111111f111f111f11111f1111111f11111f11f111111f11111f1f1f111f111f1111fff1111f11111111111f111f1111111ffff11
111111111ffff111111111111111111111f1111111111111111111111111111111111111111111111f11111111111f11111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111f11111111111f11111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111fff111111111111111111
1111111111111111111111111111111111111111111111111111111111111ff1111f11111ff111111111111111f1f111111111111111111
111111111111111111111111111111111111111111111111111111111111f111111f1111111f11111111111111fff111111111111111111
11f111111111111111111111111111111111111111111111111111111111f111111f1111111f111111111111111111111fffff111fffff1
11f111111111111111111111111111111111111111111111111111111111f111111f1111111f11111111111111111111f11111f1f11111f
1ffff1111f111f111f111f111f111f111f111f111f111f111fffff111111f111111f1111111f1111111ff1f111111111f1fff1f1f1fff1f
11f111111f111f111f111f111f1f1f1111f1f1111f111f111111f11111ff1111111f11111111ff1111f1ff1111111111f1f111f1f1ff11f
11f111111f111f1111f1f1111f1f1f11111f111111f1f111111f11111111f111111f1111111f11111111111111111111f1fff1f1f1f1f1f
11f111111f111f1111f1f11111f1f11111f1f11111f1f11111f111111111f111111f1111111f11111111111111111111f11111f1f11111f
111ff11111ffff11111f111111f1f1111f111f11111f11111fffff111111f111111f1111111f111111111111111111111fffff111fffff1
111111111111111111111111111111111111111111f11111111111111111f111111f1111111f11111111111111111111111111111111111
11111111111111111111111111111111111111111f1111111111111111111ff1111f11111ff111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
`,
                    "§!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°©®",
                    "",
                    "",
                    "",
                    8,
                    16,
                    1,
                    0,
                    15,
                    3
                )
                setCharFromSheet(
                    tid,
                    img`
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11fff1111ff11f111f1f1f1111fff11111f1f1111f1f11f11111ff1111fff1111fff11111ff11f111f1f1f111ff11f111ff11f1111fff11
                        1f111f111f1f1f111fff1f111f111f111f1f1f111fff11f111111f111f111f11f111f1111f1f1f111fff1f11f11f1f11f11f1f111f111f1
                        11f11f11111f1f11111f1f111f111f111f111f11111f11f11f111f1111111f111111f111111ff111111ff1111f1f1f111f1f1f1111f11f1
                        1f111f1111f11f1111f11f111fff1f111fff1f11111f11f111f11f1111ff1f11ff11f11111f11f1111f11f11f11f1f11f11f1f1111f11f1
                        1f111f111f111f111f111f111f111f111f111f11111f11f1111f1f11111f1f111f11f1111f111f111f111f11f11f1f11f11f1f1111f11f1
                        1f111f111f111f111f111f111f111f111f111f1111fff1f11111ff11111f1f111f1fff111f111f111f111f11f1ffff11ff1f1f111ff11f1
                        1f111f1111fff11111fff1111f111f111f111f1111ff1ff111111f111111ff111ff1ff1111fff11111fff111f1ff1f11ff1fff111ff11f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111113113111fffff1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111113331111fff1f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11fff11111fff111f1f1ff11f11f1f111ff11f1111fff11111f1f11111fff111ff1ff11111ffff11ff11f111ff111f11ff111f111ff11f1
                        1f111f111fff1111ffff11f1ffff1f11f11f1f111f111f111f1f1f111f111f111ff11f111f1111111f11f1111f111f111f111f111f111f1
                        11f11f111111f11111f111f1f11f1f111f1f1f111f111f111f111f1111f11f111f111f1111ffff111f11f1111f111f111f111f111f111f1
                        11f11f111ff1f11111f111f1f11f1f11f11f1f111fff1f111fff1f111f111f111f111f1111111f111f11f1111f111f111f111f111f111f1
                        11f11f1111f1f11111f111f1f11f1f11f11f1f111f1f1f111f1f1f111f111f111f111f1111f11f111f11f1111f111f111f111f111f1f1f1
                        1ff11f1111f1f11111f111f1f1ffff11ff1ffff11f1f1f111f1f1f111ff11f111f111f1111f11f111f1fff111f111f111f111f111ff1ff1
                        1ff11f1111ff111111f111f1f1ff1f11ff1f1ff11ff11f111ff11f111ff11f111f111f1111ffff111ff1ff111fffff111fffff111f111f1
                        11111f111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1ff1ff111331311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1f1f1f111313311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111111111111111f11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f
                        11111f111111111111111f1111111111111111111111111111111111111111111111111111111f111111111111111f111111111111111f1
                        1ff11f11ff111f11ff111f1111fff111ff11f111ff11f11111ff111111fff11111fff11111fff111ff111f1111fff111ff11ff11ff11ff1
                        1f111f111f111f111f111f111f111f111f11f111f111f1111f11f1111f111f111f111f111f1f1f111f111f111f1f1f111f11f1111f111f1
                        1f111f111f1f1f111f1f1f1111f11f111f11f111f111f11111f1111111111f1111111f111f111f111f1f1f1111111f111f1f1f111f1f1f1
                        1f111f111f1f1f111f1f1f1111f11f111f11f1111ff1f111111f111111ff1f1111111f111fff1f111f1ffff111ff1f111ff11f111f1f1f1
                        1f1f1f111ff1ff111ff1ff1111f11f111f11f111f111f111111f11111f11ff1111111f111f111f111f111f111f11ff111f111f111ff1ff1
                        1ff1ff111ff1ff111ff1ff111ff11f11fff1f111f111f111111f11111f111f111111ff111f111f111f111f111f111f111f111f111ff1ff1
                        1f111f111f111f111f111f111ff11f11ff1ff111fffff11111ff11111ff11f111111ff111f111f111fffff111ff11f111f111f111f111f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111fff11111ff11111f11f111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111111111f1111111f11f1111f1ff1111111111111111111111111111111111111111f1
                        11111111111111111111111111111111111111111111111111f111111f11f11111f1f1111111111111111111111111111f111f111ffff11
                        111111111111111111111111111111111111111111111111111f111111f1f1111111f1111111111111111111111111111ffff1111ff1ff1
                        1111111111111f1111111111111111111111111111111111111f11111111f1111111f111111111111111111111111111111111111111111
                        11fff1111ffff1111111111111fff1111111f1111f11f111111f11111111f1111111f11111fff11111fff11111fff111111111111111111
                        1f111f111fff1f111ff11f111f111f111111f1111f11f111111f11111111f1111111f1111f111f111f111f111f111f11111111111111111
                        11111f1111111f1111fff11111111f111111f1111f11f111111f11111111f1111111f11111f11f1111f11f1111111f11111111111111111
                        1ff11f111ff11f111111111111111f111111f1111f11f111111f11111111f1111111f1111f111f1111f11f1111111f11111111111111111
                        1f111f111f111f111ff11f1111111f111111f1111f11f111111f11111111f1111111f1111f111f1111f11f1111111f11111111111111111
                        1f111f111f111f1111fff11111111f111111ff111ff1ff11111ff1111111ff111111ff111ff11f111ff11f1111111f11111111111111111
                        1fffff111fffff111111111111111f111111ff111ff1ff11111ff1111111ff111111ff111ff11f111ff11f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111ff111111f111111ff11111fff1f11111f1111111111111111111
                        11111111111111111111111111111111111111111111111111111111111f1111111f1111111ff1111f1ff11111fff111111111111111111
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1111111111111111111
                        11ff11111111111111111f111111ff11111f1f1111111111111111111111111111111111111111111111111111111111ff1111111111111
                        11ff11111fffff111fffff111fffff111fffff1111111111111111111111111111111111111111111111111111111111ff1111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111fff11ffff11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1ffff11
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1ffff11
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111
                        111111111111111111111111111111111111111111ff111111f1f1111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111f1111111ff1111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111f111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111f111111111111111111f11111f1f1111f111111111111f111111f1111111f111111111111111111111111111111111
                        1ffff1111ffff1111f1f1f111ff1f1111fff11111fff111111f111111f1f11f111fff1111111f1111111111111111111111111111111111
                        f1111f11f1111f111f1fff11f11f1f11f1111111f1111111111ff111f1f1f1f11f1111111fff11111111111111111111111111111111111
                        f1111f11f1ff1f111f111f11f11f1f11f1111111f111111111111f11f1f1f1f1f1111111f11f11111111111111111111111111111111111
                        f1111f11f1ff1f111f111f11f11f1f11f1ff1111f1ff11111ff11f11f1f1f1f1f111f111f111f1111111111111111111111111111111111
                        f1111f11f11f1f111f111f11f11f1f11f1f11111f1f111111f111f11f1f1f1f1f1f1f111ff11f1111111111111111111111111111111111
                        1ffff1111ff11f111fffff11ff1f1f111ffff1111ffff11111fff111f1f1ff111f1ff111ff111f111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `,
                    "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮะาเแโใไฤฦๅั็ํิีึืุู์่้๊๋ำ฿๐๑๒๓๔๕๖๗๘๙",
                    "ั็ํิีึืุู์่้๊๋",
                    "ั็ํิีึื์่้๊๋",
                    "ำ",
                    8,
                    16,
                    1,
                    0,
                    15,
                    3
                )
                break;
            case tempfont.ArcadeFont:
                idxfont.setCharFromSheet(
                    tid,
                    img`
            111111111f1f11111f1f111111f11111ff11f111111111111f1111111f111111f1111111f111f1111111111111111111111111111111111
            1f1111111f1f11111f1f11111ffff111ff1f1111ff1111111f111111f11111111f1111111f1f11111111111111111111111111111111111
            1f11111111111111fffff111f1f11111111f1111f1f1111111111111f11111111f111111fffff11111f1111111111111111111111111111
            1f111111111111111f1f11111fff111111f111111f11111111111111f11111111f1111111f1f111111f1111111111111111111111111111
            1f11111111111111fffff11111f1f1111f111111f1f1f11111111111f11111111f111111f111f111fffff11111111111fffff1111111111
            11111111111111111f1f1111ffff11111f1ff111f11f111111111111f11111111f1111111111111111f11111ff11111111111111ff11111
            1f111111111111111f1f111111f11111f11ff1111ff1f111111111111f111111f11111111111111111f111111f11111111111111ff11111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1111111111111111111111
            1111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111f11111ff111111f1111111ff111111ff11111111f1111ffff11111ff11111ffff11111ff111111ff1111111111111111111111111111
            111f1111f11f1111ff111111f11f1111f11f111111ff1111f1111111f11f1111111f1111f11f1111f11f1111ff111111ff111111111ff11
            11f11111f1ff11111f111111111f111111f111111f1f1111fff11111fff11111111f11111ff11111f11f1111ff111111ff1111111ff1111
            1f111111ff1f11111f11111111f11111111f1111f11f1111111f1111f11f111111f11111f11f11111fff11111111111111111111f111111
            1f111111f11f11111f1111111f111111f11f1111fffff111f11f1111f11f11111f111111f11f1111f11f1111ff111111ff1111111ff1111
            f11111111ff11111fff11111ffff11111ff11111111f11111ff111111ff111111f1111111ff111111ff11111ff1111111f111111111ff11
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f11111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            11111111111111111fff11111fff11111ff11111fff111111ff11111fff11111ffff1111ffff11111ff11111f11f1111fff11111111f111
            11111111ff111111f111f111f111f111f11f1111f11f1111f11f1111f11f1111f1111111f1111111f11f1111f11f11111f111111111f111
            fffff11111ff1111111f1111f1f1f111f11f1111fff11111f1111111f11f1111fff11111fff11111f1111111ffff11111f111111111f111
            111111111111f11111f11111f1ff1111ffff1111f11f1111f1111111f11f1111f1111111f1111111f1ff1111f11f11111f111111111f111
            fffff11111ff111111111111f1111111f11f1111f11f1111f11f1111f11f1111f1111111f1111111f11f1111f11f11111f111111f11f111
            11111111ff11111111f111111ffff111f11f1111fff111111ff11111fff11111ffff1111f11111111ff11111f11f1111fff111111ff1111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            f11f1111f1111111f111f111f11f11111ff11111fff111111ff11111fff111111ff11111fffff111f11f1111f111f111f111f111f111f11
            f1f11111f1111111ff1ff111ff1f1111f11f1111f11f1111f11f1111f11f1111f11f111111f11111f11f1111f111f111f1f1f1111f1f111
            ff111111f1111111f1f1f111f1ff1111f11f1111f11f1111f11f1111f11f11111f11111111f11111f11f1111f111f111f1f1f11111f1111
            ff111111f1111111f1f1f111f11f1111f11f1111fff11111ff1f1111fff1111111f1111111f11111f11f11111f1f1111f1f1f11111f1111
            f1f11111f1111111f111f111f11f1111f11f1111f1111111f1f11111f11f1111f11f111111f11111f11f11111f1f11111f1f11111f1f111
            f11f1111ffff1111f111f111f11f11111ff11111f11111111f1f1111f11f11111ff1111111f111111ff1111111f111111f1f1111f111f11
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111ff111111f1111111ff111111111111111f111111f111111111111111111111111111111111111111111111111111111
            f111f111ffff1111f11111111f1111111f11111111111111f1f111111f11111111111111f111111111111111111f11111111111111f1111
            f111f111111f1111f11111111f1111111f11111111111111f1f111111111111111111111f111111111111111111f1111111111111f1f111
            1f1f111111f11111f111111111f111111f1111111111111111111111111111111fff1111fff111111fff11111fff11111ff111111f11111
            11f111111f111111f1111111111f11111f111111111111111111111111111111f11f1111f11f1111f1111111f11f1111f1ff1111fff1111
            11f11111f1111111f1111111111f11111f111111111111111111111111111111f11f1111f11f1111f1111111f11f1111ff1111111f11111
            11f11111ffff1111ff1111111111f111ff111111fffff11111111111111111111fff1111fff111111fff11111fff11111fff11111f11111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            11111111111111111f11111111f11111f1111111ff111111111111111111111111111111111111111111111111111111111111111f11111
            1fff1111111111111111111111111111f11111111f111111111111111111111111111111fff111111fff111111111111111111111f11111
            f11f1111fff11111ff1111111ff11111f1f111111f111111ff1f1111fff111111ff11111f11f1111f11f1111f1f111111fff1111fff1111
            f11f1111f11f11111f11111111f11111ff1111111f111111f1f1f111f11f1111f11f1111f11f1111f11f1111ff1f1111ff1111111f11111
            1fff1111f11f11111f111111f1f11111f1f111111f111111f1f1f111f11f1111f11f1111fff111111fff1111f111111111ff11111f1f111
            f11f1111f11f1111fff111111f111111f11f1111fff11111f1f1f111f11f11111ff11111f1111111111f1111f1111111fff1111111f1111
            1ff111111111111111111111111111111111111111111111111111111111111111111111f1111111111f111111111111111111111111111
            1111111111111111111111111111111111111111111111111ff11111f1111111ff111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111f111111f11111111f111111111111111111111111111111111111111111111
            11111111111111111111111111111111f11f1111111111111f111111f11111111f111111111111111111111111111111111111111111111
            f11f1111f111f111f111f111f11f1111f11f1111ffff1111ff111111f11111111ff111111ff1f1111111111111111111111111111111111
            f11f1111f111f111f1f1f1111ff11111f11f111111f111111f111111f11111111f111111f1ff11111111111111111111111111111111111
            f11f11111f1f1111f1f1f1111ff111111fff11111f1111111f111111f11111111f111111111111111111111111111111111111111111111
            1fff111111f111111f1f1111f11f1111f11f1111ffff11111ff11111f1111111ff111111111111111111111111111111111111111111111
            111111111111111111111111111111111ff1111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
        `,
                    "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
                    "",
                    "",
                    "",
                    8,
                    8,
                    1,
                    0,
                    0,
                    0
                )
                break;
            default:
                setCharFromSheet(
                    tid,
                    img`
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
1111111111111111111111111111111111111111111111111111111111111111111111f1f11111111f111f1111111111111111111111111
111111111111111111f1f11111111111111f11111111111111111111111f111111111f111f11111111f1f11111111111111111111111111
11ffff11111f111111f1f11111f1f1111fffff11fff111f111f11111111f111111111f111f1111111fffff1111111111111111111111111
1f111111111f11111111111111f1f111f11f11f1f1f11f111f1f1111111111111111f11111f1111111f1f111111f1111111111111111111
1ffff111111f1111111111111fffff11f11f1111ff11f1111f1f1111111111111111f11111f111111f111f11111f1111111111111111111
1f111f11111f11111111111111f1f1111fffff11111f111111f11111111111111111f11111f11111111111111fffff11111111111fffff1
11ffff11111f1111111111111fffff11111f11f111f11ff11f1f1f11111111111111f11111f1111111111111111f1111111111111111111
11111f11111111111111111111f1f111f11f11f11f11f1f11f11f111111111111111f11111f1111111111111111f1111111f11111111111
1ffff111111f11111111111111f1f1111fffff11f111fff111ff1f111111111111111f111f1111111111111111111111111f11111111111
11111111111111111111111111111111111f111111111111111111111111111111111f111f111111111111111111111111f111111111111
1111111111111111111111111111111111111111111111111111111111111111111111f1f11111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
1111111111111f1111fff111111f111111fff11111fff1111111f1111fffff1111fff1111fffff1111fff11111fff111111111111111111
111111111111f1111f111f1111ff11111f111f111f111f11111ff1111f1111111f111f1111111f111f111f111f111f11111111111111111
111111111111f1111ff11f11111f111111111f1111111f1111f1f1111f1111111f1111111111f1111f111f111f111f11111f1111111f111
11111111111f11111f1f1f11111f11111111f111111ff1111f11f1111ffff1111ffff1111111f11111fff11111ffff11111f1111111f111
1111111111f111111f11ff11111f1111111f111111111f111fffff1111111f111f111f11111f11111f111f1111111f11111111111111111
111f111111f111111f111f11111f111111f111111f111f111111f1111f111f111f111f11111f11111f111f111f111f11111f1111111f111
111f11111f11111111fff11111fff1111fffff1111fff1111111f11111fff11111fff11111f1111111fff11111fff111111f1111111f111
1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
11111111111111111111111111fff11111ffff1111fff1111ffff11111fff1111ffff1111fffff111fffff1111fff1111f111f1111fff11
1111ff11111111111ff111111f111f111f1111f11f111f111f111f111f111f111f111f111f1111111f1111111f111f111f111f11111f111
11ff11111fffff11111ff11111111f11f11ff1f11f111f111f111f111f1111111f111f111f1111111f1111111f1111111f111f11111f111
1f1111111111111111111f111111f111f1f1f1f11fffff111ffff1111f1111111f111f111fff11111fff11111f11ff111fffff11111f111
11ff11111fffff11111ff111111f1111f11fff111f111f111f111f111f1111111f111f111f1111111f1111111f111f111f111f11111f111
1111ff11111111111ff11111111111111f1111111f111f111f111f111f111f111f111f111f1111111f1111111f111f111f111f11111f111
111111111111111111111111111f111111fffff11f111f111ffff11111fff1111ffff1111fffff111f11111111fff1111f111f1111fff11
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
11111f111f111f111f1111111f111f111f111f1111fff1111ffff11111fff1111ffff11111fff1111fffff111f111f111f111f111f111f1
11111f111f11f1111f1111111ff1ff111ff11f111f111f111f111f111f111f111f111f111f111f11111f11111f111f111f111f111f1f1f1
11111f111f1f11111f1111111f1f1f111f1f1f111f111f111f111f111f111f111f111f111f111111111f11111f111f111f111f111f1f1f1
11111f111ff111111f1111111f111f111f11ff111f111f111ffff1111f111f111ffff11111fff111111f11111f111f1111f1f1111f1f1f1
1f111f111f1f11111f1111111f111f111f111f111f111f111f1111111f1f1f111f111f1111111f11111f11111f111f1111f1f11111f1f11
1f111f111f11f1111f1111111f111f111f111f111f111f111f1111111f11f1111f111f111f111f11111f11111f111f1111f1f11111f1f11
11fff1111f111f111fffff111f111f111f111f1111fff1111f11111111ff1f111f111f1111fff111111f111111fff111111f111111f1f11
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
1111111111111111111111111111fff111111111fff11111111f11111111111111f11111111111111111111111111111111111111111111
1111111111111111111111111111f1111111111111f1111111f1f11111111111111f1111111111111111111111111111111111111111111
1f111f111f111f111fffff111111f1111f11111111f111111f111f111111111111111111111111111f1111111111111111111f111111111
11f1f1111f111f1111111f111111f11111f1111111f11111111111111111111111111111111111111f1111111111111111111f111111111
11f1f11111f1f1111111f1111111f11111f1111111f111111111111111111111111111111ffff1111f1ff11111fff11111ff1f1111fff11
111f111111f1f111111f11111111f111111f111111f1111111111111111111111111111111111f111ff11f111f111f111f11ff111f111f1
11f1f111111f111111f111111111f1111111f11111f1111111111111111111111111111111ffff111f111f111f1111111f111f111fffff1
11f1f111111f11111f1111111111f1111111f11111f111111111111111111111111111111f111f111f111f111f111f111f111f111f11111
1f111f11111f11111fffff111111f11111111f1111f1111111111111111111111111111111ffff111ffff11111fff11111ffff1111ffff1
1111111111111111111111111111f1111111111111f11111111111111111111111111111111111111111111111111111111111111111111
1111111111111111111111111111fff111111111fff11111111111111fffff1111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
1111ff11111111111f111111111f1111111f11111f11111111f111111111111111111111111111111111111111111111111111111111111
111f1111111111111f111111111f1111111f11111f11111111f111111111111111111111111111111111111111111111111111111111111
11fff11111ff1f111f1ff11111111111111111111f11f11111f111111ff1f1111ffff11111fff1111f1ff11111ffff111f1ff11111ffff1
111f11111f11ff111ff11f11111f1111111f11111f1f111111f111111f1f1f111f111f111f111f111ff11f111f111f111ff11f111f11111
111f11111f111f111f111f11111f1111111f11111ff1111111f111111f1f1f111f111f111f111f111f111f111f111f111f11111111fff11
111f111111ffff111f111f11111f1111111f11111f1f111111f111111f1f1f111f111f111f111f111ffff11111ffff111f11111111111f1
111f111111111f111f111f11111f1111111f11111f11f111111f11111f1f1f111f111f1111fff1111f11111111111f111f1111111ffff11
111111111ffff111111111111111111111f1111111111111111111111111111111111111111111111f11111111111f11111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111f11111111111f11111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111fff111111111111111111
1111111111111111111111111111111111111111111111111111111111111ff1111f11111ff111111111111111f1f111111111111111111
111111111111111111111111111111111111111111111111111111111111f111111f1111111f11111111111111fff111111111111111111
11f111111111111111111111111111111111111111111111111111111111f111111f1111111f111111111111111111111fffff111fffff1
11f111111111111111111111111111111111111111111111111111111111f111111f1111111f11111111111111111111f11111f1f11111f
1ffff1111f111f111f111f111f111f111f111f111f111f111fffff111111f111111f1111111f1111111ff1f111111111f1fff1f1f1fff1f
11f111111f111f111f111f111f1f1f1111f1f1111f111f111111f11111ff1111111f11111111ff1111f1ff1111111111f1f111f1f1ff11f
11f111111f111f1111f1f1111f1f1f11111f111111f1f111111f11111111f111111f1111111f11111111111111111111f1fff1f1f1f1f1f
11f111111f111f1111f1f11111f1f11111f1f11111f1f11111f111111111f111111f1111111f11111111111111111111f11111f1f11111f
111ff11111ffff11111f111111f1f1111f111f11111f11111fffff111111f111111f1111111f111111111111111111111fffff111fffff1
111111111111111111111111111111111111111111f11111111111111111f111111f1111111f11111111111111111111111111111111111
11111111111111111111111111111111111111111f1111111111111111111ff1111f11111ff111111111111111111111111111111111111
111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
`,
                    "§!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°©®",
                    "",
                    "",
                    "",
                    8,
                    16,
                    1,
                    0,
                    15,
                    3
                )
                setCharFromSheet(
                    tid,
                    img`
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11fff1111ff11f111f1f1f1111fff11111f1f1111f1f11f11111ff1111fff1111fff11111ff11f111f1f1f111ff11f111ff11f1111fff11
                        1f111f111f1f1f111fff1f111f111f111f1f1f111fff11f111111f111f111f11f111f1111f1f1f111fff1f11f11f1f11f11f1f111f111f1
                        11f11f11111f1f11111f1f111f111f111f111f11111f11f11f111f1111111f111111f111111ff111111ff1111f1f1f111f1f1f1111f11f1
                        1f111f1111f11f1111f11f111fff1f111fff1f11111f11f111f11f1111ff1f11ff11f11111f11f1111f11f11f11f1f11f11f1f1111f11f1
                        1f111f111f111f111f111f111f111f111f111f11111f11f1111f1f11111f1f111f11f1111f111f111f111f11f11f1f11f11f1f1111f11f1
                        1f111f111f111f111f111f111f111f111f111f1111fff1f11111ff11111f1f111f1fff111f111f111f111f11f1ffff11ff1f1f111ff11f1
                        1f111f1111fff11111fff1111f111f111f111f1111ff1ff111111f111111ff111ff1ff1111fff11111fff111f1ff1f11ff1fff111ff11f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111113113111fffff1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111113331111fff1f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11fff11111fff111f1f1ff11f11f1f111ff11f1111fff11111f1f11111fff111ff1ff11111ffff11ff11f111ff111f11ff111f111ff11f1
                        1f111f111fff1111ffff11f1ffff1f11f11f1f111f111f111f1f1f111f111f111ff11f111f1111111f11f1111f111f111f111f111f111f1
                        11f11f111111f11111f111f1f11f1f111f1f1f111f111f111f111f1111f11f111f111f1111ffff111f11f1111f111f111f111f111f111f1
                        11f11f111ff1f11111f111f1f11f1f11f11f1f111fff1f111fff1f111f111f111f111f1111111f111f11f1111f111f111f111f111f111f1
                        11f11f1111f1f11111f111f1f11f1f11f11f1f111f1f1f111f1f1f111f111f111f111f1111f11f111f11f1111f111f111f111f111f1f1f1
                        1ff11f1111f1f11111f111f1f1ffff11ff1ffff11f1f1f111f1f1f111ff11f111f111f1111f11f111f1fff111f111f111f111f111ff1ff1
                        1ff11f1111ff111111f111f1f1ff1f11ff1f1ff11ff11f111ff11f111ff11f111f111f1111ffff111ff1ff111fffff111fffff111f111f1
                        11111f111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1ff1ff111331311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1f1f1f111313311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111111111111111f11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f
                        11111f111111111111111f1111111111111111111111111111111111111111111111111111111f111111111111111f111111111111111f1
                        1ff11f11ff111f11ff111f1111fff111ff11f111ff11f11111ff111111fff11111fff11111fff111ff111f1111fff111ff11ff11ff11ff1
                        1f111f111f111f111f111f111f111f111f11f111f111f1111f11f1111f111f111f111f111f1f1f111f111f111f1f1f111f11f1111f111f1
                        1f111f111f1f1f111f1f1f1111f11f111f11f111f111f11111f1111111111f1111111f111f111f111f1f1f1111111f111f1f1f111f1f1f1
                        1f111f111f1f1f111f1f1f1111f11f111f11f1111ff1f111111f111111ff1f1111111f111fff1f111f1ffff111ff1f111ff11f111f1f1f1
                        1f1f1f111ff1ff111ff1ff1111f11f111f11f111f111f111111f11111f11ff1111111f111f111f111f111f111f11ff111f111f111ff1ff1
                        1ff1ff111ff1ff111ff1ff111ff11f11fff1f111f111f111111f11111f111f111111ff111f111f111f111f111f111f111f111f111ff1ff1
                        1f111f111f111f111f111f111ff11f11ff1ff111fffff11111ff11111ff11f111111ff111f111f111fffff111ff11f111f111f111f111f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111fff11111ff11111f11f111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111111111f1111111f11f1111f1ff1111111111111111111111111111111111111111f1
                        11111111111111111111111111111111111111111111111111f111111f11f11111f1f1111111111111111111111111111f111f111ffff11
                        111111111111111111111111111111111111111111111111111f111111f1f1111111f1111111111111111111111111111ffff1111ff1ff1
                        1111111111111f1111111111111111111111111111111111111f11111111f1111111f111111111111111111111111111111111111111111
                        11fff1111ffff1111111111111fff1111111f1111f11f111111f11111111f1111111f11111fff11111fff11111fff111111111111111111
                        1f111f111fff1f111ff11f111f111f111111f1111f11f111111f11111111f1111111f1111f111f111f111f111f111f11111111111111111
                        11111f1111111f1111fff11111111f111111f1111f11f111111f11111111f1111111f11111f11f1111f11f1111111f11111111111111111
                        1ff11f111ff11f111111111111111f111111f1111f11f111111f11111111f1111111f1111f111f1111f11f1111111f11111111111111111
                        1f111f111f111f111ff11f1111111f111111f1111f11f111111f11111111f1111111f1111f111f1111f11f1111111f11111111111111111
                        1f111f111f111f1111fff11111111f111111ff111ff1ff11111ff1111111ff111111ff111ff11f111ff11f1111111f11111111111111111
                        1fffff111fffff111111111111111f111111ff111ff1ff11111ff1111111ff111111ff111ff11f111ff11f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111ff111111f111111ff11111fff1f11111f1111111111111111111
                        11111111111111111111111111111111111111111111111111111111111f1111111f1111111ff1111f1ff11111fff111111111111111111
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1111111111111111111
                        11ff11111111111111111f111111ff11111f1f1111111111111111111111111111111111111111111111111111111111ff1111111111111
                        11ff11111fffff111fffff111fffff111fffff1111111111111111111111111111111111111111111111111111111111ff1111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111fff11ffff11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1ffff11
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1ffff11
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111
                        111111111111111111111111111111111111111111ff111111f1f1111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111f1111111ff1111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111f111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111f111111111111111111f11111f1f1111f111111111111f111111f1111111f111111111111111111111111111111111
                        1ffff1111ffff1111f1f1f111ff1f1111fff11111fff111111f111111f1f11f111fff1111111f1111111111111111111111111111111111
                        f1111f11f1111f111f1fff11f11f1f11f1111111f1111111111ff111f1f1f1f11f1111111fff11111111111111111111111111111111111
                        f1111f11f1ff1f111f111f11f11f1f11f1111111f111111111111f11f1f1f1f1f1111111f11f11111111111111111111111111111111111
                        f1111f11f1ff1f111f111f11f11f1f11f1ff1111f1ff11111ff11f11f1f1f1f1f111f111f111f1111111111111111111111111111111111
                        f1111f11f11f1f111f111f11f11f1f11f1f11111f1f111111f111f11f1f1f1f1f1f1f111ff11f1111111111111111111111111111111111
                        1ffff1111ff11f111fffff11ff1f1f111ffff1111ffff11111fff111f1f1ff111f1ff111ff111f111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `,
                    "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮะาเแโใไฤฦๅั็ํิีึืุู์่้๊๋ำ฿๐๑๒๓๔๕๖๗๘๙",
                    "ั็ํิีึืุู์่้๊๋",
                    "ั็ํิีึื์่้๊๋",
                    "ำ",
                    8,
                    16,
                    1,
                    0,
                    15,
                    3
                )
                break;
        }
    }
}