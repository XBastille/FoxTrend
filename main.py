import sys
import datetime
import matplotlib.pyplot as plt
import pandas as pd
import yfinance as yf
import ta
import json
import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

class StockDataVisualizer:
    def __init__(self, company_name, index):
        self.company_name=company_name
        self.index=index
        try:
            ticker = yf.Ticker(company_name)
            info = ticker.info
            if not info or 'regularMarketOpen' not in info:
                raise ValueError(f"Invalid ticker symbol: {company_name}")
            self.stock_data = self.download_stock_data()
            self.related_stocks = self.get_related_stocks()
        except Exception as e:
            print(f"Error initializing data for {company_name}: {str(e)}")
            self.stock_data = self.download_stock_data()
            self.related_stocks = []

    def download_stock_data(self):
        try:
            end_date = datetime.datetime.now()
            start_date = end_date - datetime.timedelta(days=25*365)
            stock_data = yf.download(self.company_name, start=start_date, end=end_date)
            if isinstance(stock_data.columns, pd.MultiIndex):
                stock_data.columns = stock_data.columns.get_level_values(0)
            stock_info = yf.Ticker(self.company_name).info
            if not stock_info:
                stock_info = {}
                
            with open('public/graph.json', 'w') as json_file:
                json.dump(stock_info, json_file, indent=4)
                
            print("jsonfile is created")
            return stock_data
        except Exception as e:
            print(f"Error downloading data: {str(e)}")
            with open('public/graph.json', 'w') as json_file:
                json.dump({}, json_file)
            return pd.DataFrame()

    def calculate_price_change(self):
        close_price=self.stock_data["Close"].iloc[-1]
        previous_close=self.stock_data["Close"].iloc[-2]
        price_change=close_price-previous_close
        percentage_change=(price_change/previous_close)*100
        return price_change,percentage_change

    def plot_historical_data(self, start_date=None, end_date=None):
        df=self.plot_technical_indicators_2(start_date, end_date)
        price_change,percentage_change=self.calculate_price_change()
        if price_change>0:
            print(f"+{price_change:.2f}  (+{percentage_change:.2f}%)")
        else:
            print(f"{price_change:.2f}  ({percentage_change:.2f}%)")
        df.to_csv(f"public/stock_data_{self.index}.csv")
        df.to_csv(f"public/csv_1/stock_data_{self.index}.csv")
        '''plt.figure(figsize=(14,7))
        plt.plot(df["Close"], label="Historical Close Prices")
        plt.title(f"Historical Close Prices for {self.company_name}")
        self.plot_technical_indicators_28_10("Price")'''
        print("csvfile is created")

    def get_related_stocks(self):
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session = requests.Session()
        session.mount("https://", adapter)
        session.mount("http://", adapter)
        headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
    }
        url = f"https://finance.yahoo.com/quote/{self.company_name}/chart"
        r = requests.get(url, headers=headers)
        soup = BeautifulSoup(r.text, "lxml")

        tickers = [
            ticker.text.strip()
            for ticker in soup.find_all(class_="symbol yf-1m808gl")
            if ticker.text.strip()
            and not any(char in ticker.text for char in '%+')
            and not ticker.text.strip().isdigit()
        ]

        stock_data = []
        for ticker in tickers:
            stock_data_ticker = yf.download(ticker, period="5d")
            if isinstance(stock_data_ticker.columns, pd.MultiIndex):
                stock_data_ticker.columns = stock_data_ticker.columns.get_level_values(0)
            stock = yf.Ticker(ticker)
            info = stock.info
            current_price = info.get("currentPrice")
            if info.get("quoteType") == "CRYPTOCURRENCY":
                current_price = info.get("dayLow")
            
            close_price=stock_data_ticker["Close"].iloc[-1]
            previous_close=stock_data_ticker["Close"].iloc[-2]

            if close_price and previous_close:
                change = round(close_price - previous_close, 4)
                change_percent = round(((close_price - previous_close) / previous_close)*100, 2)
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

        with open(f'public/people_also_watch.json', 'w') as f:
            json.dump(stock_data, f, indent=4)
        
        return stock_data

    def plot_technical_indicators(self, start_date=None, end_date=None):
        df=self.plot_technical_indicators_2(start_date, end_date)
        df["SMA50"]=df["Close"].rolling(window=50).mean()
        df["SMA200"]=df["Close"].rolling(window=200).mean()
        df["RSI"]=ta.momentum.RSIIndicator(df["Close"], window=14).rsi()
        macd=ta.trend.MACD(df["Close"])
        df["MACD"]=macd.macd()
        df["MACD_signal"]=macd.macd_signal()
        df["MACD_histogram"]=macd.macd_diff()
        bollinger=ta.volatility.BollingerBands(df["Close"], window=20, window_dev=2)
        df["Bollinger_hband"]=bollinger.bollinger_hband()
        df["Bollinger_lband"]=bollinger.bollinger_lband()
        df[["SMA50", "SMA200", "RSI", "MACD", "MACD_signal", "MACD_histogram", "Bollinger_hband", "Bollinger_lband"]].to_csv(f"public/technical_indicators_{self.index}.csv")
        df[["SMA50", "SMA200", "RSI", "MACD", "MACD_signal", "MACD_histogram", "Bollinger_hband", "Bollinger_lband"]].to_csv(f"public/csv_1/technical_indicators_{self.index}.csv")
        '''plt.figure(figsize=(14,7))
        plt.plot(df["Close"], label="Close Price")
        plt.plot(df["SMA50"], label="50-Day SMA")
        plt.plot(df["SMA200"], label="200-Day SMA")
        plt.fill_between(df.index, df["Bollinger_hband"], df["Bollinger_lband"], color="grey", alpha=0.3, label="Bollinger Bands")
        self.plot_technical_indicators_28(' Technical Indicators', "Price")
        plt.figure(figsize=(14,4))
        plt.plot(df["RSI"], label="RSI", color="purple")
        plt.axhline(70, color="red", linestyle="--")
        plt.axhline(30, color="green", linestyle="--")
        self.plot_technical_indicators_28(' RSI', "RSI")
        plt.figure(figsize=(14,7))
        plt.plot(df["MACD"], label="MACD", color="blue")
        plt.plot(df["MACD_signal"], label="MACD Signal", color="red")
        plt.bar(df.index, df["MACD_histogram"], label="MACD Histogram", color="green", alpha=0.3)
        self.plot_technical_indicators_28(' MACD', "MACD")'''

    def plot_technical_indicators_2(self, start_date, end_date):
        result=self.stock_data.copy()
        if start_date:
            start_date = pd.to_datetime(start_date, format="%d-%m-%Y")
            result=result[result.index>=pd.to_datetime(start_date)]
        if end_date:
            end_date = pd.to_datetime(end_date, format="%d-%m-%Y")
            result=result[result.index<=pd.to_datetime(end_date)]
        return result

    def plot_technical_indicators_28(self, arg0, arg1):
        plt.title(f"{self.company_name}{arg0}")
        self.plot_technical_indicators_28_10(arg1)

    def plot_technical_indicators_28_10(self, arg0):
        plt.xlabel("Date")
        plt.ylabel(arg0)
        plt.legend()
        plt.grid()
        plt.show()

    def run(self, start_date, end_date):
        if not self.stock_data.empty:
            self.plot_historical_data(start_date, end_date)
            self.plot_technical_indicators(start_date, end_date)

        elif self.related_stocks!=[]:
            print("yes")
            print(f"Skipping analysis for {self.company_name} due to invalid data")
            pd.DataFrame().to_csv(f"public/csv_1/stock_data_{self.index}.csv")
            pd.DataFrame().to_csv(f"public/stock_data_{self.index}.csv")
            pd.DataFrame().to_csv(f"public/technical_indicators_{self.index}.csv")
            pd.DataFrame().to_csv(f"public/csv_1/technical_indicators_{self.index}.csv")

        else:
            print(f"Skipping analysis for {self.company_name} due to invalid data")


if __name__ == "__main__":
    if len(sys.argv)<3:
        sys.exit(1)
    num_companies=int(sys.argv[1])
    companies=sys.argv[2:2+num_companies]
    start_date=sys.argv[2+num_companies] if len(sys.argv)>2+num_companies else None
    end_date=sys.argv[3+num_companies] if len(sys.argv)>3+num_companies else None
    if start_date:
        start_date = datetime.datetime.strptime(start_date, "%d-%m-%Y").strftime("%d-%m-%Y")
    if end_date:
        end_date = datetime.datetime.strptime(end_date, "%d-%m-%Y").strftime("%d-%m-%Y")
    for i, company_name in enumerate(companies, start=1):
        visualizer=StockDataVisualizer(company_name, i)
        visualizer.run(start_date, end_date)