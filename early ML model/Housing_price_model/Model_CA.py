import pandas as pd
import sys
import joblib

class HousingPriceModel:
    def __init__(self):
        self.model = joblib.load('model/model.joblib')
        self.scaler = joblib.load('model/scaler.joblib')
        self.le_city = joblib.load('model/le_city.joblib')
        self.le_province = joblib.load('model/le_province.joblib')

    def preprocess_input(self, input_data):
        input_df = pd.DataFrame([input_data])
        input_df['City'] = self.le_city.transform(input_df['City'])
        input_df['Province'] = self.le_province.transform(input_df['Province'])
        input_data = self.scaler.transform(input_df)
        return input_data

    def predict(self, input_data):
        input_data = self.preprocess_input(input_data)
        return self.model.predict(input_data)

model = HousingPriceModel()

if len(sys.argv) != 7:
    #Usage: python Model_CA.py <city> <beds> <baths> <province> <population> <median_income
    sys.exit(1)

user_input = {
    "City": sys.argv[1],
    "Number_Beds": float(sys.argv[2]),
    "Number_Baths": float(sys.argv[3]),
    "Province": sys.argv[4],
    "Population": int(sys.argv[5]),
    "Median_Family_Income": float(sys.argv[6])
}
predicted_price = model.predict(user_input)
print(predicted_price[0])
