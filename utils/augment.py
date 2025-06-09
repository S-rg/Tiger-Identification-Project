import torchvision.transforms as transforms
import numpy as np
import cv2 as cv

def augment_images(images, transformations_per_image, rot_range = 0.15, brightness_=0.3, contrast_=0.3, saturation_=0.3, hue_=0.05):
    transform = transforms.Compose([
        transforms.RandomRotation(rot_range),
        transforms.ColorJitter(
            brightness=brightness_, 
            contrast=contrast_, 
            saturation=saturation_, 
            hue=hue_)
    ])

    transformed_images = []

    for i, image in enumerate(images):
        for j in range(transformations_per_image):
            transformed_image = transform(image)
            transformed_image = np.array(transformed_image)
            transformed_image = cv.cvtColor(transformed_image, cv.COLOR_RGB2BGR)
            transformed_images.append(transformed_image)