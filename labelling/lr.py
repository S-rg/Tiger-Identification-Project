import os
import cv2 as cv
import matplotlib.pyplot as plt

data = os.path.join(os.getenv('root'), 'data')

results = []
folders = [f for f in os.listdir(data) if os.path.isdir(os.path.join(data, f))]
files = []
for f in folders:
    for img in os.listdir(os.path.join(data, f)):
        files.append(os.path.join(data, f, img))
        print(img)

i = 0

def on_key(event):
    global i
    if event.key == 'left':
        results.append((files[i], 'left'))
        i += 1
        plt.close()
    elif event.key == 'right':
        results.append((files[i], 'right'))
        i += 1
        plt.close()
    else:
        print(f"Ignored key: {event.key}")

while i < len(files):
    img_path = files[i]
    img = cv.imread(img_path)
    img = cv.cvtColor(img, cv.COLOR_BGR2RGB)
    
    fig, ax = plt.subplots()
    ax.imshow(img)
    ax.set_title(f'Image {i + 1}/{len(files) }')
    fig.canvas.mpl_connect('key_press_event', on_key)
    plt.show()

with open(os.path.join(data,'flank.txt'), 'w') as f:
    for path, direction in results:
        f.write(f"{path},{direction}\n")