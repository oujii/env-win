import os
import time
import base64
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

# Din JSON-databas med länkar (klistra in här, eller importera från fil)
searchSuggestions = {
    # Klistra in din data här istället
}

# Skapa mapp om den inte finns
if not os.path.exists('images'):
    os.makedirs('images')

# Starta en riktig Chrome-webbläsare via Selenium
chrome_options = Options()
chrome_options.add_argument('--headless')  # Kör i bakgrunden (utan fönster)
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

service = Service()  # ChromeDriver bör vara i PATH
driver = webdriver.Chrome(service=service, options=chrome_options)

# Samla alla unika bild-URLer
image_urls = set()
for key in searchSuggestions:
    for item in searchSuggestions[key]:
        if 'image' in item and item['image']:
            image_urls.add(item['image'])

print(f"Totalt {len(image_urls)} bilder hittade.")

counter = 1
for url in image_urls:
    try:
        print(f"🔵 Hämtar {url}")

        driver.get(url)
        time.sleep(1)  # Vänta kort

        # Eftersom vi är på en bild-URL direkt kan vi ta sidans innehåll
        img_data = driver.page_source

        # Vi använder istället en vanlig requests för att spara korrekt binär fil
        img_content = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
        }).content

        # Spara filen
        filename = f'images/img{counter}.jpg'
        with open(filename, 'wb') as f:
            f.write(img_content)

        print(f"✅ Sparade {filename}")
        counter += 1
    except Exception as e:
        print(f"❌ Misslyckades {url}: {e}")

driver.quit()
print('✅ Klart.')