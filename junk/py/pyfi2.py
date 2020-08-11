#! python3
import requests,bs4
res=requests.get('https://www.flipkart.com/boat-rockerz-400-super-extra-bass-bluetooth-headset-mic/p/itmf3vhg5m9smugx?pid=ACCEJZXYKSG2T9GS&lid=LSTACCEJZXYKSG2T9GSOJDHG6&marketplace=FLIPKART&spotlightTagId=BestsellerId_0pm&srno=b_1_1&otracker=hp_omu_Deals%2Bof%2Bthe%2BDay_2_2.dealCard.OMU_7M7ZLS1X8O3Z_2&otracker1=hp_omu_SECTIONED_neo%2Fmerchandising_Deals%2Bof%2Bthe%2BDay_NA_dealCard_cc_2_NA_view-all_2&fm=neo%2Fmerchandising&iid=389d9300-193f-49d7-89cc-a8be8eb5dd0f.ACCEJZXYKSG2T9GS.SEARCH&ppt=browse&ppn=browse&ssid=v22yuza6t42a445c1578243210603')
res.raise_for_status
soup=bs4.BeautifulSoup(res.text,"html.parser")
name_elem=soup.select('._35KyD6')
price_elem=soup.select('._3qQ9m1')
print(name_elem[0].getText()[:30]+' = '+price_elem[0].getText())
