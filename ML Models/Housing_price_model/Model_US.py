import pandas as pd
import sys
import joblib

class HousePricePredictor:
    def __init__(self):
        # Load model
        self.model = joblib.load('model_us/model.joblib')
        
        # Load encoders
        self.le_city = joblib.load('model_us/le_city.joblib')
        self.le_state = joblib.load('model_us/le_state.joblib')
        
        # Load scalers
        self.scalers = {
            "house_size": joblib.load('model_us/house_size_scaler.joblib'),
            "price": joblib.load('model_us/price_scaler.joblib'),
            "bed": joblib.load('model_us/bed_scaler.joblib'),
            "bath": joblib.load('model_us/bath_scaler.joblib'),
            "acre_lot": joblib.load('model_us/acre_lot_scaler.joblib')
        }

    def preprocess_input(self, input_data):
        input_df = pd.DataFrame([input_data])
        
        # Transform categorical data
        input_df["city"] = self.le_city.transform([input_data["city"]])
        input_df["state"] = self.le_state.transform([input_data["state"]])
        
        # Scale numerical features
        for column in ["house_size", "bed", "bath", "acre_lot"]:
            input_df[column] = self.scalers[column].transform(input_df[column].values.reshape(-1, 1))
        
        return input_df[["bed", "bath", "acre_lot", "zip_code", "house_size", "city", "state"]]

    def predict(self, input_data):
        processed_input = self.preprocess_input(input_data)
        prediction = self.model.predict(processed_input)
        return self.scalers["price"].inverse_transform(prediction.reshape(-1, 1))[0][0]

# Usage
predictor = HousePricePredictor()

if len(sys.argv) != 8:
    #Usage: python Model_US.py <beds> <baths> <acre_lot> <zip_code> <house_size> <city> <state>
    sys.exit(1)

user_input = {
    "bed": float(sys.argv[1]),
    "bath": float(sys.argv[2]),
    "acre_lot": float(sys.argv[3]),
    "zip_code": int(sys.argv[4]),
    "house_size": float(sys.argv[5]),
    "city": sys.argv[6],
    "state": sys.argv[7]
}

predicted_price = predictor.predict(user_input)
print(f"${predicted_price:,.2f}")
