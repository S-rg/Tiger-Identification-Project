import cv2 as cv
from ultralytics import YOLO
import os

def load_yolo_model(model_name):
    root = os.getenv("root")
    model_path = os.path.join(root, "modelling", "models", model_name)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model {model_name} not found at {model_path}")
    
    model = YOLO(model_path)
    return model

def crop_image(image, model, padding):
    results = model(image, verbose=False)
    if not results or not results[0].boxes:
        return []

    boxes = results[0].boxes.xyxy.cpu().numpy()
    if len(boxes) == 0:
        return []

    x1, y1, x2, y2 = boxes[0]
    width = x2 - x1
    height = y2 - y1

    x1 = max(0, int(x1 - padding * width))
    y1 = max(0, int(y1 - padding * height))
    x2 = min(image.shape[1], int(x2 + padding * width))
    y2 = min(image.shape[0], int(y2 + padding * height))

    cropped_image = image[y1:y2, x1:x2]
    return cropped_image

def crop_images(images, model_name = 'yolo8n.pt', padding=0.1):
    model = load_yolo_model(model_name)
    
    cropped_images = []
    for image in images:
        cropped_image = crop_image(image, model, padding)
        cropped_images.append(cropped_image) if len(cropped_image) > 0 else None

    return cropped_images