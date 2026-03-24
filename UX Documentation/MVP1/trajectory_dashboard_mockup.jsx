import React, { useState } from 'react';
import { ChevronRight, Plus, CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react';

const TrajectoryDashboard = () => {
  const [selectedSession, setSelectedSession] = useState(null);

  const currentRace = {
    name: 'Semi-Marathon de Montpellier',
    date: '2026-05-10',
    daysLeft: 47,
    distance: '21.1 km'
  };

  const weekStats = {
    completedSessions: 3,
    totalSessions: 5,
    weeklyKm: 32.5,
    weeklyGoal: 40
  };

  const sessions = [
    {
      id: 1,
      date: '2026-03-24',
      dayName: 'Aujourd\'hui',
      type: 'run',
      title: 'Sortie facile',
      distance: '8 km',
      pace: '5:45-6:15',
      duration: '48-52 min',
      status: 'pending',
      adapted: false,
      description: 'Récupération après dimanche. Écoute ton corps.'
    },
    {
      id: 2,
      date: '2026-03-25',
      dayName: 'Mercredi',
      type: 'run',
      title: 'Groupe du club',
      distance: '10 km',
      pace: 'Variable',
      duration: '~60 min',
      status: 'pending',
      adapted: false,
      description: 'Sortie du groupe. Pas besoin de logger.'
    },
    {
      id: 3,
      date: '2026-03-26',
      dayName: 'Jeudi',
      type: 'strength',
      title: 'Force bas du corps',
      distance: '—',
      pace: '45 min',
      duration: '45 min',
      status: 'pending',
      adapted: false,
      description: 'Squats, fentes, renforcement chevilles. 3 séries × 8-10.'
    },
    {
      id: 4,
      date: '2026-03-27',
      dayName: 'Vendredi',
      type: 'run',
      title: 'Tempo adapté',
      distance: '10 km',
      pace: '5:15-5:45',
      duration: '54-59 min',
      status: 'pending',
      adapted: true,
      description: 'Ajusté : moins intense que prévu. Récupération prioritaire cette semaine.'
    },
    {
      id: 5,
      date: '2026-03-28',
      dayName: 'Samedi',
      type: 'rest',
      title: 'Repos',
      distance: '—',
      pace: '—',
      duration: 'Libre',
      status: 'pending',
      adapted: false,
      description: 'Étire-toi, récupère. Mobilité optionnelle.'
    },
    {
      id: 6,
      date: '2026-03-29',
      dayName: 'Dimanche',
      type: 'run',
      title: 'Sortie longue',
      distance: '16 km',
      pace: '5:45-6:15',
      duration: '92-101 min',
      status: 'pending',
      adapted: false,
      description: 'Progression progressive vers l\'objectif distance. Cadence stable.'
    },
    {
      id: 7,
      date: '2026-03-31',
      dayName: 'Lundi (sem. suivante)',
      type: 'run',
      title: 'Sortie facile',
      distance: '6 km',
      pace: '5:45-6:15',
      duration: '35-40 min',
      status: 'pending',
      adapted: false,
      description: 'Récupération. Bas du corps frais pour le resto.'
    }
  ];

  const getSessionIcon = (type) => {
    const icons = {
      run: '🏃',
      strength: '💪',
      cycling: '🚴',
      swimming: '🏊',
      rest: '😴'
    };
    return icons[type] || '📋';
  };

  const getSessionColor = (type) => {
    const colors = {
      run: 'bg-blue-50 border-blue-200',
      strength: 'bg-orange-50 border-orange-200',
      cycling: 'bg-green-50 border-green-200',
      swimming: 'bg-cyan-50 border-cyan-200',
      rest: 'bg-gray-50 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const getStatusBadge = (status, adapted) => {
    if (adapted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
          <Zap size={12} />
          Ajusté
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <CheckCircle size={12} />
          Complété
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
        <Clock size={12} />
        À faire
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Trajectory</h1>
              <p className="text-slate-600 text-sm mt-1">Lundi 24 mars 2026</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
              <Plus size={18} />
              Logger une session
            </button>
          </div>

          {/* Race target card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-5 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium">Objectif en cours</p>
              <h2 className="text-2xl font-semibold mt-1">{currentRace.name}</h2>
              <p className="text-sm opacity-80 mt-2">{currentRace.distance} • {currentRace.date}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{currentRace.daysLeft}</div>
              <p className="text-sm opacity-90">jours</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sessions plan - Main column */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📅</span>
                Plan d'entraînement (2-3 semaines)
              </h3>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
                    className={`border-l-4 ${getSessionColor(session.type)} rounded-lg p-4 cursor-pointer transition hover:shadow-md ${
                      selectedSession?.id === session.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getSessionIcon(session.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900">{session.title}</h4>
                            {session.adapted && (
                              <Zap size={14} className="text-amber-500" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{session.dayName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(session.status, session.adapted)}
                      </div>
                    </div>

                    {/* Quick info always visible */}
                    <div className="flex gap-4 text-sm text-slate-700 font-medium">
                      {session.distance !== '—' && <span>{session.distance}</span>}
                      <span>{session.duration}</span>
                      {session.pace !== '—' && <span className="text-slate-600">{session.pace}</span>}
                    </div>

                    {/* Expanded details */}
                    {selectedSession?.id === session.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-700 leading-relaxed">{session.description}</p>
                        <div className="flex gap-2 mt-4">
                          <button className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition">
                            Logger cette séance
                          </button>
                          <button className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300 transition">
                            Voir détails
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 text-sm">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Plan adapté cette semaine</p>
                <p className="text-blue-800 text-xs mt-1">Vendredi: intensity réduite pour favoriser la récupération. Vous avez complété les 3 dernières sessions avec une bonne progression.</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Weekly stats & actions */}
          <div className="lg:col-span-1">
            {/* Weekly stats */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Semaine</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-600 font-medium mb-2">Séances</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-900">{weekStats.completedSessions}/{weekStats.totalSessions}</span>
                    <span className="text-xs text-slate-600 mb-1">complétées</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${(weekStats.completedSessions / weekStats.totalSessions) * 100}%`}}
                    ></div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-600 font-medium mb-2">Kilométrage</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-900">{weekStats.weeklyKm} km</span>
                    <span className="text-xs text-slate-600 mb-1">/ {weekStats.weeklyGoal}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{width: `${(weekStats.weeklyKm / weekStats.weeklyGoal) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-sm font-medium text-slate-900 transition group">
                  <span>Logger une session</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-sm font-medium text-slate-900 transition group">
                  <span>Ajouter un objectif</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-sm font-medium text-slate-900 transition group">
                  <span>Voir météo</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600" />
                </button>
              </div>
            </div>

            {/* Next sessions preview */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">À venir</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏃</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Sortie facile</p>
                    <p className="text-xs text-slate-600">Aujourd'hui • 8 km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">💪</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Force bas corps</p>
                    <p className="text-xs text-slate-600">Jeudi • 45 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏃</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Sortie longue</p>
                    <p className="text-xs text-slate-600">Dimanche • 16 km</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrajectoryDashboard;
