'use strict';

class FotoPrint {
    constructor() {
        this.thingInMotion = null;
        this.offsetx = null;
        this.offsety = null;
        this.shpinDrawing = new Pool(999999);
        this.forms_seletor = new Pool(100);
        this.selected_object = "";
        this.background_color = "white";
        this.foreground_color = "black";
        this.mode = "shape";
        this.brush_size = 4;
        this.shape_size = 1;
        this.selected_obj = false;
        let ui = new Interface(this);
        ui.setState(this.mode);
    }

    setMode(mode) {
        if (mode) {
            this.mode = mode;
        }
    }

    init() {

        let r = new Rect(20, (300 - 10) / 2, 20, 20, this.foreground_color);
        this.forms_seletor.insert(r);

        let o = new Oval(100, (300 - 50) / 2 + 30, 50, 0.5, 0.5, this.foreground_color);
        this.forms_seletor.insert(o);

        let t = new Trapezoid(150, (300 - 50) / 2, 100, 50, 20, this.foreground_color);
        this.forms_seletor.insert(t);

        let g = new Ghost(250, (300 - 50) / 2, 100, 100, this.foreground_color);
        this.forms_seletor.insert(g);

        let h = new Heart(410, (300 - 50) / 2, 80, this.foreground_color);
        this.forms_seletor.insert(h);

        let b = new Bear(560, 140, this.foreground_color);
        this.forms_seletor.insert(b);

        let dad = new Picture(730, (300 - 50) / 2, 70, 70, "imgs/ghostbusters.jpg");
        this.forms_seletor.insert(dad);
    }

    drawObj(cnv, options) {
        if (!options) options = false;
        this.setBackground(cnv);

        if (options) {
            for (let i = 0; i < this.forms_seletor.stuff.length; i++) {
                this.forms_seletor.stuff[i].draw(cnv);
            }
            return
        }
        for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
            this.shpinDrawing.stuff[i].draw(cnv);
        }
    }

    drawSelector(cnv, type) {
        let des = new Rect(type.getPosX() - 10, 0, 30, 30, "red");
        switch (type.name) {
            case "R":
                des = new Rect(type.getPosX() - 5, type.getPosY() + 30, 30, 10, "red");
                break;

            case "P":
                des = new Rect(type.getPosX() - 5, type.getPosY() + 70, 80, 10, "red");
                break;

            case "O":
                des = new Rect(type.getPosX() - 30, type.getPosY() + 30, 60, 10, "red");
                break;

            case "H":
                des = new Rect(type.getPosX() - 40, type.getPosY() + 55, 80, 10, "red");
                break;
            case "S":
                des = new Rect(type.getPosX(), 0 / 2, 20, 20, "red");
                break;
            case "G":
                des = new Rect(type.getPosX() + 15, type.getPosY() + 55, 90, 10, "red");
                break;

            case "T":
                des = new Rect(type.getPosX() - 5, type.getPosY() + 55, 110, 10, "red");
                break;

            case "B":
                des = new Rect(type.getPosX() - 90, type.getPosY() + 80, 180, 10, "red");
                break;
        }
        des.draw(cnv);
    }

    dragObj(mx, my) {

        let endpt = this.shpinDrawing.stuff.length - 1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                this.offsetx = mx - this.shpinDrawing.stuff[i].posx;
                this.offsety = my - this.shpinDrawing.stuff[i].posy;
                let item = this.shpinDrawing.stuff[i];
                this.thingInMotion = this.shpinDrawing.stuff.length - 1;
                this.shpinDrawing.stuff.splice(i, 1);
                this.shpinDrawing.stuff.push(item);
                return true;
            }
        }
        return false;
    }

    background(color) {
        this.background_color = color;
    }

    foreground(color) {
        this.foreground_color = color;
    }
    setBackground(cnv) {
        var ctx = cnv.getContext("2d");
        var width = cnv.width;
        var height = cnv.height;
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = this.background_color;
        ctx.fill();
        ctx.closePath();

    }
    drawPicture(width, height, src) {
        let dad = new Picture(0 + width / 2, 0 + height / 2, width, height, src);
        this.shpinDrawing.insert(dad);
    }
    drawText(x, y, fontsize, fontfamily, text) {
        let shape = new DrawingText(x, y, fontfamily, text, this.foreground_color, fontsize);
        this.shpinDrawing.insert(shape);
    }
    drawBrush(x, y) {
        let shape = new Brush(x, y, this.brush_size, this.foreground_color);
        this.shpinDrawing.insert(shape);
    }
    moveObj(mx, my) {
        this.shpinDrawing.stuff[this.thingInMotion].setPos(mx, my);
    }

    removeObj() {
        this.shpinDrawing.remove();
    }

    removeAll() {
        let length = this.shpinDrawing.stuff.length;
        for (let i = 0; i < length; i++) {
            this.shpinDrawing.remove();
        }

    }

    insertObj(mx, my) {
        let item = null;
        let endpt = this.shpinDrawing.stuff.length - 1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                item = this.cloneObj(this.shpinDrawing.stuff[i]);
                this.shpinDrawing.insert(item);
                return true;
            }
        }
        return false;
    }

    insertSelectedObj(mx, my) {
        this.shpinDrawing.insert(this.makeObj(mx, my));
        return true;
    }

    selectObj(mx, my) {
        let item = null;
        let endpt = this.forms_seletor.stuff.length - 1;

        for (let i = endpt; i >= 0; i--) {
            if (this.forms_seletor.stuff[i].mouseOver(mx, my)) {
                this.selected_object = this.forms_seletor.stuff[i]
                this.selected_obj = true;
                return true;
            }
        }
        return false;
    }

    cloneObj(obj) {
        let item = {};
        console.log("Clone")
        let color = this.foreground_color;

        switch (obj.name) {
            case "R":
                item = new Rect(obj.posx + 20, obj.posy + 20, obj.w, obj.h, color);
                break;

            case "P":
                item = new Picture(obj.posx + 20, obj.posy + 20, obj.w, obj.h, obj.impath);
                break;

            case "O":
                item = new Oval(obj.posx + 20, obj.posy + 20, obj.r, obj.hor, obj.ver, color);
                break;

            case "H":
                item = new Heart(obj.posx + 20, obj.posy + 20, obj.drx * 4, color);
                break;
            case "S":
                item = new PolyShape(obj.posx + 20, obj.posy + 20, obj.w, obj.h, color);
                break;
            case "G":
                item = new Ghost(this.selected_object.posx, this.selected_object.posy, this.selected_object.width, this.selected_object.height, this.selected_object.color)
                break;

            case "T":
                item = new Trapezoid(this.selected_object.posx, this.selected_object.posy, this.selected_object.width, this.selected_object.height, color);
                break;

            case "B":
                item = new Bear(obj.posx + 20, obj.posy + 20, color);
                break;
            default: throw new TypeError("Can not clone this type of object");
        }
        return item;
    }

    makeObj(x, y) {
        let item = {};

        let color = this.foreground_color;

        switch (this.selected_object.name) {
            case "R":
                item = new Rect(x, y, this.selected_object.w * this.shape_size, this.selected_object.h * this.shape_size, color);
                break;

            case "P":
                item = new Picture(x, y, this.selected_object.w * this.shape_size, this.selected_object.h * this.shape_size, this.selected_object.impath);
                break;

            case "O":
                item = new Oval(x, y, this.selected_object.r * this.shape_size, this.selected_object.hor, this.selected_object.ver, color);
                break;

            case "H":
                item = new Heart(x, y, this.selected_object.drx * 4 * this.shape_size, color);
                break;

            case "G":
                item = new Ghost(x, y, this.selected_object.width * this.shape_size, this.selected_object.height * this.shape_size, color)
                break;

            case "T":
                item = new Trapezoid(x, y, this.selected_object.width * this.shape_size, this.selected_object.height * this.shape_size, color);
                break;

            case "B":
                item = new Bear(x, y + 20, color);
                break;
            default: throw new TypeError("Can not clone this type of object");
        }
        return item;
    }
}


class Pool {
    constructor(maxSize) {
        this.size = maxSize;
        this.stuff = [];

    }

    insert(obj) {
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    remove() {
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
            alert("There aren't objects in the application to delete");
        }
    }
}

class Interface {
    constructor(FotoPrintObject) {
        let self = this;
        this.that = FotoPrintObject;
        this.state = "shape";
        this.cnv = $('#main').get(0);
        this.cnv2 = $('#shape-area').get(0);
        this.update();
        this.attachToDom();

        var ctx = this.cnv.getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;


        window.onresize = () => {
            var ctx = self.cnv.getContext('2d');

            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;

            drawCanvasRect(self.cnv);
            self.that.drawObj(self.cnv);
        }

        self.that.init();
        self.that.drawObj(this.cnv2, true);

        self.that.background($("#background-color").val());

        drawCanvasRect(this.cnv);
        self.that.drawObj(this.cnv);

        $("body").find("#background-picker").css('background-color', $("#background-color").val());
        self.that.background($("#background-color").val());
        self.that.foreground($("#foreground-color").val());

    }

    update() {
        var nodes = Array.prototype.slice.call($(".menu-content"));
        nodes.forEach(element => {
            $(element).css('display', "none");
        });

        var node = $(`.menu-content[data-options="${this.state}"]`);
        node.css('display', "block");

        var nodes = Array.prototype.slice.call($("li.item-selected"));
        nodes.forEach(element => {
            $(element).removeClass("item-selected");
        });

        var node = $(`li[data-options="${this.state}"]`);
        node.addClass("item-selected");
    }

    setState(state) {
        if (state) {
            this.state = state;
            this.update();
            this.that.setMode(state);
        }
    }

    getState(state) {
        return this.state;
    }

    attachToDom() {
        let self = this;
        let nodes = Array.prototype.slice.call($(`.tool-item[data-options]`));

        nodes.forEach(element => {
            $(element).removeClass("item-selected");
            element.addEventListener("click", (e) => {
                self.setState(e.currentTarget.dataset.options);
            })
        });

        $(".export-action").on("click", () => {
            saveasimage(self.cnv);
        });


        $(".undo-action").on("click", () => {
            self.that.removeObj();
            drawCanvasRect(self.cnv);
            self.that.drawObj(self.cnv);
        });

        $(".clear-action").on("click", () => {
            self.that.removeAll();
            self.that.background("#eaeaea");

            drawCanvasRect(this.cnv);
            self.that.drawObj(this.cnv);
        });

        $("#brush_size").on("input", (e) => {
            self.that.brush_size = e.target.value;
        });

        $("#brush_size input").on("input", (e) => {
            $("#brush_size").find(".range-slider__value").text(e.currentTarget.value + "px");
        });

        $("#shape_size").on("input", (e) => {
            self.that.shape_size = e.target.value;

        });

        $("#shape_size input").on("input", (e) => {
            $("#shape_size").find(".range-slider__value").text(e.currentTarget.value + "x");
        });

        $("#choose_file").on("click", (e) => {
            $("#filepicker").trigger('click');
        });

        $("#filepicker").on("input", (e) => {
            console.log("sim e este")
            var src = window.URL.createObjectURL(e.target.files[0]);
            var img = new Image();
            img.src = src;
            img.onload = function () {
                self.that.drawPicture(this.width, this.height, src);
                self.that.drawObj(self.cnv);
                $("#filepicker").val("");
            };
        });

        $(".color-show.foreground").on("click", (e) => {
            $("#foreground-color").trigger('click');
            e.currentTarget.style.zIndex = 2;
            $(".color-show.background").css('zIndex', 1);

        });

        $(".color-show.background").on("click", (e) => {
            $("#background-color").trigger('click');
            e.currentTarget.style.zIndex = 2;
            $(".color-show.foreground").css('zIndex', 1);
        });

        $("#foreground-color").on("input", (e) => {
            $(".color-show.foreground").css('background-color', e.currentTarget.value);
            self.that.foreground(e.target.value);
        });

        $("#background-color").on("input", (e) => {
            $(".color-show.background").css('background-color', e.currentTarget.value);
            self.that.background(e.target.value);
            self.that.drawObj(self.cnv);
        });


        self.cnv.addEventListener('mousedown', (ev) => {
            if (self.that.mode == "brush" || ev.shiftKey) {
                drag(ev, self.cnv);
            } else {
                makenewitem(ev, self.cnv);
            }
        });

        self.cnv.addEventListener('mousemove', (ev) => {
            let { mx, my } = getMouseCoords(ev)

            if (mousedown && self.that.mode == "brush") {
                self.that.drawBrush(mx, my);
                self.that.drawObj(self.cnv);
            }
        });

        self.cnv.addEventListener('mouseup', () => {
            mousedown = false;
        });

        self.cnv2.addEventListener('click', selectitem);
        self.cnv2.addEventListener('click', () => {
            drawCanvasRect(self.cnv2);
            self.that.drawObj(this.cnv2, true);
            self.that.drawSelector(this.cnv2, self.that.selected_object);
        });
    }
}

