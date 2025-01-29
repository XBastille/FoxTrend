import pandas as pd
import sys
import joblib

class VehiclePricePredictor:
    def __init__(self):
        self.model = joblib.load('model_aus/model.joblib')
        self.scaler = joblib.load('model_aus/scaler.joblib')
        self.brand_encoder = joblib.load('model_aus/Brand_encoder.joblib')

    def preprocess_input(self, input_features):
        input_df = pd.DataFrame([input_features])
        
        input_df['Brand'] = self.brand_encoder.transform([input_features['Brand']])
        
        for feature in ['UsedOrNew', 'Transmission', 'DriveType', 'FuelType', 'BodyType']:
            prefix = f"{feature}_"
            col_name = f"{prefix}{input_features[feature]}"
            for col in self.scaler.feature_names_in_:
                if col.startswith(prefix):
                    input_df[col] = 1 if col == col_name else 0

        missing_cols = set(self.scaler.feature_names_in_) - set(input_df.columns)
        for col in missing_cols:
            input_df[col] = 0

        input_df = input_df[self.scaler.feature_names_in_]
        return self.scaler.transform(input_df)

    def predict(self, input_features):
        input_data = self.preprocess_input(input_features)
        return self.model.predict(input_data)[0]

predictor = VehiclePricePredictor()

if len(sys.argv) != 13:
    #Usage: python Model_AUS.py <brand> <year> <engine> <fuel_consumption> <kilometres> <cylinders> <doors> <seats> <transmission> <drive_type> <fuel_type> <body_type>
    sys.exit(1)

user_input = {
    "Brand": sys.argv[1],
    "Year": int(sys.argv[2]),
    "Engine": float(sys.argv[3]),
    "FuelConsumption": float(sys.argv[4]),
    "Kilometres": float(sys.argv[5]),
    "CylindersinEngine": int(sys.argv[6]),
    "Doors": int(sys.argv[7]),
    "Seats": int(sys.argv[8]),
    "Transmission": sys.argv[9],
    "DriveType": sys.argv[10],
    "FuelType": sys.argv[11],
    "BodyType": sys.argv[12],
    "UsedOrNew": "USED"
}

prediction = predictor.predict(user_input)
print(f"{prediction:.2f}")