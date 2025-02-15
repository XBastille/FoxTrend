import pandas as pd
import sys
import joblib

class UsedCarPricePredictor:
    def __init__(self):
        self.model = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_india/model.joblib')
        self.scaler = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_india/scaler.joblib')
        self.feature_names = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_india/feature_names.joblib')

    def preprocess_input(self, input_features):
        input_df = pd.DataFrame([input_features])
        
        input_df["Car_Age"] = 2024 - input_df["Year"]
        input_df["Mileage_to_Engine_Ratio"] = input_df["Mileage"]/input_df["Engine"]
        input_df["Power_to_Engine_Ratio"] = input_df["Power"]/input_df["Engine"]
        input_df["Is_Vintage"] = input_df["Car_Age"].apply(lambda x: 1 if x > 25 else 0)
        input_df["Kms_per_Year"] = input_df["Kilometers_Driven"]/input_df["Car_Age"]
        input_df["Brand"] = input_df["Name"].str.split().str[0]

        input_df = pd.get_dummies(input_df, columns=["Location", "Fuel_Type", "Transmission", "Owner_Type", "Brand"])
        
        for col in self.feature_names:
            if col not in input_df.columns:
                input_df[col] = 0
                
        input_df = input_df[self.feature_names]
        return self.scaler.transform(input_df)

    def predict(self, input_features):
        input_data = self.preprocess_input(input_features)
        return self.model.predict(input_data)[0]

predictor = UsedCarPricePredictor()

if len(sys.argv) != 12:
    #Usage: python model_India.py <name> <year> <kilometers> <mileage> <engine> <power> <seats> <location> <fuel_type> <transmission> <owner_type>
    sys.exit(1)

user_input = {
    "Name": sys.argv[1],
    "Year": int(sys.argv[2]),
    "Kilometers_Driven": float(sys.argv[3]),
    "Mileage": float(sys.argv[4]),
    "Engine": float(sys.argv[5]),
    "Power": float(sys.argv[6]),
    "Seats": float(sys.argv[7]),
    "Location": sys.argv[8],
    "Fuel_Type": sys.argv[9],
    "Transmission": sys.argv[10],
    "Owner_Type": sys.argv[11]
}

predicted_price = predictor.predict(user_input)
print(predicted_price)
