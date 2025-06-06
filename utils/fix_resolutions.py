import os
import cv2
import numpy as np
from dotenv import load_dotenv
from scipy.stats import mode

def load_images(path):
    images = []
    for filename in os.listdir(path):
        image = cv2.imread(os.path.join(path, filename))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        images.append(image)

    return images

def find_shapes_mode(images):
    shapes = []
    for image in images:
        shape = image.shape[:2]
        shapes.append(shape)
    return shapes, mode(shapes)

def fix_resolutions(images, target_size):
    resized_images = []
    for image in images:
        if image.shape[0] != target_size[0] or image.shape[1] != target_size[1]:
            resized_image = cv2.resize(image, target_size[::-1], interpolation=cv2.INTER_LINEAR)
            resized_images.append(resized_image)
        else:
            resized_images.append(image)

    return resized_images


if __name__ == "__main__":
    load_dotenv()
    root = os.getenv("root", ".")
    tiger_name = "K 15 M"

    path = os.path.join(root, "data", tiger_name)
    images = load_images(path)

    shape_mode = find_shapes_mode(images)
    print(f"Most common image shape: {shape_mode[1][0]} with count: {shape_mode[1][1]}")

    resized_images = fix_resolutions(images, shape_mode[1][0])
    for i in range(len(resized_images)):
        print(f"Image {i} shape: {resized_images[i].shape}")