class ImageData {}

export class ImageManager {
  _listOfLoadedImages = [];

  constructor() {}
  loadImage(url) {
    let image = this.findImage(url);
    if (!image) {
      image = new Image();
      image.src = url;
      this._listOfLoadedImages.push(image);
    }
    return image;
  }
  findImage(url) {
    return this._listOfLoadedImages.find((img) => {
      return img.attributes.src.value == url;
    });
  }
}
