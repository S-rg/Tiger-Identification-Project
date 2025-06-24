import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt
import os
import sys

root = os.getenv('root')
sys.path.append(root)

from utils.brisque import *
from utils.cropping import crop_images
from utils.fix_resolutions import * 
from utils.plot_wrapper import *

from stripe_extraction.augment import *
from stripe_extraction.denoise import *
from PIL import Image


if __name__ == '__main__':
    tiger_name = 'K 15 M'
    tiger_folder = os.path.join(root, 'data', tiger_name)

    image_paths = [os.path.join(tiger_folder, img) for img in os.listdir(tiger_folder)]
    images = [cv.imread(img_path) for img_path in image_paths]
    images = [cv.cvtColor(img, cv.COLOR_BGR2RGB) for img in images]

    cropped_images = crop_images(images, 'yolov8n.pt', padding=0.1)
    #plot_images(cropped_images, cols = 4)
    
    cropped_images = [Image.fromarray(img) for img in cropped_images]
    augmented_images = augment_images(cropped_images, 5)

    #plot_images(augmented_images, cols = 4)

    denoised_images = denoise_images(augmented_images)
    # plot_images(denoised_images, cols = 4)

    canny_images = [cv.Canny(np.array(img), 150, 250) for img in denoised_images]
    # plot_images(canny_images, cols = 4, cmap='gray')

    results_folder = os.path.join(root, 'stripe_extraction', 'results')
    os.makedirs(results_folder, exist_ok=True)
    for i, img in enumerate(canny_images):
        img_path = os.path.join(results_folder, f'stripe_{i}.png')
        cv.imwrite(img_path, img)