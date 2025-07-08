from flask import Flask, jsonify
import base64
from flask_cors import CORS
from time import sleep

app = Flask(__name__)
CORS(app)

@app.route('/load_database', methods=['POST'])
def load_database():
    return jsonify({"success": True})

@app.route('/identify_tiger', methods=['POST'])
def identify_tiger():
    sleep(0.5) # Processing time

    return jsonify({
        'success': True,
        'matches': [{
            'image_path': "C:/Users/arnav/OneDrive/Desktop/New folder/Tiger-Identification-Project/data/K 1 M/IMG_0073.JPG",
            'stripe_similarity': 85.0,
            'uploaded_stripe_count': 12,
            'database_stripe_count': 15,
            'image': base64.b64encode(open("C:/Users/arnav/OneDrive/Desktop/New folder/Tiger-Identification-Project/data/K 1 M/IMG_0073.JPG", "rb").read()).decode('utf-8'),
            'tiger_name': 'K 1 M'
        },
        {
            'image_path': "C:/Users/arnav/OneDrive/Desktop/New folder/Tiger-Identification-Project/data/K 1 M/IMG_0160.JPG",
            'stripe_similarity': 55.0,
            'uploaded_stripe_count': 10,
            'database_stripe_count': 14,
            'image': base64.b64encode(open("C:/Users/arnav/OneDrive/Desktop/New folder/Tiger-Identification-Project/data/K 1 M/IMG_0160.JPG", "rb").read()).decode('utf-8'),
            'tiger_name': 'K 1 M'
        }]
    })

app.run(debug=True, port=5000, host='0.0.0.0')