import React, { useState } from 'react';
import { User, Zap, Heart, Navigation, MapPin, Settings, ChevronRight, Edit2, Save, X, Info, Plus, Trash2 } from 'lucide-react';

const TrajectoryProfile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Nicolas Jouve',
    age: 28,
    weight: 72,
    height: 180,
    vma: 15.2,
    fcRest: 52,
    fcMax: 190,
    experience: 'intermediate'
  });

  const [tempProfile, setTempProfile] = useState(profileData);

  const [preferences, setPreferences] = useState({
    minSessionDuration: 30,
    maxSessionDuration: 120,
    preferredTypes: ['run', 'strength'],
    trainingDaysPerWeek: 5,
    timezone: 'Europe/Paris'
  });

  const [locations, setLocations] = useState([
    { id: 1, name: 'Montpellier', default: true, elevation: 52 },
    { id: 2, name: 'Cévennes (trail)', default: false, elevation: 800 }
  ]);

  const [referenceTimesData, setReferenceTimesData] = useState([
    {
      id: 1,
      name: 'Mon 10K perso',
      type: 'run',
      distance: 10,
      elevation: null,
      time: '40:15',
      date: '2025-11-15',
      location: 'Montpellier'
    },
    {
      id: 2,
      name: 'Trail 15K Cévennes',
      type: 'trail',
      distance: 15,
      elevation: 800,
      time: '1:52:30',
      date: '2025-10-22',
      location: 'Cévennes'
    },
    {
      id: 3,
      name: 'Mon 5K fastest',
      type: 'run',
      distance: 5,
      elevation: null,
      time: '18:45',
      date: '2025-09-10',
      location: 'Montpellier'
    },
    {
      id: 4,
      name: 'Sortie vélo 50K',
      type: 'cycling',
      distance: 50,
      elevation: 600,
      time: '2:15:00',
      date: '2025-08-30',
      location: 'Cévennes'
    }
  ]);

  const [showAddRefTime, setShowAddRefTime] = useState(false);
  const [refTimeForm, setRefTimeForm] = useState({
    name: '',
    type: 'run',
    distance: '',
    elevation: '',
    time: '',
    date: new Date().toISOString().split('T')[0],
    location: 'Montpellier'
  });

  // Calculate training zones based on FC max and FC rest
  const calculateZones = () => {
    const fcMax = profileData.fcMax;
    const fcRest = profileData.fcRest;
    const reserve = fcMax - fcRest;

    return {
      z1: {
        name: 'Récupération',
        range: [fcRest + Math.round(reserve * 0.5), fcRest + Math.round(reserve * 0.6)],
        rpm: '130-150',
        description: 'Très facile, conversation aisée',
        color: 'blue',
        percentage: '50-60%'
      },
      z2: {
        name: 'Endurance facile',
        range: [fcRest + Math.round(reserve * 0.6), fcRest + Math.round(reserve * 0.7)],
        rpm: '150-160',
        description: 'Facile, parler avec effort',
        color: 'cyan',
        percentage: '60-70%'
      },
      z3: {
        name: 'Tempo/Seuil aérobie',
        range: [fcRest + Math.round(reserve * 0.7), fcRest + Math.round(reserve * 0.8)],
        rpm: '160-170',
        description: 'Modéré, parler difficile',
        color: 'yellow',
        percentage: '70-80%'
      },
      z4: {
        name: 'Seuil anaérobie',
        range: [fcRest + Math.round(reserve * 0.8), fcRest + Math.round(reserve * 0.9)],
        rpm: '170-180',
        description: 'Dur, respiration rapide',
        color: 'orange',
        percentage: '80-90%'
      },
      z5: {
        name: 'VO2 Max / Sprint',
        range: [fcRest + Math.round(reserve * 0.9), fcMax],
        rpm: '180+',
        description: 'Très intense, max effort',
        color: 'red',
        percentage: '90-100%'
      }
    };
  };

  const zones = calculateZones();

  const handleProfileChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfile);
    setIsEditingProfile(false);
  };

  const handleCancelProfile = () => {
    setTempProfile(profileData);
    setIsEditingProfile(false);
  };

  const zoneColors = {
    blue: 'from-blue-400 to-blue-600',
    cyan: 'from-cyan-400 to-blue-500',
    yellow: 'from-yellow-300 to-yellow-500',
    orange: 'from-orange-400 to-orange-600',
    red: 'from-red-400 to-red-600'
  };

  const handleAddRefTime = () => {
    const newRefTime = {
      id: Math.max(...referenceTimesData.map(t => t.id), 0) + 1,
      ...refTimeForm,
      distance: parseFloat(refTimeForm.distance),
      elevation: refTimeForm.elevation ? parseFloat(refTimeForm.elevation) : null
    };
    setReferenceTimesData(prev => [newRefTime, ...prev]);
    setRefTimeForm({
      name: '',
      type: 'run',
      distance: '',
      elevation: '',
      time: '',
      date: new Date().toISOString().split('T')[0],
      location: 'Montpellier'
    });
    setShowAddRefTime(false);
  };

  const handleDeleteRefTime = (id) => {
    setReferenceTimesData(prev => prev.filter(t => t.id !== id));
  };

  const getTypeIcon = (type) => {
    const icons = {
      run: '🏃',
      trail: '⛰️',
      cycling: '🚴',
      swimming: '🏊'
    };
    return icons[type] || '📍';
  };

  const getTypeLabel = (type) => {
    const labels = {
      run: 'Course',
      trail: 'Trail',
      cycling: 'Vélo',
      swimming: 'Natation'
    };
    return labels[type] || type;
  };

  const calculatePace = (distance, time) => {
    // Parse time format HH:MM:SS or MM:SS
    let totalSeconds = 0;
    const parts = time.split(':');
    if (parts.length === 3) {
      totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    } else if (parts.length === 2) {
      totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    
    const pace = totalSeconds / distance / 60; // en minutes
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <User size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Profil & Zones</h1>
          </div>
          <p className="text-slate-600">Paramètres personnels et zones d'entraînement calculées automatiquement</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {/* ===== PROFIL SECTION ===== */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Données personnelles</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit2 size={18} />
                Éditer
              </button>
            )}
          </div>

          {!isEditingProfile ? (
            // View mode
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Nom</p>
                  <p className="text-2xl font-bold text-slate-900">{profileData.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Âge</p>
                  <p className="text-2xl font-bold text-slate-900">{profileData.age} ans</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Poids</p>
                  <p className="text-2xl font-bold text-slate-900">{profileData.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Taille</p>
                  <p className="text-2xl font-bold text-slate-900">{profileData.height} cm</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">VMA</p>
                  <p className="text-2xl font-bold text-slate-900">{profileData.vma} km/h</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Expérience</p>
                  <p className="text-2xl font-bold text-slate-900 capitalize">{profileData.experience}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="font-semibold text-slate-900 mb-4">Fréquence cardiaque</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">FC Repos</p>
                    <p className="text-3xl font-bold text-slate-900">{profileData.fcRest} bpm</p>
                    <p className="text-xs text-slate-600 mt-1">Mesurée le matin au réveil</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">FC Max</p>
                    <p className="text-3xl font-bold text-slate-900">{profileData.fcMax} bpm</p>
                    <p className="text-xs text-slate-600 mt-1">Test d'effort ou formule: 220 - âge</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit mode
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Nom</label>
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Âge</label>
                  <input
                    type="number"
                    value={tempProfile.age}
                    onChange={(e) => handleProfileChange('age', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Poids (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempProfile.weight}
                    onChange={(e) => handleProfileChange('weight', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Taille (cm)</label>
                  <input
                    type="number"
                    value={tempProfile.height}
                    onChange={(e) => handleProfileChange('height', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">VMA (km/h)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempProfile.vma}
                    onChange={(e) => handleProfileChange('vma', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">FC Repos (bpm)</label>
                  <input
                    type="number"
                    value={tempProfile.fcRest}
                    onChange={(e) => handleProfileChange('fcRest', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">FC Max (bpm)</label>
                  <input
                    type="number"
                    value={tempProfile.fcMax}
                    onChange={(e) => handleProfileChange('fcMax', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelProfile}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-white transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Sauver
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== ZONES D'ENTRAÎNEMENT ===== */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Zones d'entraînement</h2>
          
          <div className="space-y-4 mb-8">
            {Object.entries(zones).map(([zoneId, zone]) => (
              <div
                key={zoneId}
                className={`bg-gradient-to-r ${zoneColors[zone.color]} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{zone.name}</h3>
                    <p className="text-white/90">{zone.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold opacity-90 mb-1">Effort</p>
                    <p className="text-2xl font-bold">{zone.percentage}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/30">
                  <div>
                    <p className="text-xs opacity-80 font-medium mb-1">FC (bpm)</p>
                    <p className="text-lg font-bold">{zone.range[0]}-{zone.range[1]}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80 font-medium mb-1">Allure (min/km)</p>
                    <p className="text-lg font-bold">{zone.rpm}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80 font-medium mb-1">Zone ID</p>
                    <p className="text-lg font-bold uppercase">{zoneId}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-2">Comment ça marche?</p>
                <p className="text-sm text-blue-800 mb-3">Les zones sont calculées basées sur ta FC Max et ta FC Repos selon la méthode Karvonen (réserve cardiaque).</p>
                <p className="text-xs text-blue-800">Trajectory utilise ces zones pour proposer les bonnes intensités lors des séances générées.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TEMPS DE RÉFÉRENCE ===== */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Temps de référence</h2>
            <button
              onClick={() => setShowAddRefTime(!showAddRefTime)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>

          {/* Form add ref time */}
          {showAddRefTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Nom — Optionnel</label>
                  <input
                    type="text"
                    value={refTimeForm.name}
                    onChange={(e) => setRefTimeForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ex: Mon 10K perso, Semi-marathon, Trail Cévennes"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Type *</label>
                  <select
                    value={refTimeForm.type}
                    onChange={(e) => setRefTimeForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="run">🏃 Course</option>
                    <option value="trail">⛰️ Trail</option>
                    <option value="cycling">🚴 Vélo</option>
                    <option value="swimming">🏊 Natation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Distance (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={refTimeForm.distance}
                    onChange={(e) => setRefTimeForm(prev => ({ ...prev, distance: e.target.value }))}
                    placeholder="10"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Temps *</label>
                  <input
                    type="text"
                    value={refTimeForm.time}
                    onChange={(e) => setRefTimeForm(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="40:15 ou 1:52:30"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-600 mt-1">Format: MM:SS ou HH:MM:SS</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Dénivelé (m) — Optionnel</label>
                  <input
                    type="number"
                    value={refTimeForm.elevation}
                    onChange={(e) => setRefTimeForm(prev => ({ ...prev, elevation: e.target.value }))}
                    placeholder="800"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Date *</label>
                  <input
                    type="date"
                    value={refTimeForm.date}
                    onChange={(e) => setRefTimeForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Lieu</label>
                  <select
                    value={refTimeForm.location}
                    onChange={(e) => setRefTimeForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddRefTime(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-white transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddRefTime}
                  disabled={!refTimeForm.distance || !refTimeForm.time}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  Ajouter le temps
                </button>
              </div>
            </div>
          )}

          {/* Liste des temps */}
          <div className="space-y-3">
            {referenceTimesData.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-600">
                Aucun temps de référence enregistré. Ajoute tes meilleures performances!
              </div>
            ) : (
              referenceTimesData.map(refTime => (
                <div
                  key={refTime.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-3xl">{getTypeIcon(refTime.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {refTime.name || `${getTypeLabel(refTime.type)} ${refTime.distance}km`}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {refTime.location} • {new Date(refTime.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{refTime.time}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        {calculatePace(refTime.distance, refTime.time)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1">Distance</p>
                      <p className="font-semibold text-slate-900">{refTime.distance} km</p>
                    </div>
                    {refTime.elevation && (
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">Dénivelé</p>
                        <p className="font-semibold text-slate-900">+{refTime.elevation} m</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1">Type</p>
                      <p className="font-semibold text-slate-900">{getTypeLabel(refTime.type)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Éditer</button>
                    <button
                      onClick={() => handleDeleteRefTime(refTime.id)}
                      className="ml-auto text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="font-semibold text-blue-900 mb-2">💡 Comment utiliser?</p>
            <p className="text-sm text-blue-800 mb-2">Tes temps de référence aident Trajectory à:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Calculer tes allures d'entraînement en zones</li>
              <li>✅ Calibrer la difficulté des séances proposées</li>
              <li>✅ Tracker ta progression au fil du temps</li>
              <li>✅ Adapter les objectifs de vitesse pour tes courses</li>
            </ul>
          </div>
        </div>

        {/* ===== PREFERENCES ===== */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Préférences d'entraînement</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Durée min/max des séances</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-600 mb-2">Min</p>
                  <input
                    type="number"
                    value={preferences.minSessionDuration}
                    onChange={(e) => setPreferences(prev => ({ ...prev, minSessionDuration: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-slate-600 font-bold">—</div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600 mb-2">Max</p>
                  <input
                    type="number"
                    value={preferences.maxSessionDuration}
                    onChange={(e) => setPreferences(prev => ({ ...prev, maxSessionDuration: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">Les séances proposées respecteront ces limites</p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Jours d'entraînement par semaine</label>
              <select
                value={preferences.trainingDaysPerWeek}
                onChange={(e) => setPreferences(prev => ({ ...prev, trainingDaysPerWeek: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>3 jours</option>
                <option value={4}>4 jours</option>
                <option value={5}>5 jours</option>
                <option value={6}>6 jours</option>
              </select>
              <p className="text-xs text-slate-600 mt-2">Trajectory distribuera les séances optimalement</p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Types de séances préférés</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'run', label: '🏃 Course' },
                  { id: 'cycling', label: '🚴 Vélo' },
                  { id: 'strength', label: '💪 Force' },
                  { id: 'swimming', label: '🏊 Natation' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setPreferences(prev => ({
                      ...prev,
                      preferredTypes: prev.preferredTypes.includes(type.id)
                        ? prev.preferredTypes.filter(t => t !== type.id)
                        : [...prev.preferredTypes, type.id]
                    }))}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                      preferences.preferredTypes.includes(type.id)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <button className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Sauver les préférences
              </button>
            </div>
          </div>
        </div>

        {/* ===== LOCATIONS ===== */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Mes lieux d'entraînement</h2>

          <div className="space-y-4">
            {locations.map(location => (
              <div
                key={location.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <MapPin size={24} className={location.default ? 'text-blue-600' : 'text-slate-400'} />
                  <div>
                    <h3 className="font-semibold text-slate-900">{location.name}</h3>
                    <p className="text-xs text-slate-600">Élévation: {location.elevation}m {location.default && '• Par défaut'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!location.default && (
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Par défaut</button>
                  )}
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition">
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full px-6 py-3 border-2 border-dashed border-slate-300 text-slate-900 font-medium rounded-lg hover:border-blue-400 hover:bg-blue-50 transition">
            + Ajouter un lieu
          </button>
        </div>
      </main>
    </div>
  );
};

export default TrajectoryProfile;
