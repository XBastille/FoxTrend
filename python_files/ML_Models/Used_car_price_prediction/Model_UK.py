import numpy as np
import pandas as pd
import sys
import joblib

class UsedCarPricePredictor:
    def __init__(self):
        self.model = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_uk/model.joblib')
        self.scaler = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_uk/scaler.joblib')
        self.robust_scaler = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_uk/robust_scaler.joblib')
      
        self.encoders = {
            'Brand': joblib.load('python_files/ML_Models/Used_car_price_prediction/model_uk/Brand_encoder.joblib'),
            'Body type': joblib.load('python_files/ML_Models/Used_car_price_prediction/model_uk/Body type_encoder.joblib'),
            'Gearbox': joblib.load('python_files/ML_Models/Used_car_price_prediction/model_uk/Gearbox_encoder.joblib'),
            'Emission Class': joblib.load('python_files/ML_Models/Used_car_price_prediction/model_uk/Emission Class_encoder.joblib')
        }

    def create_new_features(self, data):
        current_year = 2024
        data["age"] = current_year - data["Registration_Year"]
        data["Engine"] = data["Engine"].str.extract(r"(\d+\.\d+)").astype(float)
        data["Mileage_to_Engine_Ratio"] = data["Mileage(miles)"] / data["Engine"]
        return data

    def log_transform(self, df, features):
        transformed_df = df.copy()
        for feature in features:
            transformed_df[feature] = np.log1p(transformed_df[feature].clip(lower=0))
        df[features] = transformed_df[features]
        return df

    def prepare_input(self, input_features):
        input_df = pd.DataFrame([input_features])
        input_df = self.create_new_features(input_df)
        input_df = self.log_transform(input_df, ["Mileage(miles)", "Mileage_to_Engine_Ratio"])
        
        for col in self.encoders:
            if col in input_df.columns:
                le = self.encoders[col]
                input_df[col] = input_df[col].astype(str)
                input_df[col] = input_df[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else -1)
        
    
        numerical_features = ["Registration_Year", "Engine", "Mileage(miles)", "age", "Mileage_to_Engine_Ratio"]
        input_df[numerical_features] = self.robust_scaler.transform(input_df[numerical_features])
        
        cols = ["Registration_Year", "Brand", "Emission Class", "age", "Gearbox", 
                "Mileage(miles)", "Engine", "Body type", "Mileage_to_Engine_Ratio"]
        input_df = input_df[cols]
        return self.scaler.transform(input_df)

    def predict(self, input_features):
        input_prepared = self.prepare_input(input_features)
        prediction = self.model.predict(input_prepared)
        return prediction[0]

predictor = UsedCarPricePredictor()

if len(sys.argv) != 8:
    #Usage: python Model_UK.py <registration_year> <brand> <emission_class> <gearbox> <mileage> <engine> <body_type>
    sys.exit(1)

input_features = {
    "Registration_Year": int(sys.argv[1]),
    "Brand": sys.argv[2],
    "Emission Class": sys.argv[3],
    "Gearbox": sys.argv[4],
    "Mileage(miles)": float(sys.argv[5]),
    "Engine": sys.argv[6],
    "Body type": sys.argv[7]
}

predicted_price = predictor.predict(input_features)
print(predicted_price)

