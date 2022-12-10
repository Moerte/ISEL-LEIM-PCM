// Declaring globals 
var app = new ISearchEngine("xml/Image_database.xml");
var noResults = "<span class='search-no-results'><p>Your search criteria didn't match any results.</p></span>"
let infiniteScroll = false;

// Main function
function main() {
    let canvas = document.querySelector("canvas");
    let imageBlob;
    app.init(canvas);
    window.location.hash = "";

    let search_inputs = Array.prototype.slice.call(document.getElementsByClassName("search_input"))
    search_inputs.forEach(el => {
        el.addEventListener("input", function (e) {
            document.getElementById("search_input").value = e.target.value;
            search_inputs.forEach(function (el) {
                el.value = document.getElementById("search_input").value;
            });
        });

        el.addEventListener("keydown", e => {
            if (e.keyCode == 13) {
                document.querySelector(".search_submit").click();
            }
        });
    });

    let search_submits = Array.prototype.slice.call(document.getElementsByClassName("search_submit"))
    search_submits.forEach(el => {
        el.addEventListener("click", e => {
            if (document.querySelector(".search-box-input-with-image")) {
                var cnv = document.querySelector("canvas");
                var ch = new ColorHistogram(app.redColor, app.greenColor, app.blueColor);
                var cn = new ColorMoments()
                var ev = new Event("processed_picture")
                var p = new Picture(0, 0, 0, 0, document.querySelector(".search-box-input-image img").src, "", false)
                p.computation(cnv, ch, cn, ev).then(data => {
                    let results = app.searchISimilarity(p)
                    e.preventDefault();
                    document.querySelector(".search-results").innerHTML = `<span class="search-load-more">
                        <div></div>
                        <div></div>
                        <div></div>
                    </span>`;
                    paintResults(results)
                });
                return;
            }
            refreshSearch(e);
        });
    });
    let search_images_file = Array.prototype.slice.call(document.getElementsByClassName("choose_image"))
    search_images_file.forEach(el => {
        el.addEventListener("click", e => {
            document.getElementById("search_image").click()
        });
    });

    //Image research removal 
    let close_images = Array.prototype.slice.call(document.getElementsByClassName("search-box-input-image-close"))
    close_images.forEach(el => {
        el.addEventListener("click", e => {
            let search_images = Array.prototype.slice.call(document.getElementsByClassName("search-box-input-with-image"))
            search_images.forEach(el => {
                el.classList.remove("search-box-input-with-image")
                if (document.getElementById("search_input").value == "") {
                    window.location.hash = "";
                }
            });
        });
    });

    //Simple Infinite scroll
    var scrollTreshold = 400          //px
    window.addEventListener("scroll", e => {
        let scroll = document.body.getClientRects()[0].top;
        let height = document.body.getClientRects()[0].height - window.innerHeight;
        if (Math.abs(scroll + height) <= scrollTreshold && infiniteScroll == false) {
            infiniteScroll = true;
            let images = app.loadMore();
            if (images.length > 0) {
                paintResults(images)
            }
        }
    });

    //Routing
    window.addEventListener("hashchange", () => {
        if (this.window.location.hash == "#/results") {
            this.document.body.classList.add("page-results");
        } else if (this.window.location.hash == "#/loading") {
            this.document.body.classList.add("page-loading");
        } else {
            this.document.body.classList.remove("page-results");
            this.document.body.classList.remove("page-loading");
        }
    });

    //Construct the color list filter 
    const colors = app.hexColor.map((e, idx) => {
        //map colors to span elements
        idx = idx - 1; //transparent is not a color on the histogram graph
        return `<span data-color-idx="${idx}" data-color="${e}" style="background-color:${e}" class="color-search-item"></span>`
    }).join("");

    Array.prototype.slice.call(document.querySelectorAll(".color-search")).forEach(el => {
        //Add event listeners and replicate between "Pages"
        el.addEventListener("click", e => {
            if (e.target.classList.contains("color-search-item")) {

                //Propagate the selection for all stuff
                if (document.querySelector(".hide-if-results .color-search-item-selected")) {
                    document.querySelector(".hide-if-results .color-search-item-selected").classList.remove("color-search-item-selected")
                }

                if (document.querySelector(".show-if-results .color-search-item-selected")) {
                    document.querySelector(".show-if-results .color-search-item-selected").classList.remove("color-search-item-selected")
                }

                document.querySelector(`.show-if-results [data-color="${e.target.dataset.color}"]`).classList.add("color-search-item-selected");

                //Set the value
                document.querySelector("#search_color").value = e.target.dataset.colorIdx;
                if (e.target.dataset.colorIdx === "-1") {
                    document.querySelector("#search_color").value = "";

                } else {
                    document.querySelector("#search_color").value = e.target.dataset.colorIdx;

                }
            }
            refreshSearch(e);
        });
        el.innerHTML = colors;
    });

    document.body.addEventListener("dragover", e => {
        e.preventDefault();
    });

    document.body.addEventListener("dragstart", e => {
        let dragImage;
        if (dragImage == undefined) {
            dragImage = e.target.src;
        }
        loadXHR(dragImage).then(blob => {
            imageBlob = blob;
        });
    });

    document.body.addEventListener("drop", ev => {
        ev.preventDefault();
        var file = ev.dataTransfer.files[0];
        if (file != undefined) searchByImage(file);
        searchByBlob(imageBlob);
    });

    document.getElementById("search_image").addEventListener("change", ev => {
        var file = ev.target.files[0]
        searchByImage(file);
    });
}

function loadXHR(url) {

    return new Promise((resolve, reject) => {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onerror = () => { reject("Network error.") };
            xhr.onload = () => {
                if (xhr.status === 200) { resolve(xhr.response) }
                else { reject("Loading error:" + xhr.statusText) }
            };
            xhr.send();
        }
        catch (err) { reject(err.message) }
    });
}

function searchByBlob(file) {
    document.querySelector('.page-search .loading-animation').style.display = 'flex';
    var image = new Image();
    image.file = file;
    const reader = new FileReader();
    reader.onload = e => {
        image.src = e.target.result;

        Array.prototype.slice.call(document.querySelectorAll('.search-box-input')).forEach(el => {
            el.classList.add('search-box-input-with-image');
        });

        Array.prototype.slice.call(document.querySelectorAll('.search-box-input-image')).forEach(el => {
            el.querySelector('img').src = image.src;
            el.querySelector('p').textContent = image.file.name;
        });

        var cnv = document.querySelector('canvas');
        var ch = new ColorHistogram(app.redColor, app.greenColor, app.blueColor);
        var cn = new ColorMoments();
        var ev = new Event('processed_picture');

        var p = new Picture(0, 0, 0, 0, image.src, '', false);

        p.computation(cnv, ch, cn, ev).then(() => {
            let results = app.searchISimilarity(p);

            document.querySelector('.search-results').innerHTML = `<span class="search-load-more">
                <div></div>
                <div></div>
                <div></div>
                </span>`;
            paintResults(results);
            document.querySelector('.page-search .loading-animation').style.display = 'none';
            window.location.hash = '#/results';
        });
    };
    reader.readAsDataURL(file);
}

function searchByImage(file) {
    document.querySelector(".page-search .loading-animation").style.display = "flex";
    var image = new Image();
    image.file = file
    if (file.type.match("image")) {
        const reader = new FileReader();
        reader.onload = e => {

            image.src = e.target.result;

            Array.prototype.slice.call(document.querySelectorAll(".search-box-input")).forEach(el => {
                el.classList.add("search-box-input-with-image");
            });

            Array.prototype.slice.call(document.querySelectorAll(".search-box-input-image")).forEach(el => {
                el.querySelector("img").src = image.src;
                el.querySelector("p").textContent = image.file.name;
            });

            var cnv = document.querySelector("canvas");
            var ch = new ColorHistogram(app.redColor, app.greenColor, app.blueColor);
            var cn = new ColorMoments()
            var ev = new Event("processed_picture")

            var p = new Picture(0, 0, 0, 0, image.src, "", false)

            p.computation(cnv, ch, cn, ev).then(() => {
                let results = app.searchISimilarity(p)

                document.querySelector(".search-results").innerHTML = `<span class="search-load-more">
                <div></div>
                <div></div>
                <div></div>
                </span>`;
                paintResults(results)
                document.querySelector(".page-search .loading-animation").style.display = "none";
                window.location.hash = "#/results"
            });
        };
        reader.readAsDataURL(file);
    } else {
        console.log("this is not an image")
    }
}

function toggledDarkMode() {
    if (document.querySelector("body").dataset.mode == "dark") {
        document.querySelector("body").dataset.mode = "light"
    } else {
        document.querySelector("body").dataset.mode = "dark"
    }
}

function onImageLoaded(event) {
    let marginTop = 0
    if (event.target.getClientRects().length > 0) {
        marginTop = (-1 * (event.target.getClientRects()[0].height - 220) / 2 || 0)
    }
    event.target.style.marginTop = marginTop + "px"
    event.target.classList.add("image-loaded")
    event.target.style.animationDelay = 50 * event.target.dataset.idx + "ms"
}

//Function to make the image list on the results page
function paintResults(results,) {
    window.location.hash = "#/results";
    results.forEach((element, idx) => {
        let searchItem = `<div class="search-result">
                        <div class="search-result-image" style="background-color:${element.dominantColor};">
                        <img data-idx="${idx}"onload="onImageLoaded(event)"class="search-result-image-content" src="${element.impath}"></img>
                        </div>
                        <div class="search-result-meta">
                            <p>${element.title}</p>
                            <span class="search-result-meta-color" style="background-color: ${element.dominantColor};"></span>
                            <span class="search-result-meta-width">
                            ${element.imgobj.width} &#10005 ${element.imgobj.height} pixels
                            </span>
                        </div>
                    </div>`;
        document.querySelector(".search-load-more").insertAdjacentHTML("beforebegin", searchItem);
    });

    if (results.length == 0) {
        document.querySelector(".search-load-more").insertAdjacentHTML("beforebegin", noResults);
    }

    if (results.length < app.itemsPerPage) {
        this.document.querySelector(".search-load-more").remove();
    }
    infiniteScroll = false;
}

function refreshSearch(e) {
    let query = document.getElementById("search_input").value
    let color = document.getElementById("search_color").value
    if (query != "") {

        window.location.hash = "#/results";
        let results = app.search(query, color)
        e.preventDefault();
        document.querySelector(".search-results").innerHTML = `<span class="search-load-more">
                <div></div>
                <div></div>
                <div></div>
            </span>`;
        paintResults(results)
    }
}

