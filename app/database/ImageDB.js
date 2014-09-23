function ImageDB () {
    this.images = {};
    this.imagesOrdered = [];
    
    this.empty = function () {
        this.images = {};
        this.imagesOrdered = [];
    };
    
    this.fakeId = 0;
    
    /**
     * 
     * @param {number} id
     * @returns {Image|Image_Link}
     */
    this.getImage = function (id) {
        if (typeof this.images[id] !== 'undefined') {
            return this.images[id];
        }
        return null;
    };
    
    this.deleteImage = function (id) {
        if (typeof this.images[id] !== 'undefined') {
            this.imagesOrdered.splice(this.imagesOrdered.indexOf(this.images[id]), 1);
            delete this.images[id];
            return true;
        }
        return false;
    };
    
    
    this.updateFromJSON = function (json, clean) {
        if (clean) this.empty();
        for (var i = 0; i < json.length; i++) {
            if (typeof this.images[json[i].id] === 'undefined') {
                if (json[i].id < 0) {
                    this.images[json[i].id] = new Image_Link();
                    this.imagesOrdered.push(this.images[json[i].id]);
                } else {
                    this.images[json[i].id] = new Image();
                    this.imagesOrdered.push(this.images[json[i].id]);
                }
            }
            if (json[i].id < this.fakeId) {
                this.fakeId = json[i].id;
            }
            this.images[json[i].id].updateFromJSON(json[i]);
        }
        
        this.sort();
    };
    
    this.sort = function () {
        console.log("Sorting");
        this.imagesOrdered.sort(function (a,b) {
            console.log(a);
            console.log(b);
            var na = a.name.toUpperCase();
            var nb = b.name.toUpperCase();
            if (na < nb) return -1;
            if (na > nb) return 1;
            return 0;
        });
    };
    
    /**
     * 
     * @param {Image|Image_Link} image
     * @returns {undefined}
     */
    this.addImage = function (image) {
        if (this.images[image.id] !== undefined) {
            this.imagesOrdered.splice(this.imagesOrdered.indexOf(this.images[image.id], 1));
            delete this.images[image.id];
        }
        this.images[image.id] = image;
        this.imagesOrdered.push(image);
        this.sort();
    };
    
    this.getFakeId = function () {
        return --this.fakeId;
    };
    
    this.createLink = function () {
        var image = new Image_Link();
        image.id = this.getFakeId();
        return image;
    };
}