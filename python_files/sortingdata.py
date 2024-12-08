import requests
from bs4 import BeautifulSoup
import yfinance as yf
import json

headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
url = "https://finance.yahoo.com/markets/stocks/trending/"
r=requests.get(url, headers=headers)
soup=BeautifulSoup(r.text, "lxml")
tickers = [
    ticker.text.strip()
    for ticker in soup.find_all(class_="cell tw-h-10 tw-py-0 yf-paf8n5")
    if ticker.text.strip()
    and all(char not in ticker.text for char in '0123456789%+-.')
]
stock_data = []
for ticker in tickers:
    stock = yf.Ticker(ticker)
    info = stock.info
    current_price = info.get("currentPrice")
    previous_close = info.get("previousClose")
    volume=info.get("volume")
    beta=info.get("beta")
    peratio=info.get('trailingPE')

    if current_price and previous_close:
        change = round(current_price - previous_close, 4)
        change_percent = round((change / previous_close) * 100, 4)
    else:
        change = None
        change_percent = None

    stock_dict = {
        "Ticker": ticker,
        "Price": current_price,
        "Change": change,
        "Change %": change_percent,
        "Company_Name": info.get("longName"),
        "Volume":volume,
        "Beta":beta,
        "PE_Ratio":peratio
    }
    stock_data.append(stock_dict)
with open('./public/json/sorted_stock_data.json', 'w') as f:
    json.dump(stock_data, f, indent=4)