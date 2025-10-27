import { useState } from "react";
import api from "./api";

type MbsInputData = {
  coupon: number;
  maturity_years: number;
  weighted_average_coupon: number;
  weighted_average_maturity: number;
  option_adjusted_spread: number;
  psa_speed: number;
};

export default function App() {
  const [formData, setFormData] = useState<MbsInputData>({
    coupon: 3.5,
    maturity_years: 30,
    weighted_average_coupon: 3.5,
    weighted_average_maturity: 360,
    option_adjusted_spread: 18,
    psa_speed: 100,
  });

  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({ ...formData, [e.target.name]: isNaN(value) ? 0 : value });
  };

  const handlePredictionRequest = async () => {
    setLoading(true);
    setError("");
    setPredictedPrice(null);

    for (const key in formData) {
      if (formData[key as keyof MbsInputData] < 0) {
        setError(`Invalid value for ${key.replace(/_/g, " ")}`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await api.post("/predict-agency-mbs-price/", formData);
      setPredictedPrice(response.data.predicted_market_price);
    } catch (err) {
      setError("Failed to fetch prediction. Check backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
          Agency MBS Pricing Predictor
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter the parameters below to get the predicted market price
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="number"
                step="any"
                name={key}
                value={formData[key as keyof MbsInputData]}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handlePredictionRequest}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? "Predicting..." : "Get Predicted Market Price"}
        </button>

        {predictedPrice !== null && (
          <div className="mt-6 p-4 bg-green-50 text-green-800 font-semibold text-center rounded-lg shadow-inner">
            Predicted Market Price: ${predictedPrice.toFixed(2)}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 font-medium text-center rounded-lg shadow-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
