import pandas as pd
import sys
import joblib

class UsedCarPricePredictor:
    def __init__(self):
        self.model = joblib.load('model_used_car/model.joblib')
        self.scaler = joblib.load('model_used_car/scaler.joblib')
        
        self.encoders = {
            'manufacturer': joblib.load('model_used_car/manufacturer_encoder.joblib'),
            'condition': joblib.load('model_used_car/condition_encoder.joblib'),
            'cylinders': joblib.load('model_used_car/cylinders_encoder.joblib'),
            'fuel': joblib.load('model_used_car/fuel_encoder.joblib'),
            'transmission': joblib.load('model_used_car/transmission_encoder.joblib'),
            'drive': joblib.load('model_used_car/drive_encoder.joblib'),
            'type': joblib.load('model_used_car/type_encoder.joblib'),
            'paint_color': joblib.load('model_used_car/paint_color_encoder.joblib')
        }

    def preprocess_input(self, input_features):
        input_df = pd.DataFrame([input_features])

        for col, encoder in self.encoders.items():
            if col in input_df.columns:
                input_df[col] = input_df[col].astype(str)
                input_df[col] = input_df[col].apply(lambda x: encoder.transform([x])[0] if x in encoder.classes_ else -1)

        input_df["year"] = (input_df["year"] - 1900).astype(int)
        input_df["odometer"] = input_df["odometer"].astype(int) // 5000

        return self.scaler.transform(input_df)

    def predict(self, input_features):
        input_data = self.preprocess_input(input_features)
        prediction = self.model.predict(input_data)
        return prediction[0]

predictor = UsedCarPricePredictor()

if len(sys.argv) != 11:
    #print("Usage: python Model_US.py <year> <manufacturer> <condition> <cylinders> <fuel> <odometer> <transmission> <drive> <type> <paint_color>")
    sys.exit(1)

user_input = {
    "year": int(sys.argv[1]),
    "manufacturer": sys.argv[2],
    "condition": sys.argv[3],
    "cylinders": sys.argv[4],
    "fuel": sys.argv[5],
    "odometer": float(sys.argv[6]),
    "transmission": sys.argv[7],
    "drive": sys.argv[8],
    "type": sys.argv[9],
    "paint_color": sys.argv[10]
}

predicted_price = predictor.predict(user_input)
print(f"The predicted used car price is: ${predicted_price:.2f}")
