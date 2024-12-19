import requests
from bs4 import BeautifulSoup
import yfinance as yf
import json
import sys

def get_stock_data(ticker_symbol):
    headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
    url = f"https://finance.yahoo.com/quote/{ticker_symbol}/chart"
    r=requests.get(url, headers=headers)
    soup=BeautifulSoup(r.text, "lxml")

    tickers = [
        ticker.text.strip()
        for ticker in soup.find_all(class_="symbol yf-1m808gl")
        if ticker.text.strip()
        and not any(char in ticker.text for char in '%+')
        and not ticker.text.strip().isdigit()
    ]

    stock_data = []
    for ticker in tickers:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        if info.get("quoteType") == "CRYPTOCURRENCY":
            current_price = info.get("dayLow")
        else:
            current_price = info.get("currentPrice")
        
        regular_market_open = info.get("regularMarketPreviousClose")
        previous_close = info.get("dayLow")

        if regular_market_open and previous_close:
            change = round(regular_market_open - previous_close, 4)
            change_percent = round(((regular_market_open - previous_close) / previous_close) * 100, 4)
        else:
            change = None
            change_percent = None

        stock_dict = {
            "Ticker": ticker,
            "Price": current_price,
            "Change": change,
            "Change %": change_percent,
            "Company_Name": info.get("longName")
        }
        stock_data.append(stock_dict)

    with open('recent_watch.json', 'w') as f:
        json.dump(stock_data, f, indent=4)
    
    return stock_data

if __name__ == "__main__":
    if len(sys.argv) != 2:
        #Usage: python sort_stocks_2.py <ticker_symbol>
        sys.exit(1)
    
    ticker_symbol = sys.argv[1]
    result = get_stock_data(ticker_symbol)
    print(f"Data for {ticker_symbol} has been saved to recent_watch.json")
