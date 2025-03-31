import os
import mysql.connector
from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from plagiarism import check_plagiarism
from file_handler import save_uploaded_files
#from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import tensorflow as tf
import jwt  
import datetime
from functools import wraps


app = Flask(__name__)
CORS(app)  
SECRET_KEY = "pa123"

BASE_UPLOAD_FOLDER = "storage"
app.config["UPLOAD_FOLDER"] = BASE_UPLOAD_FOLDER 

MODEL_PATH = "Models/ai_detection_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")


model = tf.keras.models.load_model(MODEL_PATH)

TOKENIZER_PATH = "Models/tokenizer.pkl"
with open(TOKENIZER_PATH, "rb") as handle:
    tokenizer = pickle.load(handle)

MAX_SEQUENCE_LENGTH = 100  

def get_db_connection():
    return mysql.connector.connect(
        host="localhost", user="root", password="ROOT", database="plagiarism_db"
    )


def get_classroom_folder(classroom_name):
    """Returns the folder path for the selected classroom, creating it if necessary."""
    classroom_folder = os.path.join(BASE_UPLOAD_FOLDER, classroom_name)
    os.makedirs(classroom_folder, exist_ok=True)
    return classroom_folder

# ========================= USER REGISTRATION =========================

@app.route("/register", methods=["POST"])
def register_user():
    """API to register a new user (student or teacher)"""
    data = request.json
    name = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student") 

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    hashed_password = generate_password_hash(password)  
    print("🔹 Debug: Hashed Password Before Storing:", hashed_password)  

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
            (name, email, hashed_password, role),
        )

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": f"{role.capitalize()} registered successfully"}), 201

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


@app.route("/login", methods=["POST"])
def login():
    """API to authenticate a user and return JWT"""
    data = request.json
    email = data.get("email").strip().lower()
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(%s)", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        stored_password_hash = user["password"]

        if check_password_hash(stored_password_hash, password):

            token_payload = {
                "user_id": user["id"],
                "role": user["role"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)  
            }
            token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

            return jsonify({
                "message": "Login successful",
                "token": token,
                "user_id": user["id"],
                "role": user["role"]
            }), 200
        
        return jsonify({"error": "Invalid password"}), 401  

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    
def authenticate_user(f):

    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            decoded = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            request.user = decoded  
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated_function
# ========================= CLASSROOM MANAGEMENT (Only for Teachers) =========================

@app.route("/create-classroom", methods=["POST"])
@authenticate_user 
def create_classroom():
    """Allow only teachers to create classrooms"""
    data = request.json
    classroom_name = data.get("classroom_name")

    if request.user["role"] != "teacher":
        return jsonify({"error": "Access denied"}), 403  

    if not classroom_name:
        return jsonify({"error": "Classroom name is required"}), 400
     
    classroom_folder = get_classroom_folder(classroom_name)

    try:
        teacher_id = request.user["user_id"]  

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO classrooms (classroom_name, teacher_id) VALUES (%s, %s)",
            (classroom_name, teacher_id),
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": f"Classroom '{classroom_name}' created!", "folder": classroom_folder}), 201

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


@app.route("/get-classrooms", methods=["GET"])
@authenticate_user 
def get_classrooms():
    """Fetch only classrooms created by the logged-in teacher"""
    
    if request.user["role"] != "teacher":
        return jsonify({"error": "Access denied"}), 403  

    try:
        teacher_id = request.user["user_id"] 

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT classroom_name FROM classrooms WHERE teacher_id = %s", (teacher_id,)
        )
        classrooms = [row["classroom_name"] for row in cursor.fetchall()]
        cursor.close()
        conn.close()

        return jsonify({"classrooms": classrooms}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500



@app.route("/get-classroom-details/<string:classroom_name>", methods=["GET"])
def get_classroom_details(classroom_name):
    """API to fetch details of a specific classroom"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM classrooms WHERE name = %s", (classroom_name,))
    classroom = cursor.fetchone()
    
    if not classroom:
        return jsonify({"error": "Classroom not found"}), 404

    # Get student count
    cursor.execute("SELECT COUNT(*) AS student_count FROM students WHERE classroom_name = %s", (classroom_name,))
    student_count = cursor.fetchone()["student_count"]

    # Get submission count
    cursor.execute("SELECT COUNT(*) AS submission_count FROM submissions WHERE classroom_name = %s", (classroom_name,))
    submission_count = cursor.fetchone()["submission_count"]

    cursor.close()
    conn.close()

    return jsonify({
        "classroom": classroom_name,
        "students": student_count,
        "submissions": submission_count,
        "status": "Active"
    })


@app.route("/upload-files", methods=["POST"])
def upload_files():
    """API to upload student files into the classroom folder"""
    classroom = request.form.get("classroom")
    roll_no = request.form.get("roll_no")
    
    if not classroom or not roll_no:
        return jsonify({"error": "Classroom and roll number are required"}), 400

    classroom_folder = get_classroom_folder(classroom)

    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No file uploaded"}), 400

    save_uploaded_files(files, classroom_folder, roll_no)


    result = check_plagiarism(classroom_folder)

    return jsonify({
        "message": f"Files uploaded successfully for Roll No {roll_no} in {classroom}",
        "results": result
    })

UPLOAD_FOLDER = "storage"  
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/check-plagiarism/<classroom_name>", methods=["GET"])
def check_classroom_plagiarism(classroom_name):
    if not classroom_name:
        return jsonify({"error": "Classroom name is required"}), 400

    folder_path = os.path.join(app.config["UPLOAD_FOLDER"], classroom_name)

    if not os.path.exists(folder_path):
        return jsonify({"error": "Classroom folder not found"}), 404

    results = check_plagiarism(folder_path)
    
    return jsonify({"results": results})

# @app.route("/classify-text/<classroom_name>", methods=["GET"])
# def classify_classroom_text(classroom_name):
#     import os

#     if not classroom_name:
#         print(" Error: Classroom name is missing")
#         return jsonify({"error": "Classroom name is required"}), 400

#     folder_path = os.path.join(app.config["UPLOAD_FOLDER"], classroom_name)
    
#     # Debug print statements
#     print(f" Checking folder path: {folder_path}")
#     if not os.path.exists(folder_path):
#         print("Error: Folder does not exist")
#         return jsonify({"error": "Classroom folder not found"}), 404

#     texts = []
#     filenames = []

#     # Debug: List all files in the directory
#     print(f" Files in {classroom_name}: {os.listdir(folder_path)}")

#     for filename in os.listdir(folder_path):
#         if filename.endswith(".txt") or filename.endswith(".docx") or filename.endswith(".c"):
#             file_path = os.path.join(folder_path, filename)
#             print(f" Found text file: {file_path}")
#             with open(file_path, "r", encoding="utf-8") as file:
#                 texts.append(file.read())
#                 filenames.append(filename)

#     if not texts:
#         print("Error: No text files found in the folder")
#         return jsonify({"error": "No text files found in the classroom folder"}), 404

#     # Tokenize and pad the texts
#     sequences = tokenizer.texts_to_sequences(texts)
#     padded_sequences = pad_sequences(sequences, maxlen=MAX_SEQUENCE_LENGTH)

#     # Make predictions
#     predictions = model.predict(padded_sequences)

#     results = [
#         {"filename": filename, "classification": "AI-Generated" if pred > 0.5 else "Human-Written"}
#         for filename, pred in zip(filenames, predictions)
#     ]

#     return jsonify({"results": results})

@app.route("/classify-text/<classroom_name>", methods=["GET"])
def classify_classroom_text(classroom_name):
    import os

    if not classroom_name:
        print("Error: Classroom name is missing")
        return jsonify({"error": "Classroom name is required"}), 400

    folder_path = os.path.join(app.config["UPLOAD_FOLDER"], classroom_name)

    print(f" Checking folder path: {folder_path}")
    if not os.path.exists(folder_path):
        print(" Error: Folder does not exist")
        return jsonify({"error": "Classroom folder not found"}), 404

    texts = []
    filenames = []

    print(f"Files in {classroom_name}: {os.listdir(folder_path)}")

    for filename in os.listdir(folder_path):
        if filename.endswith(".txt") or filename.endswith(".docx") or filename.endswith(".c"):
            file_path = os.path.join(folder_path, filename)
            print(f"Found text file: {file_path}")
            with open(file_path, "r", encoding="utf-8") as file:
                texts.append(file.read())
                filenames.append(filename)

    if not texts:
        print(" Error: No text files found in the folder")
        return jsonify({"error": "No text files found in the classroom folder"}), 404

    sequences = tokenizer.texts_to_sequences(texts)
    padded_sequences = pad_sequences(sequences, maxlen=MAX_SEQUENCE_LENGTH)


    predictions = model.predict(padded_sequences)

    results = []
    
    for filename, pred in zip(filenames, predictions):
        pred_value = float(pred)

        adjusted_pred = max(pred_value, 0.01)  

        ai_generated_percentage = round(adjusted_pred * 100, 2)

        results.append({
            "filename": filename,
            "percentage": ai_generated_percentage,
            "classification": "AI-Generated" if pred_value > 0.5 else "Human-Written"
        })

    return jsonify({"results": results})



@app.route("/get-file-content", methods=["GET"])
def get_file_content():
    classroom = request.args.get("classroom")  
    filename = request.args.get("filename")  

    if not classroom or not filename:
        return jsonify({"error": "Both 'classroom' and 'filename' are required"}), 400

    file_path = os.path.join(BASE_UPLOAD_FOLDER, classroom, filename)

    if not os.path.exists(file_path):
        return jsonify({"error": f"File '{filename}' not found in '{classroom}'"}), 404

    try:
        return send_file(file_path, as_attachment=False)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
