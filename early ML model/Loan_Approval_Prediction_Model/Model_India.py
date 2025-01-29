import pandas as pd
import sys
import joblib

class LoanApprovalModel:
    def __init__(self):
        self.model = joblib.load('model_loan/model.joblib')
        self.scaler = joblib.load('model_loan/scaler.joblib')
        self.feature_names = joblib.load('model_loan/feature_names.joblib')

    def preprocess_input(self, input_features):
        input_df = pd.DataFrame([input_features])
        input_df = pd.get_dummies(input_df, 
                                columns=["Marital_Status", "House_Ownership", "Vehicle_Ownership"], 
                                drop_first=True)*1
        
        for col in self.feature_names:
            if col not in input_df.columns:
                input_df[col] = 0
        
        input_df = input_df[self.feature_names]
        return self.scaler.transform(input_df)

    def predict(self, input_features):
        input_data = self.preprocess_input(input_features)
        prediction = self.model.predict(input_data)
        return prediction[0]

model = LoanApprovalModel()

input_features = {
    "Annual_Income": float(sys.argv[1]),
    "Applicant_Age": int(sys.argv[2]),
    "Work_Experience": int(sys.argv[3]),
    "Years_in_Current_Work": int(sys.argv[4]),
    "Marital_Status": sys.argv[5],
    "House_Ownership": sys.argv[6],
    "Vehicle_Ownership": sys.argv[7]
}

    prediction = model.predict(input_features)
    result = "Approved" if prediction == 0 else "Denied"
    print({result})
