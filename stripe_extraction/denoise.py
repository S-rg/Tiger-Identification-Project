import cv2 as cv
from skimage.restoration import denoise_tv_chambolle

def denoise_images(images, method = 'median', amount = 15):
    denoised = []

    if method == 'median':
        for img in images:
            denoised.append(cv.medianBlur(img, amount))
        return denoised
    
    if method == 'chambolle':
        for img in images:
            denoised.append(denoise_tv_chambolle(img, weight=amount, channel_axis=-1))
        return denoised