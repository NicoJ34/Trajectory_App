import React, { useState } from 'react';
import { Cloud, CloudRain, Wind, AlertTriangle, Sun, Eye, Droplets, Thermometer, ChevronRight, Lock, MapPin, Navigation } from 'lucide-react';

const TrajectoryWeather = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [lockedSessions, setLockedSessions] = useState({});

  const toggleLockSession = (sessionId) => {
    setLockedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  // Mock weather data
  const weatherData = [
    {
      date: '2026-03-24',
      day: 'Aujourd\'hui',
      temp: 14,
      tempMin: 10,
      tempMax: 16,
      condition: 'Nuageux',
      icon: 'cloud',
      humidity: 65,
      wind: 8,
      windGust: 15,
      visibility: 15,
      uvIndex: 3,
      sessions: [
        {
          id: 1,
          time: '18:30',
          name: 'Sortie facile',
          type: 'run',
          distance: '8 km',
          weather: 'acceptable',
          suggestion: null
        }
      ],
      alerts: []
    },
    {
      date: '2026-03-25',
      day: 'Mercredi',
      temp: 12,
      tempMin: 8,
      tempMax: 14,
      condition: 'Pluie modérée',
      icon: 'rain',
      humidity: 85,
      wind: 12,
      windGust: 22,
      visibility: 8,
      uvIndex: 1,
      sessions: [
        {
          id: 2,
          time: '19:00',
          name: 'Groupe du club',
          type: 'run',
          distance: '10 km',
          weather: 'challenging',
          suggestion: 'Pluie prévue - apporte un gilet imperméable'
        }
      ],
      alerts: [
        {
          id: 'rain-alert',
          type: 'rain',
          severity: 'medium',
          title: 'Pluie modérée',
          message: 'Entre 14h et 20h. Prévois un vêtement imperméable.',
          emoji: '🌧️'
        }
      ]
    },
    {
      date: '2026-03-26',
      day: 'Jeudi',
      temp: 16,
      tempMin: 12,
      tempMax: 18,
      condition: 'Venteux',
      icon: 'wind',
      humidity: 60,
      wind: 18,
      windGust: 28,
      visibility: 12,
      uvIndex: 4,
      sessions: [
        {
          id: 3,
          time: '19:30',
          name: 'Force bas du corps',
          type: 'strength',
          duration: '45 min',
          weather: 'ideal',
          suggestion: null
        }
      ],
      alerts: [
        {
          id: 'wind-alert',
          type: 'wind',
          severity: 'high',
          title: 'Vent très fort',
          message: 'Rafales jusqu\'à 28 km/h. Idéal pour travailler la stabilité en sortie. Ou faire indoor.',
          emoji: '💨'
        }
      ]
    },
    {
      date: '2026-03-27',
      day: 'Vendredi',
      temp: 18,
      tempMin: 14,
      tempMax: 20,
      condition: 'Ensoleillé',
      icon: 'sun',
      humidity: 50,
      wind: 6,
      windGust: 12,
      visibility: 20,
      uvIndex: 6,
      sessions: [
        {
          id: 4,
          time: '08:00',
          name: 'Tempo adapté',
          type: 'run',
          distance: '10 km',
          weather: 'excellent',
          suggestion: 'Crème solaire recommandée (UV index 6)'
        }
      ],
      alerts: [
        {
          id: 'sun-alert',
          type: 'sun',
          severity: 'medium',
          title: 'UV index élevé',
          message: 'Indice 6. Applique une crème solaire et reste hydraté.',
          emoji: '☀️'
        }
      ]
    },
    {
      date: '2026-03-29',
      day: 'Dimanche',
      temp: 16,
      tempMin: 13,
      tempMax: 19,
      condition: 'Dégagé',
      icon: 'sun',
      humidity: 55,
      wind: 5,
      windGust: 10,
      visibility: 20,
      uvIndex: 5,
      sessions: [
        {
          id: 5,
          time: '09:00',
          name: 'Sortie longue',
          type: 'run',
          distance: '16 km',
          weather: 'excellent',
          suggestion: null
        }
      ],
      alerts: []
    }
  ];

  const getWeatherIcon = (iconType) => {
    const icons = {
      cloud: <Cloud size={32} className="text-slate-400" />,
      rain: <CloudRain size={32} className="text-blue-500" />,
      sun: <Sun size={32} className="text-amber-400" />,
      wind: <Wind size={32} className="text-slate-500" />
    };
    return icons[iconType] || <Cloud size={32} />;
  };

  const getWeatherColor = (weather) => {
    const colors = {
      excellent: 'bg-green-50 border-green-200',
      acceptable: 'bg-blue-50 border-blue-200',
      challenging: 'bg-amber-50 border-amber-200',
      poor: 'bg-red-50 border-red-200'
    };
    return colors[weather] || 'bg-slate-50 border-slate-200';
  };

  const getWeatherLabel = (weather) => {
    const labels = {
      excellent: '✅ Idéales',
      acceptable: '🟢 Acceptables',
      challenging: '🟠 Difficiles',
      poor: '❌ Mauvaises'
    };
    return labels[weather] || 'N/A';
  };

  const getAlertColor = (type) => {
    const colors = {
      rain: 'bg-blue-50 border-blue-200 text-blue-900',
      wind: 'bg-slate-50 border-slate-200 text-slate-900',
      sun: 'bg-amber-50 border-amber-200 text-amber-900',
      heat: 'bg-red-50 border-red-200 text-red-900',
      cold: 'bg-cyan-50 border-cyan-200 text-cyan-900'
    };
    return colors[type] || 'bg-slate-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Cloud size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Météo & Séances</h1>
          </div>
          <p className="text-slate-600">Vois la météo prévue et les suggestions intelligentes pour tes séances</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Summary alerts */}
        {weatherData.some(d => d.alerts.length > 0) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Alertes & Suggestions</h2>
            <div className="space-y-3">
              {weatherData.map(day => 
                day.alerts.map(alert => (
                  <div
                    key={`${day.date}-${alert.id}`}
                    className={`border-l-4 border-l-blue-500 rounded-lg p-4 cursor-pointer hover:shadow-md transition ${getAlertColor(alert.type)}`}
                    onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{alert.emoji}</span>
                        <div>
                          <h3 className="font-semibold mb-1">{alert.title}</h3>
                          <p className="text-sm">{alert.message}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className={`transition ${expandedAlert === alert.id ? 'rotate-90' : ''}`} />
                    </div>

                    {/* Expanded suggestions */}
                    {expandedAlert === alert.id && (
                      <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                        <p className="text-sm font-semibold mb-3">💡 Suggestions:</p>
                        <ul className="space-y-2 text-sm">
                          {alert.type === 'rain' && (
                            <>
                              <li>• Apporte un gilet imperméable ou une veste de pluie</li>
                              <li>• Considère une séance indoor (vélo indoor, force)</li>
                              <li>• Tes chaussures vont être mouillées → sèche-les bien après</li>
                            </>
                          )}
                          {alert.type === 'wind' && (
                            <>
                              <li>• Idéal pour travailler la stabilité et la cadence</li>
                              <li>• Possible d'aller en indoor si tu préfères</li>
                              <li>• Protège tes yeux (lunettes)</li>
                            </>
                          )}
                          {alert.type === 'sun' && (
                            <>
                              <li>• Crème solaire SPF 50+ (renouvelle toutes les 2h)</li>
                              <li>• Hydrate-toi plus que d'habitude</li>
                              <li>• Considère un départ tôt le matin (avant 11h)</li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Weather timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Prévisions (2 semaines)</h2>
          <div className="space-y-6">
            {weatherData.map((day, idx) => (
              <div
                key={day.date}
                className="bg-white border border-slate-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition"
                onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}
              >
                {/* Day header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <p className="font-semibold text-slate-900">{day.day}</p>
                      <p className="text-xs text-slate-500">{new Date(day.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(day.icon)}
                      <div>
                        <p className="font-semibold text-slate-900">{day.temp}°</p>
                        <p className="text-sm text-slate-600">{day.condition}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600 mb-1">Min • Max</p>
                    <p className="font-semibold text-slate-900">{day.tempMin}° • {day.tempMax}°</p>
                  </div>
                </div>

                {/* Quick weather details */}
                <div className="grid grid-cols-5 gap-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="text-center">
                    <Droplets size={16} className="mx-auto mb-1 text-blue-500" />
                    <p className="text-xs text-slate-600">Humidité</p>
                    <p className="text-sm font-semibold text-slate-900">{day.humidity}%</p>
                  </div>
                  <div className="text-center">
                    <Wind size={16} className="mx-auto mb-1 text-slate-600" />
                    <p className="text-xs text-slate-600">Vent</p>
                    <p className="text-sm font-semibold text-slate-900">{day.wind} km/h</p>
                  </div>
                  <div className="text-center">
                    <AlertTriangle size={16} className="mx-auto mb-1 text-slate-600" />
                    <p className="text-xs text-slate-600">Rafales</p>
                    <p className="text-sm font-semibold text-slate-900">{day.windGust} km/h</p>
                  </div>
                  <div className="text-center">
                    <Eye size={16} className="mx-auto mb-1 text-slate-600" />
                    <p className="text-xs text-slate-600">Visibilité</p>
                    <p className="text-sm font-semibold text-slate-900">{day.visibility} km</p>
                  </div>
                  <div className="text-center">
                    <Sun size={16} className="mx-auto mb-1 text-amber-500" />
                    <p className="text-xs text-slate-600">UV Index</p>
                    <p className="text-sm font-semibold text-slate-900">{day.uvIndex}</p>
                  </div>
                </div>

                {/* Sessions for this day */}
                {day.sessions.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-3">Séances prévues</p>
                    <div className="space-y-3">
                      {day.sessions.map(session => (
                        <div
                          key={session.id}
                          className={`border border-slate-200 rounded-lg p-4 ${getWeatherColor(session.weather)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-2xl">
                                {session.type === 'run' ? '🏃' : session.type === 'cycling' ? '🚴' : '💪'}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{session.name}</p>
                                <p className="text-xs text-slate-600">{session.time} • {session.distance || session.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/80">
                                {getWeatherLabel(session.weather)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLockSession(session.id);
                                }}
                                className={`p-2 rounded-lg transition ${
                                  lockedSessions[session.id]
                                    ? 'bg-slate-200 text-slate-700'
                                    : 'bg-white text-slate-400 hover:bg-slate-100'
                                }`}
                                title={lockedSessions[session.id] ? 'Déverrouiller' : 'Verrouiller'}
                              >
                                <Lock size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Suggestion if any */}
                          {session.suggestion && (
                            <div className="mt-3 pt-3 border-t border-current border-opacity-20 text-sm">
                              💡 {session.suggestion}
                            </div>
                          )}

                          {/* Action buttons */}
                          {!lockedSessions[session.id] && (
                            <div className="flex gap-2 mt-3">
                              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Adapter</button>
                              <button className="text-xs font-medium text-slate-600 hover:text-slate-700">Indoor alternative</button>
                            </div>
                          )}
                          {lockedSessions[session.id] && (
                            <p className="text-xs text-slate-600 mt-3">🔒 Verrouillée — pas d'adaptation même si météo change</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
          <p className="font-semibold text-blue-900 mb-2">🌦️ Comment ça marche?</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Données météo actualisées chaque jour (source: Open-Meteo)</li>
            <li>✅ Suggestions intelligentes pour adapter tes séances sans perdre ton objectif</li>
            <li>✅ Alertes pour vent fort, pluie, UV élevé, etc.</li>
            <li>✅ Suggestions d'alternatives indoor si conditions difficiles</li>
            <li>✅ Verrouille une séance si tu ne veux pas la modifier</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default TrajectoryWeather;
