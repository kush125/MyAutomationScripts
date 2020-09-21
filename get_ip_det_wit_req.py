import requests
from bs4 import BeautifulSoup

url = 'https://www.ipvoid.com/ip-blacklist-check/'
pos_obj = {'ip': '8.8.2.2'}
res_pg = requests.post(url, data=pos_obj)

soup = BeautifulSoup(res_pg.text, "html.parser")
table_body = soup.find('tbody')
data = []
# capturing table data in a 2d array
rows = table_body.find_all('tr')
for row in rows:
    cols = row.find_all('td')
    cols = [ele.text.strip() for ele in cols]
    data.append([ele for ele in cols if ele])

print(data)
