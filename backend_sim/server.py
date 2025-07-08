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
    #sleep(0.5) # Processing time

    return jsonify({
        'success': True,
        'matches': [{
            'image_path': "C:/Users/arnav/OneDrive/Desktop/New folder/Tiger-Identification-Project/data/K 1 M/IMG_0073.JPG",
            'stripe_similarity': 85.0,
            'uploaded_stripe_count': 12,
            'database_stripe_count': 15
        },
        {
            'image_path': "C:/Users/arnav/OneDrive/Desktop/New folder/Tiger-Identification-Project/data/K 1 M/IMG_0160.JPG",
            'stripe_similarity': 75.0,
            'uploaded_stripe_count': 10,
            'database_stripe_count': 14
        }]
    })

app.run(debug=True, port=5000, host='0.0.0.0')