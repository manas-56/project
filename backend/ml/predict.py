import os
import numpy as np
import pandas as pd
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

# === Config ===
LOOKBACK = 60
FEATURE_COLS = ["Open", "High", "Low", "Close", "Volume"]
TARGET_COL = "Close"

DATA_DIR = "backend/data"
MODEL_DIR = "backend/saved_models"

def load_data(stock_file):
    df = pd.read_csv(stock_file).dropna()
    df = df.sort_values("Date")
    return df

def prepare_input(df):
    scaler = MinMaxScaler()
    df_scaled = scaler.fit_transform(df[FEATURE_COLS + [TARGET_COL]])
    X = df_scaled[-LOOKBACK:, :len(FEATURE_COLS)]
    return np.expand_dims(X, axis=0), scaler

def inverse_prediction(y_scaled, scaler):
    padded = np.zeros((1, len(FEATURE_COLS) + 1))  # +1 for target col
    padded[0, len(FEATURE_COLS)] = y_scaled[0][0]
    return scaler.inverse_transform(padded)[0][-1]

def predict_next_day_close(stock_name):
    csv_path = os.path.join(DATA_DIR, f"{stock_name}.csv")
    model_path = os.path.join(MODEL_DIR, f"{stock_name}_lstm_model.h5")

    if not os.path.exists(csv_path) or not os.path.exists(model_path):
        print(f"❌ Missing data/model for {stock_name}")
        return

    df = load_data(csv_path)
    model = load_model(model_path)
    X, scaler = prepare_input(df)
    
    y_pred_scaled = model.predict(X)
    predicted_close = inverse_prediction(y_pred_scaled, scaler)

    print(f"\n📈 Predicted Close Price for {stock_name} (Next Day): ₹{predicted_close:.2f}")

# === Example usage ===
if __name__ == "__main__":
    predict_next_day_close("ADANIPORTS")
