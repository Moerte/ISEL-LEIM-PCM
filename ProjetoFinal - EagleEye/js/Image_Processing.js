// Using workers to make this script non-blocking, all of the heavy lifting is done by the worker and sent trough post message to this context
var workerVar = new Worker('js/workerExperience.js');

function queueWorkerCallback(fn, wrapperId) {
    // Register multiple callbacks for an event, then call them as we receive the post message
    // The ideia is to have just on event listener, and have the worker telling which file processed, and use that as single id.
    // Currently there's one callback per id, but can be expaned to have multiple callbacks per id
    window.workerCallbackQueue = window.workerCallbackQueue || [];
    window.workerCallbackQueue[wrapperId] = fn;
}

workerVar.addEventListener("message", e => {
    // Handle the worker message qeue, to make sure all the image promises resolve
    window.workerCallbackQueue[e.data.id](e); // call the function queued for this message.data.id
    delete workerCallbackQueue[e.data.id](e); // clear refences for garbage collector 
})

class Picture {

    constructor(px, py, w, h, xml, keywords, withXML = true) {
        this.posx = px;
        this.posy = py;
        this.keywords = keywords;
        if (withXML) {
            this.impath = xml.querySelector("path").textContent;
            this.category = xml.className;
            this.title = xml.querySelector("title").textContent
            this.dominantColor = xml.querySelector("dominantcolor").textContent.toLowerCase();
        } else {
            this.impath = xml;
            this.category = "";
            this.title = "";
            this.dominantColor = "";
        }
        this.w = 0;
        this.h = 0;
        this.imgobj = new Image();
        this.imgobj.src = this.impath;
        this.original_w = this.imgobj.width;
        this.original_h = this.imgobj.height;
        this.hist = [];
        this.color_moments = [];
        this.manhattanDist = [];
        this.awaitingSW = false;
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");
        if (this.imgobj.complete) {
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
            console.log("Debug: N Time");
        } else {
            console.log("Debug: First Time");
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }
    getAll(pixels, blocks) {
        workerVar.postMessage({ id: this.impath, command: "calculate_all", pixels: pixels.data, blocks: blocks });
    }

    //method to apply the algorithms to the image.
    //Because the image have to loaded from the server, the same strategy used in the method draw()
    //is used here to access the image pixels. We do not exactly when the image in loaded and computed.
    // NOTE: Most of this code was converted into async promises stuff with workers
    computation(cnv, histcol, colorMom) {
        let ctx = cnv.getContext("2d");
        return new Promise((resolve, reject) => {
            this.imgobj.addEventListener('load', () => {
                ctx.drawImage(this.imgobj, 0, 0, this.imgobj.width, this.imgobj.height);
                let pixels = ctx.getImageData(0, 0, this.imgobj.width, this.imgobj.height);
                this.getAll(pixels, colorMom.getBlocks(this.imgobj, cnv));
                queueWorkerCallback(e => {
                    if (e.data.result == "all_result") {
                        if (e.data.id == this.impath) {
                            let [hist, moments] = e.data.data;
                            this.hist = hist;
                            this.color_moments = moments;
                            resolve(this)
                        }
                    }
                }, this.impath)
            }, false);
        });

    }
    setManhattan(data) {
        this.hist = data;
    }

    setColorMoments(data) {
        this.color_moments = data;
    }
    generateTag() {
        return `<img src='${this.impath}'></img>`
    }

    // Debug method
    // It shows the color and the correspondent number of pixels obtained by the colorHistogram algorithm
    build_Color_Rect(cnv, hist, redColor, greenColor, blueColor) {
        let ctx = canvas.getContext("2d");
        let text_y = 390;
        let rect_y = 400;
        let hor_space = 80;

        ctx.font = "12px Arial";
        for (let c = 0; c < redColor.length; c++) {
            ctx.fillStyle = "rgb(" + redColor[c] + "," + greenColor[c] + "," + blueColor[c] + ")";
            ctx.fillRect(c * hor_space, rect_y, 50, 50);
            if (c === 8) {
                ctx.fillStyle = "black";
            }
            ctx.fillText(hist[c], c * hor_space, text_y);
        }
    }

    setPosition(px, py) {
        this.posx = px;
        this.posy = py;
    }

    mouseOver(mx, my) {
        if ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h))) {
            return true;
        }
        return false;
    }

}

// Class for legacy purposes
class ColorHistogram {
    constructor(redColor, greenColor, blueColor) {
    }
}

// Class to get the image blocks, the math is done by the worker
class ColorMoments {
    constructor() {
        this.h_block = 3;
        this.v_block = 3;
    }

    // Calculates the blocks, the Moments math is done by the worker
    getBlocks(imgobj, cnv) {
        let wBlock = Math.floor(imgobj.width / this.h_block);
        let hBlock = Math.floor(imgobj.height / this.v_block);
        var blocks = []
        let blockWidth = wBlock
        let blockHeight = hBlock
        var block = ""
        let ctx = cnv.getContext("2d");
        ctx.drawImage(imgobj, 0, 0);

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                block = ctx.getImageData(blockWidth * x, blockHeight * y, blockWidth, blockHeight);
                blocks.push(block.data)
            }
        }
        return blocks
    }
}



