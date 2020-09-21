#! python3
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException
import time
from bs4 import BeautifulSoup


PATH = 'C:\Program Files (x86)\chromedriver.exe'


class IPvoidSession:
    def __init__(self):
        chrome_options = Options()
        # hiding browser window
        chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(PATH, options=chrome_options)
        #opening browser
        print("opening browser")
        self.driver.get("https://www.ipvoid.com/ip-blacklist-check/")

    def searchIPs(self, IP):
        print("sending ip")
        ip_add_field = self.driver.find_element_by_css_selector('#ipAddr')
        ip_add_field.clear()
        ip_add_field.send_keys(IP)
        ip_add_field.send_keys(Keys.ENTER)
        # trying to print the data from the result page
        html = self.driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        table_body = soup.find('tbody')
        data = []
        # capturing table data in a 2d array
        rows = table_body.find_all('tr')
        for row in rows:
            cols = row.find_all('td')
            cols = [ele.text.strip() for ele in cols]
            data.append([ele for ele in cols if ele])

        print(data)

    def close(self):
        print("closing Browser instance")
        self.driver.close()

    # seperate methords so that we can view multiple results in one session
    # integrate with the web app
    # deploy on aws


if __name__ == "__main__":
    session = IPvoidSession()
    session.searchIPs('8.8.4.4')
    time.sleep(5)
    session.searchIPs('1.1.1.1')
    session.close()
