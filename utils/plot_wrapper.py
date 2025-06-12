import matplotlib.pyplot as plt

def plot_image(image, title=None, cmap=None):
    plt.figure(figsize=(10, 10))
    plt.imshow(image, cmap=cmap)
    if title:
        plt.title(title)
    plt.axis('off')
    plt.show()

def plot_images(images, titles=None, cmap=None, cols=2):
    n = len(images)
    nrows = (n + cols - 1) // cols
    plt.figure(figsize=(10 * cols, 10 * nrows))
    for i in range(n):
        try:
            plt.subplot(nrows, cols, i + 1)
            plt.imshow(images[i], cmap=cmap)
            if titles:
                plt.title(titles[i])
            plt.axis('off')
        except:
            continue
    plt.show()