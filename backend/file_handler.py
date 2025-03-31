# import os
# import time

# def save_uploaded_files(files, folder):
#     """Saves uploaded files directly in the classroom folder with a timestamp to prevent overwriting."""
#     for file in files:
#         if file:
#             timestamp = int(time.time())  # Unique timestamp
#             filename = f"{timestamp}_{file.filename}"  # Rename file to avoid conflicts
#             file.save(os.path.join(folder, filename))
import os

def save_uploaded_files(files, folder, roll_no):
    """Saves uploaded files in the classroom folder using the student's roll number as the filename."""
    for file in files:
        if file:
            # Get file extension
            _, file_extension = os.path.splitext(file.filename)

            # Save file as roll_no.extension (e.g., S123.pdf)
            filename = f"{roll_no}{file_extension}"
            file_path = os.path.join(folder, filename)

            # Save file
            file.save(file_path)
