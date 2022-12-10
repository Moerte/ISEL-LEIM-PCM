'use strict';

class ISearchEngine {
    constructor(dbase) {
        //Pool to include all the objects (mainly pictures) drawn in canvas 
        this.picturesPool = new Pool(1500);
        this.keyLocalStorage = "images"
        this.itemsPerPage = 30;
        this.currentPage = 0;
        this.resultQuery = [];
        //Array of color to be used in image processing algorithms
        this.colors = ["red", "orange", "yellow", "green", "Blue-green", "blue", "purple", "pink", "white", "grey", "black", "brown"];
        // Red component of each color
        this.redColor = [204, 251, 255, 0, 3, 0, 118, 255, 255, 153, 0, 136];
        // Green component of each color
        this.greenColor = [0, 148, 255, 204, 192, 0, 44, 152, 255, 153, 0, 84];
        // Blue component of each color
        this.blueColor = [0, 11, 0, 0, 198, 255, 167, 191, 255, 153, 0, 24];
        this.hexColor = ["#00000000", "#cc0000", "#fb940b", "#ffff00", "#00cc00", "#03c0c6", "#0000ff", "#762ca7", "#ff98bf", "#ffffff", "#999999", "#000000", "#885418"]
        // List of categories available in the image database
        this.categories = ["beach", "birthday", "face", "indoor", "manmade/artificial", "manmade/manmade", "manmade/urban", "marriage", "nature", "no_people", "outdoor", "party", "people", "snow"];
        // Name of the XML file with the information related to the images 
        this.XML_file = dbase;
        // Instance of the XML_Database class to manage the information in the XML file 
        this.XML_db = new XML_Database();
        // Instance of the LocalStorageXML class to manage the information in the LocalStorage 
        this.LS_db = new LocalStorageXML();
        // Number of images per category for image processing
        this.num_Images = 1;
        // Number of images to show in canvas as a search result
        this.numshownpic = 35;
        // Width of image in canvas
        this.imgWidth = 190;
        // Height of image in canvas
        this.imgHeight = 140;
    }

    // Method to initialize the canvas. First stage it is used to process all the images
    init(cnv) {
        //this.databaseProcessing(cnv);
        this.createXMLIExampledatabaseLS()
    }

    // method to build the database which is composed by all the pictures organized by the XML_Database file
    // At this initial stage, in order to evaluate the image algorithms, the method only compute one image.
    // However, after the initial stage the method must compute all the images in the XML file
    databaseProcessing(cnv) {
        //Images processing classes
        let h12color = new ColorHistogram(this.redColor, this.greenColor, this.blueColor);

        let colmoments = new ColorMoments();

        let img = new Picture(0, 0, 100, 100, "Images/daniel1.jpg", "test");

        //Creating an event that will be used to understand when image is already processed
        let eventname = "processed_picture_" + img.impath;
        let eventP = new Event(eventname);
        let self = this;
        document.addEventListener(eventname, function () {
            //self.imageProcessed(img, eventname);
        }, false);

        //img.computation(cnv, h12color, colmoments, eventP);
    }

    imageProcessed(img) {
        this.picturesPool.insert(img);
    }

    // Method to create the XML database in the localStorage for Image Example queries
    createXMLIExampledatabaseLS() {
        var cnv = document.querySelector("canvas");
        var ch = new ColorHistogram(this.redColor, this.greenColor, this.blueColor);
        var cn = new ColorMoments();
        var ev = new Event("processed_picture");
        if (localStorage.getItem(this.keyLocalStorage)) {
            // Make the pool from the localStorage, and put the loaded values
            var doc = this.LS_db.readLS_XML(this.keyLocalStorage);
            var images = doc.querySelectorAll("image");
            for (let i = 0; i < images.length; i++) {
                let a = new Picture(0, 0, 0, 0, images[i], images[i].getAttribute("keywords"));
                a.setColorMoments(JSON.parse(images[i].getAttribute("colorMoments")));
                a.setManhattan(JSON.parse(images[i].getAttribute("histogram")));
                this.imageProcessed(a);
            }
        } else {
            this.XML_db.loadXMLfile(this.XML_file).then((doc) => {
                window.location.hash = "#/loading";
                // Process  the xml
                var images = doc.querySelectorAll("image");

                let promises = [];
                for (let i = 0; i < images.length; i++) {
                    let keywords = images[i].querySelector("title").textContent.toLowerCase().replace(/ -/g, "").replace(/ /g, ",");
                    let a = (new Picture(0, 0, 0, 0, images[i], keywords)).computation(cnv, ch, cn, ev);
                    images[i].querySelector("latitude").remove();
                    images[i].querySelector("longitude").remove();
                    images[i].querySelector("date").remove();
                    a.then(data => {
                        console.count("resolved");
                        images[i].setAttribute("dominantColor", data.dominantColor);
                        images[i].setAttribute("colorMoments", JSON.stringify(data.color_moments));
                        images[i].setAttribute("histogram", JSON.stringify(data.hist));
                        images[i].setAttribute("width", data.imgobj.width);
                        images[i].setAttribute("height", data.imgobj.height);
                        images[i].setAttribute("keywords", data.keywords);
                        this.imageProcessed(data);
                    });
                    promises.push(a);

                }
                Promise.all(promises).then(() => {
                    this.LS_db.saveLS_XML(this.keyLocalStorage, doc.documentElement.outerHTML);
                    window.location.hash = "";
                });
            });
        }
    }

    // Normalization method. This method applies the zscore normalization to the data
    zscoreNormalization() {
        let overall_mean = [];
        let overall_std = [];
        // Inicialization
        for (let i = 0; i < this.picturesPool.stuff[0].color_moments.length; i++) {
            overall_mean.push(0);
            overall_std.push(0);
        }
        // Mean computation I
        for (let i = 0; i < this.picturesPool.stuff.length; i++) {
            for (let j = 0; j < this.picturesPool.stuff[0].color_moments.length; j++) {
                overall_mean[j] += this.picturesPool.stuff[i].color_moments[j];
            }
        }

        // Mean computation II
        for (let i = 0; i < this.picturesPool.stuff[0].color_moments.length; i++) {
            overall_mean[i] /= this.picturesPool.stuff.length;
        }

        // STD computation I
        for (let i = 0; i < this.picturesPool.stuff.length; i++) {
            for (let j = 0; j < this.picturesPool.stuff[0].color_moments.length; j++) {
                overall_std[j] += Math.pow((this.picturesPool.stuff[i].color_moments[j] - overall_mean[j]), 2);
            }
        }

        // STD computation II
        for (let i = 0; i < this.picturesPool.stuff[0].color_moments.length; i++) {
            overall_std[i] = Math.sqrt(overall_std[i] / this.picturesPool.stuff.length);
        }

        // zscore normalization
        for (let i = 0; i < this.picturesPool.stuff.length; i++) {
            for (let j = 0; j < this.picturesPool.stuff[0].color_moments.length; j++) {
                this.picturesPool.stuff[i].color_moments[j] = (this.picturesPool.stuff[i].color_moments[j] - overall_mean[j]) / overall_std[j];
            }
        }
    }

    search(search_query, color) {
        this.currentPage = 0;
        let keyword = search_query.trim().split(" ").join("|");
        let regex = RegExp(keyword, "g");
        //Match pictures by keywords and sort them by color
        let results = this.picturesPool.stuff.filter(element => {
            return element.keywords.match(regex) != null;
        });
        //Order results by color dominance
        if (color != "") {
            color = parseInt(color);
            let maxColor = [];
            this.picturesPool.stuff.forEach(function (el) {
                maxColor = maxColor.concat(el.hist);
            });
            maxColor = Math.max(...maxColor);
            results = this.sortByHistogramDistance(color, results);
        }
        this.resultQuery = results;
        return this.loadMore();
    }

    loadMore() {
        var currentPage = this.currentPage;
        var nextPage = this.currentPage + 1;
        this.currentPage++;
        return this.resultQuery.slice(this.itemsPerPage * currentPage, this.itemsPerPage * nextPage)
    }

    // Method to search images based on Image similarities
    searchISimilarity(img1) {
        var results = [];
        //Query the pool with the similarities
        for (let k in this.picturesPool.stuff) {
            var p = this.calcManhattanDist(img1, this.picturesPool.stuff[k]);
            results.push([p, this.picturesPool.stuff[k]]);
        }
        this.currentPage = 0;
        this.resultQuery = this.sortByColorMoments(results).map(function (el) {
            return el[1];
        });
        return this.loadMore();
    }

    // Method to compute the Manhattan difference between 2 images which is one way of measure the similarity
    // between images.
    calcManhattanDist(img1, img2) {
        let manhattan = 0;
        for (let i = 0; i < img1.color_moments.length; i++) {
            for (let x = 0; x < img1.color_moments[i].length; x++) {
                manhattan += Math.abs(img1.color_moments[i][x] - img2.color_moments[i][x]);
            }
        }
        manhattan /= img1.color_moments.length;
        return manhattan;
    }

    // Method to sort images according to the Manhattan distance measure
    sortByHistogramDistance(idx, list) {
        return list.sort(function (a, b) {
            return b.hist[idx] - a.hist[idx];
        });
    }

    //Method to sort images according to the number of pixels of a selected color
    sortByColorMoments(list) {
        return list.sort(function (a, b) {
            return a[0] - b[0];
        });
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
            alert("There is no more space to insert.");
        }
    }

    remove() {
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
            alert("There is no object to remove.");
        }
    }
    
    empty_Pool() {
        while (this.stuff.length > 0) {
            this.remove();
        }
    }
}

