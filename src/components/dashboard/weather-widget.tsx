'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CloudSun, 
  Thermometer, 
  Wind, 
  Droplets, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  temperatureFeel: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  precipitationProbability: number;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'snowy';
  description: string;
  location: string;
  lastUpdated: Date;
}

interface ForecastDay {
  date: Date;
  dayName: string;
  tempHigh: number;
  tempLow: number;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'snowy';
  precipitationProbability: number;
}

// Mock weather data for demo
const MOCK_WEATHER: WeatherData = {
  temperature: 12,
  temperatureFeel: 10,
  humidity: 65,
  windSpeed: 18,
  windDirection: 'SW',
  precipitation: 0,
  precipitationProbability: 10,
  condition: 'partly_cloudy',
  description: 'Teilweise bewölkt',
  location: 'Erfurt, TH',
  lastUpdated: new Date(),
};

const MOCK_FORECAST: ForecastDay[] = [
  { date: new Date(), dayName: 'Heute', tempHigh: 12, tempLow: 4, condition: 'partly_cloudy', precipitationProbability: 10 },
  { date: new Date(Date.now() + 86400000), dayName: 'Morgen', tempHigh: 14, tempLow: 5, condition: 'sunny', precipitationProbability: 5 },
  { date: new Date(Date.now() + 172800000), dayName: 'Übermorgen', tempHigh: 11, tempLow: 3, condition: 'rainy', precipitationProbability: 70 },
];

function getWeatherIcon(condition: WeatherData['condition']) {
  switch (condition) {
    case 'sunny':
      return <Sun className="h-12 w-12 text-yellow-500" />;
    case 'partly_cloudy':
      return <CloudSun className="h-12 w-12 text-amber-400" />;
    case 'cloudy':
      return <Cloud className="h-12 w-12 text-gray-400" />;
    case 'rainy':
      return <CloudRain className="h-12 w-12 text-blue-400" />;
    case 'snowy':
      return <CloudSnow className="h-12 w-12 text-blue-200" />;
    default:
      return <CloudSun className="h-12 w-12" />;
  }
}

function getWeatherIconSmall(condition: ForecastDay['condition']) {
  switch (condition) {
    case 'sunny':
      return <Sun className="h-6 w-6 text-yellow-500" />;
    case 'partly_cloudy':
      return <CloudSun className="h-6 w-6 text-amber-400" />;
    case 'cloudy':
      return <Cloud className="h-6 w-6 text-gray-400" />;
    case 'rainy':
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    case 'snowy':
      return <CloudSnow className="h-6 w-6 text-blue-200" />;
    default:
      return <CloudSun className="h-6 w-6" />;
  }
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call a weather API
      // For demo, we use mock data with a small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWeather(MOCK_WEATHER);
      setForecast(MOCK_FORECAST);
    } catch (err) {
      setError('Wetterdaten konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CloudSun className="h-5 w-5" />
            Wetter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CloudSun className="h-5 w-5" />
            Wetter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">{error || 'Keine Daten verfügbar'}</p>
            <button 
              onClick={fetchWeather}
              className="text-sm text-green-600 hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CloudSun className="h-5 w-5" />
            Wetter
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {weather.location}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="text-3xl font-bold">{weather.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{weather.description}</div>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-2">
            <Thermometer className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-medium">{weather.temperatureFeel}°C</div>
            <div className="text-xs text-muted-foreground">Gefühlt</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <Droplets className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-medium">{weather.humidity}%</div>
            <div className="text-xs text-muted-foreground">Feuchte</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <Wind className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-medium">{weather.windSpeed} km/h</div>
            <div className="text-xs text-muted-foreground">{weather.windDirection}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <Droplets className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-medium">{weather.precipitationProbability}%</div>
            <div className="text-xs text-muted-foreground">Regen</div>
          </div>
        </div>

        {/* 3-Day Forecast */}
        {forecast.length > 0 && (
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-3">3-Tage-Vorschau</div>
            <div className="flex justify-between gap-2">
              {forecast.map((day, index) => (
                <div 
                  key={index} 
                  className="flex-1 text-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default"
                >
                  <div className="text-xs text-muted-foreground mb-1">{day.dayName}</div>
                  <div className="flex justify-center mb-1">
                    {getWeatherIconSmall(day.condition)}
                  </div>
                  <div className="text-sm font-medium">
                    {day.tempHigh}° / {day.tempLow}°
                  </div>
                  {day.precipitationProbability > 20 && (
                    <div className="text-xs text-blue-500 flex items-center justify-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {day.precipitationProbability}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
