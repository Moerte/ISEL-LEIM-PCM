class DrawingObjects {
    constructor(px, py, name) {
        if (this.constructor === DrawingObjects) {
            // Error Type 1. Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }
        //else (called from child)
        // Check if all instance methods are implemented.
        if (this.draw === DrawingObjects.prototype.draw) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method draw.");
        }
        if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method mouseOver.");
        }
        this.posx = px;
        this.posy = py;
        this.name = name;
    }

    draw(cnv) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method draw from child.");
    }

    setPos(x, y) {
        this.posx = this.posx + x;
        this.posy = this.posy + y;
    }
    getPosX() {
        return this.posx;
    }
    getPosY() {
        return this.posy;
    }

    overwritePos(x, y) {
        this.posx = x;
        this.posy = y;
    }

    mouseOver(mx, my) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method mouseOver from child.");
    }

    sqDist(px1, py1, px2, py2) {
        let xd = px1 - px2;
        let yd = py1 - py2;
        return ((xd * xd) + (yd * yd));
    }
}

class Rect extends DrawingObjects {

    constructor(px, py, w, h, c) {
        super(px, py, 'R');
        this.w = w;
        this.h = h;
        this.color = c;
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx, this.posy, this.w, this.h);
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));
    }
}



class Ball extends DrawingObjects {

    constructor(px, py, w, h, c) {
        super(px, py, 'R');
        this.w = w;
        this.h = h;
        this.color = c;
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");
        let tamanho = 3;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx, this.posy, this.w * tamanho, this.h * tamanho);
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));

    }
}


class Picture extends DrawingObjects {

    constructor(px, py, w, h, impath) {
        super(px - (w / 2), py - (h / 2), 'P');
        this.w = w;
        this.h = h;
        this.impath = impath;
        this.imgobj = new Image();
        this.imgobj.src = this.impath;
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");

        if (this.imgobj.complete) {
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
        } else {
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }
    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));
    }
}

class Oval extends DrawingObjects {
    constructor(px, py, r, hs, vs, c) {
        super(px, py, 'O');
        this.r = r;
        this.radsq = r * r;
        this.hor = hs;
        this.ver = vs;
        this.color = c;
    }

    mouseOver(mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx) / this.hor;
        let y2 = (my - this.posy) / this.ver;

        return (this.sqDist(x1, y1, x2, y2) <= (this.radsq));
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");

        ctx.save();
        ctx.translate(this.posx, this.posy);
        ctx.scale(this.hor, this.ver);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}


class Heart extends DrawingObjects {
    constructor(px, py, w, c) {
        super(px, py, 'H');
        this.h = w * 0.7;
        this.drx = w / 4;
        this.radsq = this.drx * this.drx;
        this.ang = .25 * Math.PI;
        this.color = c;
    }

    outside(x, y, w, h, mx, my) {
        return ((mx < x) || (mx > (x + w)) || (my < y) || (my > (y + h)));
    }

    draw(cnv) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let cx = rightctrx + this.drx * Math.cos(this.ang);
        let cy = this.posy + this.drx * Math.sin(this.ang);
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);
        ctx.arc(leftctrx, this.posy, this.drx, 0, Math.PI - this.ang, true);
        ctx.lineTo(this.posx, this.posy + this.h);
        ctx.lineTo(cx, cy);
        ctx.arc(rightctrx, this.posy, this.drx, this.ang, Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    mouseOver(mx, my) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let qx = this.posx - 2 * this.drx;
        let qy = this.posy - this.drx;
        let qwidth = 4 * this.drx;
        let qheight = this.drx + this.h;

        let x2 = this.posx;
        let y2 = this.posy + this.h;
        let m = (this.h) / (2 * this.drx);

        //quick test if it is in bounding rectangle
        if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
            return false;
        }

        //compare to two centers
        if (this.sqDist(mx, my, leftctrx, this.posy) < this.radsq) return true;
        if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

        // if outside of circles AND less than equal to y, return false
        if (my <= this.posy) return false;

        // compare to each slope
        // left side
        if (mx <= this.posx) {
            return (my < (m * (mx - x2) + y2));
        } else {  //right side
            m = -m;
            return (my < (m * (mx - x2) + y2));
        }
    }
}


class PolyShape extends DrawingObjects {
    constructor(position_x, poisition_y, pontos, color) {
        super(position_x, poisition_y, 'S');
        this.pontos = pontos;
        this.color = color;
        this.pontos_x = this.pontos.map((ponto) => {
            return ponto[0];
        });
        this.pontos_y = this.pontos.map((ponto) => {
            return ponto[1];
        });
    }

    outside(x, y, w, h, mx, my) {
        return ((mx < x) || (mx > (x + w)) || (my < y) || (my > (y + h)));
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);

        ctx.moveTo(this.pontos[0][0], this.pontos[0][1]);

        this.pontos.forEach(ponto => {
            ctx.lineTo(ponto[0], ponto[1]);
        });

        ctx.closePath();
        ctx.fill();

        ctx.closePath();
        ctx.fill();
    }

    mouseOver(mx, my) {

        var intersect_x_matches = 0;
        var intersect_y_matches = 0;
        //Make Line for X and check for  interesctions
        for (var x = 0; x < mx; x++) {
            if (this.pontos_x.indexOf(x) > 0) {
                intersect_x_matches = intersect_x_matches + 1;
            }
        }

        //Make Line for X and check for  interesctions
        for (var y = 0; y < my; y++) {
            if (this.pontos_y.indexOf(y) > 0) {
                intersect_y_matches = intersect_y_matches + 1;
            }
        }
        return false;

    }
}

class Bear extends DrawingObjects {
    constructor(px, py, color) {
        super(px, py, 'B');
        let x = this.posx;
        let y = this.posy;
        this.color = color;
        let tamanho = 1;
        let earSize = (40 * 1.5) * tamanho;
        let earH = 40 * tamanho;
        let bodySize = 80 * tamanho;
        let eyeSizeX = 30 * tamanho;
        let eyeSizeY = 25 * tamanho;

        this.ovals = [
            new Oval(x + earSize, y - earSize, 40 * tamanho, 1, 1, color), //orelha
            new Oval(x - earSize, y - earSize, 40 * tamanho, 1, 1, color), //orelha
            new Oval(x + earSize, y - earSize, 40 * tamanho, 0.5, 0.5, "pink"), //orelha int
            new Oval(x - earSize, y - earSize, 40 * tamanho, 0.5, 0.5, "pink"), //orelha int
            new Oval(x, y, bodySize, 1.1, 1, color), //main
            new Oval(x - eyeSizeX, y - eyeSizeY, 10 * tamanho, 1, 1, "#00f"), //eye
            new Oval(x + eyeSizeX, y - eyeSizeY, 10 * tamanho, 1, 1, "#00f"), //eye
            new Oval(x, (y + 5), 15 * tamanho, 1.5, 1.1, "#f00"), //nose
            new Oval((x - 9), (y - 3), 10 * tamanho, 1.5 / 2, 1.1 / 2, "#fff"), //nose
            //Brilho nos olhos
            new Oval((x - 30), (y - 25), 10 * tamanho, 0.5, 0.5, "black"), //eye
            new Oval((x + 30), (y - 25), 10 * tamanho, 0.5, 0.5, "black"), //eye
            new Oval((x - 33), (y - 27), 10 * tamanho, 0.2, 0.2, "white"), //eye
            new Oval((x + 27), (y - 27), 10 * tamanho, 0.2, 0.2, "white"), //eye

        ];
    }
    setPos(x, y, color) {
        super.setPos(x, y, color);

        this.ovals[0].overwritePos(this.posx + (40 * 1.5), this.posy - (40 * 1.5))
        this.ovals[1].overwritePos(this.posx - (40 * 1.5), this.posy - (40 * 1.5))
        this.ovals[2].overwritePos(this.posx + (40 * 1.5), this.posy - (40 * 1.5)) //orelha int
        this.ovals[3].overwritePos(this.posx - (40 * 1.5), this.posy - (40 * 1.5)) //orelha int
        this.ovals[4].overwritePos(this.posx, this.posy), //main
        
        this.ovals[5].overwritePos(this.posx - 30, this.posy - 25), //ethis.posye
        this.ovals[6].overwritePos(this.posx + 30, this.posy - 25), //ethis.posye
        this.ovals[7].overwritePos(this.posx, this.posy + 5), //nose
        this.ovals[8].overwritePos(this.posx - 9, this.posy - 3, 10); //nose

        //Brilho nos olhos
        this.ovals[9].overwritePos(this.posx - 30, this.posy - 25); //ethis.posye
        this.ovals[10].overwritePos(this.posx + 30, this.posy - 25); //ethis.posye
        this.ovals[11].overwritePos(this.posx - 33, this.posy - 27); //ethis.posye
        this.ovals[12].overwritePos(this.posx + 27, this.posy - 27); //eye

    }

    mouseOver(mx, my) {
        var over_ovals = [this.ovals[0], this.ovals[1], this.ovals[4]]

        over_ovals = over_ovals.map(function (oval) {
            return oval.mouseOver(mx, my);
        });

        if (over_ovals.indexOf(true) > -1) {
            return true;
        }
        return false;
    }

    draw(cnv) {
        let x = this.posx
        let y = this.posy
        let ctx = cnv.getContext("2d");

        for (let oval in this.ovals) {
            if (oval == "5" || oval == "6") {
                ctx.shadowBlur = 20;
                ctx.shadowColor = "#00f";
            } else {
                ctx.shadowBlur = 0;
                ctx.shadowColor = "red";
            }
            this.ovals[oval].draw(cnv);
        }

        //Draw arcs
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';

        ctx.beginPath();
        ctx.arc(x - 20, y + 15, 20, 0, 0.8 * Math.PI, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x + 20, y + 15, 20, -1 * (0.8 * Math.PI - Math.PI), 0.5 * (2 * Math.PI));
        ctx.stroke();

        ctx.setTransform(1, 0, 0, 1, 0, 0);

    }
}

class Ghost extends DrawingObjects {
    constructor(px, py, width, height, color) {
        super(px, py, "G");
        this.width = width;
        this.height = height;
        this.color = color;
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.width)) && (my >= this.posy) && (my <= (this.posy + this.height)));
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");

        ctx.width = this.width;
        ctx.height = this.height;

        ctx.fillStyle = this.color;
        ctx.save()
        ctx.beginPath();

        ctx.moveTo(this.posx + (this.height * 0.2), this.posy);
        ctx.bezierCurveTo(this.posx + (this.height * 0.2), this.posy - (this.height * 0.2), this.posx + (this.height * 0.2) + (this.width / 2), this.posy - 50, this.posx + this.width, this.posy);

        ctx.moveTo(this.posx + (this.height * 0.2), this.posy);

        ctx.lineTo((this.posx + (this.height * 0.2)), this.posy + (this.height * 0.4));
        ctx.lineTo((this.posx + (this.height * 0.2)) + (this.width * 0.8), this.posy + (this.height * 0.4));
        ctx.lineTo((this.posx + (this.height * 0.2)) + (this.width * 0.8), this.posy);

        ctx.moveTo((this.posx + (this.height * 0.2)), this.posy + (this.height * 0.4));
        ctx.lineTo((this.posx + (this.height * 0.2)), (this.posy + (this.height * 0.55)));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.1, this.posy + (this.height * 0.4));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.2, this.posy + (this.height * 0.55));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.3, this.posy + (this.height * 0.4));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.4, this.posy + (this.height * 0.55));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.5, this.posy + (this.height * 0.4));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.6, this.posy + (this.height * 0.55));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.7, this.posy + (this.height * 0.4));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.8, this.posy + (this.height * 0.55));
        ctx.lineTo((this.posx + (this.height * 0.2)) + this.width * 0.8, this.posy + (this.height * 0.4));
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx + (this.width * 0.42), this.posy + (this.height * 0.12), this.width / 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.posx + (this.width * 0.78), this.posy + (this.height * 0.12), this.width / 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx + (this.width * 0.38), this.posy + (this.height * 0.15), this.width / 30, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.posx + (this.width * 0.74), this.posy + (this.height * 0.15), this.width / 30, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

class DrawingText extends DrawingObjects {
    constructor(px, py, fontfamily, text, color, size) {
        super(px, py, "TEXT")
        this.text = text;
        this.size = size;
        this.font = fontfamily;
        this.color = color;
        console.log(px, py, size)
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");
        ctx.font = `${this.size}px "${this.font}"`;
        this.width = ctx.measureText(this.text).width;
        this.height = this.size;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.posx, this.posy)
    }

    mouseOver(mx, my) {

        var isX = mx > this.posx && mx <= this.posx + this.width;
        var isY = my > this.posy - this.height && my <= this.posy;
        return isX && isY;
    }

}

class Trapezoid extends DrawingObjects {
    constructor(px, py, width, height, color) {
        super(px, py, "T");
        this.posx = px;
        this.posy = py;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.width)) && (my >= this.posy) && (my <= (this.posy + this.height)));
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");

        let x = this.posx;
        let y = this.posy;

        ctx.fillStyle = this.color
        let width = this.width;
        let height = this.height;

        ctx.beginPath()
        ctx.moveTo(x + 20, y)
        ctx.lineTo((x + width) - 20, y)
        ctx.lineTo((x + width), y + height) // create the right side
        ctx.lineTo(x, y + height) // top side
        ctx.closePath() // left side and closes the path
        ctx.fill() // draws it to screen via a strok
    }
}


class Brush extends DrawingObjects {
    constructor(px, py, width, color) {
        super(px, py, "T");
        this.posx = px;
        this.posy = py;
        this.width = width;
        this.color = color;
    }

    mouseOver(mx, my) {
        return false;
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");

        let x = this.posx;
        let y = this.posy;

        ctx.fillStyle = this.color
        let width = this.width;
        ctx.beginPath();
        ctx.arc(x, y, this.width, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}