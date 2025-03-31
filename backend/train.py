import os
import pickle
import pandas as pd
from tensorflow.keras.layers import Input, Embedding, Conv1D, MaxPooling1D, Flatten, Dense
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split
from flask import Flask, request, jsonify

# Load and preprocess data
def load_data():
    """Load dataset from CSV file and split into training and testing sets."""
    dataf = pd.read_csv('./datasets/labeled_data.csv')
    trains_text, tests_text, trains_labels, tests_labels = train_test_split(
        dataf['message'],
        dataf['class'],
        test_size=0.2
    )
    return trains_text, tests_text, trains_labels, tests_labels


# Tokenize data
def tokenize_data(trained_text, tested_text):
    """Tokenize text data using Tokenizer from Keras and pad sequences to a fixed length."""
    tokenizer_data = Tokenizer(num_words=5000)
    tokenizer_data.fit_on_texts(trained_text)
    trained_sequences = pad_sequences(tokenizer_data.texts_to_sequences(trained_text), maxlen=100)
    tested_sequences = pad_sequences(tokenizer_data.texts_to_sequences(tested_text), maxlen=100)
    return tokenizer_data, trained_sequences, tested_sequences


# Define the model
def define_model():
    """Define a convolutional neural network model using Keras."""
    input_layer = Input(shape=(100,))
    embedding_layer = Embedding(input_dim=5000, output_dim=50)(input_layer)
    conv_layer = Conv1D(filters=128, kernel_size=5, activation='relu')(embedding_layer)
    pooling_layer = MaxPooling1D(pool_size=5)(conv_layer)
    flatten_layer = Flatten()(pooling_layer)
    output_layer = Dense(units=1, activation='sigmoid')(flatten_layer)
    model_defined = Model(inputs=input_layer, outputs=output_layer)
    model_defined.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model_defined


# Train the model
def train_model(model_training, sequences_training, labels_training, sequences_testing, labels_testing):
    """Train the convolutional neural network model."""
    model_training.fit(
        sequences_training,
        labels_training,
        epochs=10,  # Train for 10 epochs
        batch_size=32,  # Use a reasonable batch size
        validation_data=(sequences_testing, labels_testing)
    )


# Save the model and tokenizer
def save_model(saved_model, tokenizer):
    """Save the trained model and tokenizer to files."""
    # Create the Models directory if it doesn't exist
    if not os.path.exists('Models'):
        os.makedirs('Models')
    
    # Save the model
    saved_model.save('Models/ai_detection_model.h5')
    
    # Save the tokenizer
    with open('Models/tokenizer.pkl', 'wb') as f:
        pickle.dump(tokenizer, f)


# Load the model and tokenizer
def load_saved_model():
    """Load the trained model and tokenizer from files."""
    model = load_model('Models/ai_detection_model.h5')
    with open('Models/tokenizer.pkl', 'rb') as f:
        tokenizer = pickle.load(f)
    return model, tokenizer


# Classify input text
def classify_input(model_classify, tokenizer_classify, text):
    """Classify a text string input as AI or human using the trained model and tokenizer."""
    sequence = pad_sequences(tokenizer_classify.texts_to_sequences([text]), maxlen=100)
    prediction = model_classify.predict(sequence)[0][0]
    return "AI" if prediction > 0.5 else "Human"

def train_and_save_model():
    """Train the model and save it for future use."""
    print("Loading data...")
    train_text, test_text, train_labels, test_labels = load_data()
    
    print("Tokenizing data...")
    tokenizer, train_sequences, test_sequences = tokenize_data(train_text, test_text)
    
    print("Defining model...")
    model = define_model()
    
    print("Training model...")
    train_model(model, train_sequences, train_labels, test_sequences, test_labels)
    
    print("Saving model and tokenizer...")
    save_model(model, tokenizer)
    print("Model and tokenizer saved successfully!")

# Flask app
app = Flask(__name__)

# Load the model and tokenizer when the app starts
try:
    model, tokenizer = load_saved_model()
except FileNotFoundError:
    print("Model or tokenizer not found. Training the model first...")
    train_and_save_model()
    model, tokenizer = load_saved_model()


@app.route('/classify', methods=['POST'])
def classify():
    """API endpoint to classify text as AI or human."""
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    result = classify_input(model, tokenizer, text)
    return jsonify({'text': text, 'classification': result})


# Main function to train and save the model (run only once)


if __name__ == '__main__':
    # Start the Flask app
    app.run(debug=True)

