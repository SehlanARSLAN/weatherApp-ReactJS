import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

const weatherAdapter = createEntityAdapter({
  selectId: (weather) => weather.dt,
});

const initialState = weatherAdapter.getInitialState({
  loading: "idle",
  error: null,
});

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city, { rejectWithValue }) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      return response.data.list;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = "succeeded";
        weatherAdapter.setAll(state, action.payload);
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload || "Bir hata oluştu";
      });
  },
});

export const { selectAll: selectAllWeather, selectById: selectWeatherById } =
  weatherAdapter.getSelectors((state) => state.weather);
export default weatherSlice.reducer;
