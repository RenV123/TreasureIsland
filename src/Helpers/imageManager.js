class ImageData {}

/**
 * A simple image loading class, that keeps references to a list of Images.
 */
export class ImageManager {
  constructor() {
    this._listOfLoadedImages = [];
    this._listOfUrlsToLoad = [];
  }

  /**
   * Start loading an image.
   * @param {String} url url/path to the image to load.
   * @returns The Image (Will still be loading if it's not loaded before!).
   * Will return a fully loaded image if it was loaded before.
   */
  loadImage = (url) => {
    let image = this._findImage(url);
    if (!image) {
      image = new Image();
      image.src = url;
      image.onload = this._onImageLoaded.bind(this);
    }
    return image;
  };

  /**
   * @returns true if the manager is not loading images.
   */
  isFinishedLoadingImages = () => {
    return this._listOfUrlsToLoad.length == 0;
  };

  /**
   * Loads a list of images.
   * @param {Array.<String>} urlList a list of urls of images to load
   * @param {Any} callback executed when all images in the list are loaded.
   * @returns true if it can start loading images.
   * Will return false if called while the image manager is still loading images!
   */
  loadListOfImages = (urlList, callback) => {
    if (this.isFinishedLoadingImages()) {
      this._listOfUrlsToLoad = urlList;
      this._imageListCallback = callback;
      this._listOfUrlsToLoad.forEach((url) => {
        this._listOfLoadedImages.push(this.loadImage(url));
      });
      return true;
    }
    return false;
  };

  /**
   * Called when an image is loaded into memory.
   * @access private
   * @param {Event} e
   */
  _onImageLoaded = (e) => {
    let index = this._listOfUrlsToLoad.findIndex((url) => {
      return url == e.target.attributes.src.value;
    });
    if (index != -1) {
      this._listOfUrlsToLoad.splice(index, 1);
      if (this.isFinishedLoadingImages()) {
        this._imageListCallback();
      }
    }
  };

  /**
   * Find an image in the list of loaded images by url
   * @access private
   * @param {String} url the url/path of the image
   * @returns the image (if found).
   */
  _findImage = (url) => {
    return this._listOfLoadedImages.find((img) => {
      return img.attributes.src.value == url;
    });
  };
}
