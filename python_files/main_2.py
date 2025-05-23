import os
import sys
import datetime
import matplotlib.pyplot as plt
import pandas as pd
import yfinance as yf
import ta
import json
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('stock_analysis.log'),
        logging.StreamHandler()
    ]
)

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
        except Exception as e:
            print(f"Error initializing data for {company_name}: {str(e)}")
            self.stock_data = pd.DataFrame()

    def download_stock_data(self):
        end_date=datetime.datetime.now()
        start_date=end_date-datetime.timedelta(days=25*365)
        stock_data=yf.download(self.company_name, start=start_date, end=end_date, progress=False, auto_adjust=True)
        if isinstance(stock_data.columns, pd.MultiIndex):
            stock_data.columns = stock_data.columns.get_level_values(0)
        stock_info = yf.Ticker(self.company_name).info
        with open('graph.json', 'w') as json_file:
            json.dump(stock_info, json_file, indent=4)
            logging.info(f"Created JSON file: graph.json for {self.company_name}")
        #stock_data.drop(columns=["Open", "High", "Low", "Adj Close", "Volume"], inplace=True)
        return stock_data

    def calculate_price_change(self):
        close_price=self.stock_data["Close"].iloc[-1]
        previous_close=self.stock_data["Close"].iloc[-2]
        price_change=close_price-previous_close
        percentage_change=(price_change/previous_close)*100
        return price_change,percentage_change

    def plot_historical_data(self, start_date=None, end_date=None):
        
        df = self.plot_technical_indicators_2(start_date, end_date)
        price_change, percentage_change = self.calculate_price_change()
        
        if price_change > 0:
            print(f"+{price_change:.2f}  (+{percentage_change:.2f}%)")
        else:
            print(f"-${abs(price_change):.2f}  ({percentage_change:.2f}%)")
        os.makedirs('public/csv', exist_ok=True)
        for i in range(1, 4):
            csv_filename = f'public/csv/trending{i}.csv'
            if not os.path.exists(csv_filename):
                df.to_csv(csv_filename)
                logging.info(f"Created stock data CSV file: {csv_filename}")
                break
        '''plt.figure(figsize=(14,7))
        plt.plot(df["Close"], label="Historical Close Prices")
        plt.title(f"Historical Close Prices for {self.company_name}")
        self.plot_technical_indicators_28_10("Price")'''

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
        csv_filename = f"technical_indicators_{self.index}.csv"
        # df[["SMA50", "SMA200", "RSI", "MACD", "MACD_signal", "MACD_histogram", "Bollinger_hband", "Bollinger_lband"]].to_csv(csv_filename)
        logging.info(f"Created technical indicators CSV file: {csv_filename}")
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