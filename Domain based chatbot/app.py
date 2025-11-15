from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
from flask_pymongo import PyMongo
import google.generativeai as genai
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId
import logging
from functools import wraps
from pathlib import Path

from ml import WasteClassifier, InvalidImageError, LowConfidenceError, ModelNotReadyError
from ml.waste_classifier import CONFIDENCE_THRESHOLD

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/chatbot"
app.secret_key = os.getenv("SECRET_KEY", "default_secret_key")
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=1)
app.config["SESSION_TYPE"] = "filesystem"
# CORS(app)  
# # Allow frontend to access backend
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})
bcrypt = Bcrypt(app)
mongo = PyMongo(app)

users_collection = mongo.db.users
chats_collection = mongo.db.chats

# Configure Gemini AI API
my_api_key_gemini = os.getenv("GEMINI_API_KEY")
if not my_api_key_gemini:
    raise ValueError("GEMINI_API_KEY environment variable is not set.")
genai.configure(api_key=my_api_key_gemini)

try:
    model = genai.GenerativeModel("gemini-2.0-flash")
    logger.info("Gemini model initialized successfully.")
except Exception as model_error:
    logger.error(f"Model Initialization Error: {model_error}")
    raise RuntimeError("Failed to initialize Gemini AI model.")

waste_classifier = WasteClassifier()
logger.info(f"Waste classifier initialized (mock mode: {waste_classifier.uses_mock})")


@app.after_request
def after_request(response):
    # Add necessary headers for CORS and session
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized access"}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route("/")
def home():
    if "user_id" in session:
        return redirect(url_for("chat"))
    return render_template('login.html')

@app.route("/chat")
def chat():
    if "user_id" not in session:
        return redirect(url_for("home"))
    return render_template("index.html", email=session["email"])

# User Registration
@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")

        # Validation
        if not all([first_name, last_name, email, password, confirm_password]):
            return jsonify({"error": "All fields are required"}), 400

        if password != confirm_password:
            return jsonify({"error": "Passwords don't match"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        user_data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }
        
        user_id = users_collection.insert_one(user_data).inserted_id
        
        # Automatically log in the user after signup
        session["user_id"] = str(user_id)
        session["email"] = email
        session["first_name"] = first_name
        session["last_name"] = last_name
        
        return jsonify({
            "message": "Signup successful",
            "redirect": "/chat"
        }), 201

    except Exception as e:
        logger.error(f"Signup error: {e}")
        return jsonify({"error": "An error occurred during signup"}), 500

# User Login
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        remember_me = data.get("rememberMe", False)

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = users_collection.find_one({"email": email})
        if not user or not bcrypt.check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Set session data
        session["user_id"] = str(user["_id"])
        session["email"] = user["email"]
        session["first_name"] = user.get("first_name", "")
        session["last_name"] = user.get("last_name", "")

        # Set session permanence based on remember me
        session.permanent = remember_me

        return jsonify({
            "message": "Login successful", 
            "redirect": "/chat",
            "user": {
                "email": user["email"],
                "firstName": user.get("first_name", ""),
                "lastName": user.get("last_name", "")
            }
        }), 200

    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"error": "An error occurred during login"}), 500

# User Logout
@app.route("/logout", methods=["POST"])
@login_required
def logout():
    try:
        session.clear()
        return jsonify({"message": "Logged out successfully", "redirect": "/"}), 200
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return jsonify({"error": "An error occurred during logout"}), 500

# Solar system keywords for topic restriction
QUANTUM_COMPUTING_KEYWORDS = [
"quantum computing", "generative AI", "neuromorphic computing", "graphene technology", "biocomputing", "edge AI", "quantum encryption", "5G and 6G", "digital twins", "federated learning"
"blockchain", "decentralized finance (DeFi)", "non-fungible tokens (NFTs)", "smart contracts", "Web3", "zero-knowledge proofs", "metaverse", "augmented reality (AR)", "virtual reality (VR)", "spatial computing"
"CRISPR gene editing", "synthetic biology", "lab-grown meat", "nanomedicine", "personalized medicine", "mRNA vaccines", "brain-computer interface", "bionics", "digital therapeutics", "AI drug discovery"
"fusion energy", "solid-state batteries", "perovskite solar cells", "wireless charging highways", "green hydrogen", "carbon capture technology", "bioenergy with carbon capture (BECCS)", "energy harvesting"
]

def is_solar_system_related(prompt):
    prompt_lower = prompt.lower()
    return any(keyword in prompt_lower for keyword in QUANTUM_COMPUTING_KEYWORDS)

# Chat endpoint
@app.route("/ask", methods=["POST"])
@login_required
def ask():
    try:
        prompt_text = request.json.get("prompt")
        if not prompt_text:
            return jsonify({"error": "No prompt provided"}), 400

        if not is_solar_system_related(prompt_text):
            return jsonify({
                "error": "I'm programmed to answer onlY Technology -related topics."
            }), 400

        # Generate response using Gemini API
        response = model.generate_content(prompt_text)
        answer = response.text.strip() if response.text else "I'm sorry, I couldn't generate a response."

        # Save the chat to MongoDB
        chat_data = {
            "user_id": session["user_id"],
            "question": prompt_text,
            "answer": answer,
            "likes": 0,
            "dislikes": 0,
            "timestamp": datetime.utcnow(),
            "ratings": []
        }
        
        chat_id = chats_collection.insert_one(chat_data).inserted_id
        
        return jsonify({
            "data": answer,
            "chat_id": str(chat_id)
        }), 200

    except Exception as e:
        logger.error(f"Ask error: {e}")
        return jsonify({"error": "Failed to process your request"}), 500

# Chat history operations
@app.route("/get_chat_history", methods=["GET"])
@login_required
def get_chat_history():
    try:
        chats = list(chats_collection.find(
            {"user_id": session["user_id"]},
            {"_id": 1, "question": 1, "timestamp": 1}
        ).sort("timestamp", -1).limit(50))
        
        # Convert ObjectId and datetime to strings
        for chat in chats:
            chat["_id"] = str(chat["_id"])
            chat["timestamp"] = chat["timestamp"].isoformat()
        
        return jsonify({"chat_history": chats}), 200
    except Exception as e:
        logger.error(f"Chat history error: {e}")
        return jsonify({"error": "Failed to fetch chat history"}), 500

@app.route("/delete_chat/<chat_id>", methods=["DELETE"])
@login_required
def delete_chat(chat_id):
    try:
        result = chats_collection.delete_one({
            "_id": ObjectId(chat_id),
            "user_id": session["user_id"]
        })
        
        if result.deleted_count == 0:
            return jsonify({"error": "Chat not found or not authorized"}), 404
            
        return jsonify({"message": "Chat deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Delete chat error: {e}")
        return jsonify({"error": "Failed to delete chat"}), 500

@app.route("/delete_chat_history", methods=["DELETE"])
@login_required
def delete_chat_history():
    try:
        chats_collection.delete_many({"user_id": session["user_id"]})
        return jsonify({"message": "Chat history cleared successfully"}), 200
    except Exception as e:
        logger.error(f"Clear history error: {e}")
        return jsonify({"error": "Failed to clear chat history"}), 500

# Rating system
@app.route("/rate_chat/<chat_id>", methods=["POST"])
@login_required
def rate_chat(chat_id):
    try:
        data = request.json
        action = data.get("action")  # "like" or "dislike"

        if action not in ["like", "dislike"]:
            return jsonify({"error": "Invalid action"}), 400

        # Check if user already rated this chat
        existing_rating = chats_collection.find_one({
            "_id": ObjectId(chat_id),
            "ratings.user_id": session["user_id"]
        })

        if existing_rating:
            return jsonify({"error": "You've already rated this chat"}), 400

        # Update rating
        update_field = "likes" if action == "like" else "dislikes"
        chats_collection.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$inc": {update_field: 1},
                "$push": {
                    "ratings": {
                        "user_id": session["user_id"],
                        "action": action,
                        "timestamp": datetime.utcnow()
                    }
                }
            }
        )
        
        return jsonify({"message": f"Chat {action}d successfully"}), 200
    except Exception as e:
        logger.error(f"Rating error: {e}")
        return jsonify({"error": "Failed to process rating"}), 500

# User profile
@app.route("/profile", methods=["GET"])
@login_required
def get_profile():
    try:
        user = users_collection.find_one(
            {"_id": ObjectId(session["user_id"])},
            {"password": 0}  # Exclude password
        )
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        user["_id"] = str(user["_id"])
        return jsonify({"user": user}), 200
    except Exception as e:
        logger.error(f"Profile error: {e}")
        return jsonify({"error": "Failed to fetch profile"}), 500

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024

def validate_uploaded_file(file):
    """Validate uploaded image file."""
    if not file:
        raise ValueError("No file uploaded")
    
    if not file.filename:
        raise ValueError("Empty filename")
    
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValueError(
            f"Invalid file format: {file_ext}. Allowed: {', '.join(sorted(ALLOWED_IMAGE_EXTENSIONS))}"
        )
    
    file.seek(0, 2)
    file_size = file.tell()
    file.seek(0)
    
    if file_size == 0:
        raise ValueError("Empty file")
    
    if file_size > MAX_FILE_SIZE:
        raise ValueError(f"File too large: {file_size / (1024*1024):.2f}MB (max: 10MB)")

@app.route("/api/classify", methods=["POST"])
def classify_waste():
    """Classify waste from uploaded image."""
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided in request"}), 400
        
        file = request.files["image"]
        
        try:
            validate_uploaded_file(file)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        
        filename = secure_filename(file.filename)
        image_bytes = file.read()
        
        try:
            result = waste_classifier.classify(image_bytes, filename=filename)
            return jsonify(result), 200
        
        except InvalidImageError as e:
            logger.warning(f"Invalid image: {e}")
            return jsonify({"error": f"Invalid image: {str(e)}"}), 400
        
        except LowConfidenceError as e:
            logger.info(f"Low confidence prediction: {e}")
            return jsonify({
                "error": "Low confidence prediction",
                "message": str(e),
                "confidence": getattr(e, "confidence", None),
                "threshold": CONFIDENCE_THRESHOLD,
                "suggestion": "Try uploading a clearer image with better lighting"
            }), 422
        
        except ModelNotReadyError as e:
            logger.error(f"Model not ready: {e}")
            return jsonify({"error": "Classification service unavailable"}), 503
    
    except Exception as e:
        logger.error(f"Classification error: {e}", exc_info=True)
        return jsonify({"error": "Failed to process image"}), 500

@app.route("/api/classify/test", methods=["POST", "GET"])
def test_classify():
    """Test classification endpoint with mock prediction or sample image."""
    try:
        if request.method == "POST" and "image" in request.files:
            file = request.files["image"]
            try:
                validate_uploaded_file(file)
                filename = secure_filename(file.filename)
                image_bytes = file.read()
                result = waste_classifier.classify(image_bytes, filename=filename, augment=True)
                result["test_mode"] = True
                return jsonify(result), 200
            except ValueError as e:
                return jsonify({"error": str(e)}), 400
            except (InvalidImageError, LowConfidenceError) as e:
                return jsonify({"error": str(e)}), 400
            except ModelNotReadyError as e:
                return jsonify({"error": str(e)}), 503
        
        result = waste_classifier.generate_mock_result()
        result["test_mode"] = True
        result["note"] = "Mock classification result for testing"
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Test classification error: {e}", exc_info=True)
        return jsonify({"error": "Test endpoint failed"}), 500

@app.route("/api/classify/status", methods=["GET"])
def classifier_status():
    """Get classifier service status."""
    return jsonify({
        "status": "ready" if waste_classifier.is_ready() else "not_ready",
        "model_loaded_at": waste_classifier.model_loaded_at.isoformat() if waste_classifier.model_loaded_at else None,
        "mock_mode": waste_classifier.uses_mock,
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "categories": waste_classifier.categories,
        "max_file_size_mb": MAX_FILE_SIZE / (1024 * 1024),
        "allowed_formats": sorted(ALLOWED_IMAGE_EXTENSIONS)
    }), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)