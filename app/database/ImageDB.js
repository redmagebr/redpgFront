/**
 * 
 * @param {Application} app
 * @returns {ImageDB}
 */
function ImageDB (app) {
    this.app = app;
    
    this.storageId = 'images';
    
    this.$trigger = $('#pictureTrigger');
    
    this.images = {};
    this.imagesOrdered = [];
    this.changedStorage = false;
    
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
            if (json[i].id === undefined) json[i].id = json[i].uuid;
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
        this.$trigger.trigger('loaded').off('loaded');
    };
    
    this.sort = function () {
        this.imagesOrdered.sort(function (a,b) {
            var fa = a.folder.toUpperCase();
            var fb = b.folder.toUpperCase();
            if (fa < fb) return -1;
            if (fa > fb) return 1;
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
    
    this.updateStorage = function (cbs, cbe) {
        this.app.storageapp.updateStorage(this.storageId, cbs, cbe);
    };
    
    this.saveStorage = function (cbs, cbe) {
        this.app.storageapp.sendStorage(this.storageId, cbs, cbe);
    };
    
    this.saveToStorage = function () {
        var fakeImages = [];
        //var attr = ['id', 'name', 'url', 'folder'];
        for (var id in this.images) {
            if (!(parseInt(id) < 0)) continue;
            fakeImages.push({
                id : this.images[id].id,
                name : this.images[id].name,
                url : this.images[id].url,
                folder : this.images[id].folder
            });
        }
        this.app.storage.store(this.storageId, fakeImages);
    };
    
    /**
     * Storage Requester Interface
     */
    
    /**
     * 
     * @returns {undefined}
     */
    this.storageChanged = function () {
        for (var id in this.images) {
            if (isNaN(id, 10) || parseInt(id) > 0) continue;
            console.log("Deleting " + id);
            this.deleteImage(id);
        }
        this.updateFromJSON(this.app.storage.get(this.storageId));
        this.changedStorage = true;
    };
    
    this.storageDefault = function () {
        return [];
    };
    
    this.storageValidation = function (list) {
        if (!(list instanceof Array)) return false;
        var attr = ['id', 'name', 'url', 'folder'];
        var types = ['number', 'string', 'string', 'string'];
        for (var i = 0; i < list.length; i++) {
            if (typeof list[i] !== 'object') return false;
            for (var id in list[i]) {
                if (attr.indexOf(id) === -1) return false;
                if (typeof list[i][id] !== types[attr.indexOf(id)]) return false;
            }
        }
        return true;
    };
    
    /**
     * Register itself as storage
     */
    this.app.storage.registerStorage(this.storageId, this);
}