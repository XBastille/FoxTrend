import numpy as np
import pandas as pd
import sys
import joblib

class UsedCarPricePredictor:
    def __init__(self):
        self.model = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_ca/model.joblib')
        self.scaler = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_ca/scaler.joblib')
        self.feature_names = joblib.load('python_files/ML_Models/Used_car_price_prediction/model_ca/feature_names.joblib')
        
        self.encoders = {}
        for feature in ['make', 'model', 'body_type', 'drivetrain', 'transmission', 'fuel_type']:
            self.encoders[feature] = joblib.load(f'python_files/ML_Models/Used_car_price_prediction/model_ca/{feature}_encoder.joblib')

    def create_new_features(self, data):
        current_year = 2024
        data['miles_per_year'] = (data['miles']/(current_year-data['year']).replace({0: 1})).round(0)
        data['age'] = current_year-data['year']
        return data

    def log_transform(self, df, features):
        transformed_df = df.copy()
        for feature in features:
            transformed_df[feature] = np.log1p(transformed_df[feature].clip(lower=0))
        df[features] = transformed_df[features]
        return df

    def preprocess_input(self, input_features):
        input_df = pd.DataFrame([input_features])
        
        input_df = self.create_new_features(input_df)
        input_df = self.log_transform(input_df, ['miles', 'miles_per_year'])
        
        for col, encoder in self.encoders.items():
            if col in input_df.columns:
                input_df[col] = encoder.transform(input_df[col].astype(str))
        
        input_df.drop(columns=['year'], inplace=True)
        
        input_df = input_df[self.feature_names]
        return self.scaler.transform(input_df)

    def predict(self, input_features):
        input_data = self.preprocess_input(input_features)
        return self.model.predict(input_data)[0]

predictor = UsedCarPricePredictor()

if len(sys.argv) != 10:
    #Usage: python Model_CA.py <year> <make> <model> <body_type> <drivetrain> <transmission> <fuel_type> <miles> <engine_size>
    sys.exit(1)

user_input = {
    "year": int(sys.argv[1]),
    "make": sys.argv[2],
    "model": sys.argv[3],
    "body_type": sys.argv[4],
    "drivetrain": sys.argv[5],
    "transmission": sys.argv[6],
    "fuel_type": sys.argv[7],
    "miles": float(sys.argv[8]),
    "engine_size": sys.argv[9]
}

predicted_price = predictor.predict(user_input)
print(predicted_price)
