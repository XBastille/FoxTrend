import yfinance as yf
import pandas as pd
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import random
from requests.exceptions import HTTPError

def read_tickers(filename):
    with open(filename, 'r') as file:
        return [line.strip() for line in file if line.strip()]

def get_stock_info(ticker):
    max_retries = 3
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            time.sleep(random.uniform(1, 3))
            
            stock = yf.Ticker(ticker)
            info = stock.info
            
            prev_close = info.get('regularMarketPreviousClose', 0)
            current_price = info.get('currentPrice', 0)
            price_change = current_price - prev_close if current_price and prev_close else None
            percent_change = (price_change / prev_close) * 100 if prev_close != 0 else None
            hist = stock.history(period="1y")
            if not hist.empty:
                year_start = hist['Close'].iloc[0]
                year_end = hist['Close'].iloc[-1]
                week52_change = ((year_end - year_start) / year_start) if year_start != 0 else None
            else:
                week52_change = None
            
            return {
                'Ticker': ticker,
                'Price': current_price,
                'Change': price_change,
                'Change %': percent_change,
                'Volume': info.get('regularMarketVolume', None),
                'Market Cap': info.get('marketCap', None),
                '52W Change': week52_change,
                'Beta': info.get('beta', None) 
            }
            
        except HTTPError as e:
            if "429" in str(e) and attempt < max_retries - 1:
                time.sleep(retry_delay * (attempt + 1))  
                continue
            print(f"Error fetching data for {ticker}: {str(e)}")
            return None
        except Exception as e:
            print(f"Error fetching data for {ticker}: {str(e)}")
            return None

def main():
    tickers = read_tickers('./public/textfile/all_ticker.txt')
    stock_data = []
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        future_to_ticker = {executor.submit(get_stock_info, ticker): ticker for ticker in tickers}
        
        for future in tqdm(as_completed(future_to_ticker), total=len(tickers), desc="Fetching stock data"):
            data = future.result()
            if data:
                stock_data.append(data)
    
    df = pd.DataFrame(stock_data)
    df.to_csv('all_stock_data.csv', index=False)
    print("Data saved to stock_data.csv")

if __name__ == "__main__":
    main()