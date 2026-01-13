import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz

# def read_file(file_path):
#     """Read file contents."""
#     try:
#         with open(file_path, "r", encoding="utf-8") as file:
#             return file.read()
#     except:
#         return None

def read_file(file_path):
    """Read contents of any text-based file. Convert PDF to text if needed."""
    try:
        ext = os.path.splitext(file_path)[1].lower()

        if ext == ".pdf":
            text = ""
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
            return text
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
                return file.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def vectorize(content_list):
    """Vectorize text contents."""
    return TfidfVectorizer().fit_transform(content_list).toarray()

def check_plagiarism(folder_path):
    """Compare all files in a given folder."""
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    file_contents = [(file, read_file(os.path.join(folder_path, file))) for file in files]

    # Filter out None values and keep only valid files
    valid_files = [file for file, content in file_contents if content is not None]
    valid_contents = [content for _, content in file_contents if content is not None]

    # If no valid files remain, return empty results
    if not valid_contents:
        return []

    vectors = vectorize(valid_contents)
    results = []

    for i in range(len(valid_files)):
        for j in range(i + 1, len(valid_files)):
            sim_score = cosine_similarity([vectors[i]], [vectors[j]])[0][0]
            results.append({"file1": valid_files[i], "file2": valid_files[j], "similarity": round(sim_score, 2)})

    return sorted(results, key=lambda x: x["similarity"], reverse=True)
