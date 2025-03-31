import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

STORAGE_DIR = "storage"
os.makedirs(STORAGE_DIR, exist_ok=True)

def setup_driver():
    """Setup Selenium WebDriver."""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Run in background
    options.add_argument("--disable-gpu")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def download_drive_files(drive_link):
    """Scrape and download files from Google Drive."""
    driver = setup_driver()
    driver.get(drive_link)
    time.sleep(5)  # Allow time for page load

    # Example: Click the first file and press Download
    files = driver.find_elements(By.XPATH, "//div[@role='listitem']")
    for file in files:
        file.click()
        time.sleep(1)
        download_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Download')]")
        download_btn.click()
        time.sleep(2)

    driver.quit()

def download_classroom_files(classroom_link):
    """Scrape and download assignments from Google Classroom."""
    driver = setup_driver()
    driver.get(classroom_link)
    time.sleep(5)  # Allow page to load

    assignments = driver.find_elements(By.XPATH, "//div[contains(@class, 'assignment-title')]")
    for assignment in assignments:
        assignment.click()
        time.sleep(2)
        download_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Download')]")
        download_btn.click()
        time.sleep(2)

    driver.quit()
