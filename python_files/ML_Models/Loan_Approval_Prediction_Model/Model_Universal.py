import numpy as np
import pandas as pd
import sys
import joblib

class LoanApprovalModel:
    def __init__(self):
        # Load model and transformers
        self.model = joblib.load('python_files/ML_Models/Loan_Approval_Prediction_Model/model_universal/model.joblib')
        self.scaler = joblib.load('python_files/ML_Models/Loan_Approval_Prediction_Model/model_universal/scaler.joblib')
        self.feature_names = joblib.load('python_files/ML_Models/Loan_Approval_Prediction_Model/model_universal/feature_names.joblib')

    def preprocess_input(self, input_data):
        input_df = pd.DataFrame([input_data])
        
        # Apply transformations
        input_df['Experience'] = abs(input_df['Experience'])
        input_df['Income'] = np.cbrt(input_df['Income'])
        input_df['CCAvg'] = np.cbrt(input_df['CCAvg'])
        input_df['Mortgage'] = np.sqrt(input_df['Mortgage'])
        
        # Ensure all columns match training data
        input_df = input_df[self.feature_names]
        
        # Scale features
        input_scaled = self.scaler.transform(input_df)
        return input_scaled

    def predict(self, input_data):
        input_processed = self.preprocess_input(input_data)
        prediction = self.model.predict(input_processed)
        return prediction[0]

# Usage
model = LoanApprovalModel()

if len(sys.argv) != 10:
    #Usage: python Model_Universal.py Age Experience Income Family CCAvg Education Mortgage CD.Account CreditCard
    sys.exit(1)

input_data = {
    'Age': float(sys.argv[1]),
    'Experience': float(sys.argv[2]),
    'Income': float(sys.argv[3]),
    'Family': float(sys.argv[4]),
    'CCAvg': float(sys.argv[5]),
    'Education': float(sys.argv[6]),
    'Mortgage': float(sys.argv[7]),
    'CD.Account': int(sys.argv[8]),
    'CreditCard': int(sys.argv[9])
}
prediction = model.predict(input_data)
result = "Approved" if prediction == 1 else "Denied"
print(result)
