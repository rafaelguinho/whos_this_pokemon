export default function drawImage(imageUrl, canvas, ctx, doSilhouette) {
    var image = new Image();
    image.src = imageUrl;

    image.onload = function () {

        var newImgWidth = canvas.width;
        var newImgHeight = image.height * (newImgWidth / image.width);

        canvas.height = newImgHeight;

        var imgX = 0;
        var imgY = 0;

        ctx.drawImage(image, imgX, imgY,
            newImgWidth, newImgHeight
        );

        if (!doSilhouette) return;

        var rawImage = ctx.getImageData(imgX, imgY, newImgWidth, newImgHeight);

        for (var i = 0; i < rawImage.data.length; i += 4) {
            if (rawImage.data[i + 3] >= 100) {
                rawImage.data[i] = 30;
                rawImage.data[i + 1] = 30;
                rawImage.data[i + 2] = 30;
                rawImage.data[i + 3] = 255;
            } else {
                rawImage.data[i + 3] = 0;
            }
        }

        ctx.putImageData(rawImage, imgX, imgY);


    };
}