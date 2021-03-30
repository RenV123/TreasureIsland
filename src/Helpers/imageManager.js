class ImageData {}

export class ImageManager {
  constructor() {
    this._listOfLoadedImages = [];
    this._listOfUrlsToLoad = [];
  }
  loadImage(url) {
    let image = this.findImage(url);
    if (!image) {
      image = new Image();
      image.src = url;
      image.onload = this._onImageLoaded.bind(this);
    }
    return image;
  }

  loadListOfImages(urlList, callback) {
    this._listOfUrlsToLoad = urlList;
    this._imageListCallback = callback;
    this._listOfUrlsToLoad.forEach((url) => {
      this._listOfLoadedImages.push(this.loadImage(url));
    });
  }

  _onImageLoaded(e) {
    let index = this._listOfUrlsToLoad.findIndex((url) => {
      return url == e.target.attributes.src.value;
    });
    this._listOfUrlsToLoad.splice(index, 1);
    if (this._listOfUrlsToLoad == 0) {
      this._imageListCallback();
    }
  }

  findImage(url) {
    return this._listOfLoadedImages.find((img) => {
      return img.attributes.src.value == url;
    });
  }
}
