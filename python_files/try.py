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
    retry_delay = 2  
    
    for attempt in range(max_retries):
        try:
            time.sleep(random.uniform(0.2, 0.5))
            
            stock = yf.Ticker(ticker)
            info = stock.info
            
            prev_close = info.get('regularMarketPreviousClose', 0)
            current_price = info.get('currentPrice', 0)
            price_change = current_price - prev_close if current_price and prev_close else None
            percent_change = (price_change / prev_close) * 100 if prev_close != 0 else None
            
            hist = stock.history(period="1y")
            week52_change = None
            if not hist.empty:
                year_start = hist['Close'].iloc[0]
                year_end = hist['Close'].iloc[-1]
                week52_change = ((year_end - year_start) / year_start) if year_start != 0 else None
            
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

def process_batch(tickers_batch):
    return [result for result in map(get_stock_info, tickers_batch) if result]

def main():
    tickers = read_tickers('./public/textfile/all_ticker.txt')
    stock_data = []
    
    batch_size = 50
    ticker_batches = [tickers[i:i + batch_size] for i in range(0, len(tickers), batch_size)]
    
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(process_batch, batch) for batch in ticker_batches]
        
        for future in tqdm(as_completed(futures), total=len(futures), desc="Processing batches"):
            batch_results = future.result()
            stock_data.extend(batch_results)
    
    df = pd.DataFrame(stock_data)
    df.to_csv('./public/csv/all_stock_data.csv', index=False)
    print("Data saved to stock_data.csv")

if __name__ == "__main__":
    main()