import React, { useState } from 'react';
import { X, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';

const TrajectoryLogger = () => {
  const [formData, setFormData] = useState({
    title: 'Sortie facile',
    distance: '8.0',
    duration: '47',
    durationSeconds: '30',
    rpe: 4,
    elevationGain: '',
    notes: '',
    conditions: [],
    feeling: 'good'
  });

  const [step, setStep] = useState('session'); // 'session' or 'confirm'
  const [savedMessage, setSavedMessage] = useState(false);

  const session = {
    id: 1,
    date: '2026-03-24',
    dayName: 'Aujourd\'hui',
    type: 'run',
    title: 'Sortie facile',
    plannedDistance: '8 km',
    plannedPace: '5:45-6:15',
    plannedDuration: '48-52 min',
    description: 'Récupération après dimanche. Écoute ton corps.'
  };

  const conditionOptions = [
    { id: 'sunny', label: '☀️ Ensoleillé', emoji: '☀️' },
    { id: 'cloudy', label: '☁️ Nuageux', emoji: '☁️' },
    { id: 'rainy', label: '🌧️ Pluie', emoji: '🌧️' },
    { id: 'windy', label: '💨 Venteux', emoji: '💨' },
    { id: 'hot', label: '🔥 Chaud', emoji: '🔥' },
    { id: 'cold', label: '❄️ Froid', emoji: '❄️' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRPEChange = (value) => {
    setFormData(prev => ({
      ...prev,
      rpe: value
    }));
  };

  const toggleCondition = (conditionId) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(conditionId)
        ? prev.conditions.filter(c => c !== conditionId)
        : [...prev.conditions, conditionId]
    }));
  };

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      setStep('session');
      // Reset form
      setFormData({
        title: 'Sortie facile',
        distance: '8.0',
        duration: '47',
        durationSeconds: '30',
        rpe: 4,
        elevationGain: '',
        notes: '',
        conditions: [],
        feeling: 'good'
      });
    }, 2000);
  };

  const estimatedPace = formData.distance && formData.duration 
    ? (parseFloat(formData.duration) / parseFloat(formData.distance)).toFixed(2)
    : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Modal container */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Logger la séance</h2>
            <p className="text-blue-100 text-sm mt-1">{session.dayName} • {session.title}</p>
          </div>
          <button className="p-2 hover:bg-blue-500 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Session summary card */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🏃</span>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{session.title}</h3>
              <p className="text-sm text-slate-600 mt-1">Plan: {session.plannedDistance} • {session.plannedDuration}</p>
              <p className="text-xs text-slate-600 mt-2">{session.description}</p>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="px-6 py-8 max-h-[70vh] overflow-y-auto">
          
          {/* Title Section */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">Titre de la séance</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="ex: Sortie facile au parc"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-medium"
            />
            <p className="text-xs text-slate-500 mt-2">Pour retrouver ta séance plus tard</p>
          </div>

          {/* Distance & Time Section */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Performance</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Distance */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Distance (km)</label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Durée</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="0"
                    max="999"
                    className="flex-1 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-center"
                    placeholder="mm"
                  />
                  <span className="flex items-center text-slate-600 font-medium">:</span>
                  <input
                    type="number"
                    name="durationSeconds"
                    value={formData.durationSeconds}
                    onChange={handleInputChange}
                    min="0"
                    max="59"
                    className="w-16 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-center"
                    placeholder="ss"
                  />
                </div>
              </div>
            </div>

            {/* Pace calculation */}
            <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center border border-slate-200">
              <div>
                <p className="text-xs text-slate-600 font-medium">Allure moyenne</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{estimatedPace} min/km</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600 font-medium">Plan</p>
                <p className="text-sm font-semibold text-blue-600 mt-1">5:45-6:15</p>
              </div>
            </div>
          </div>

          {/* Elevation */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">Élévation (m) — Optionnel</label>
            <input
              type="number"
              name="elevationGain"
              value={formData.elevationGain}
              onChange={handleInputChange}
              min="0"
              placeholder="ex: 250"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* RPE - Rate of Perceived Exertion */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Effort ressenti (1-10)</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleRPEChange(num)}
                    className={`w-8 h-12 rounded-lg font-bold transition ${
                      formData.rpe === num
                        ? 'bg-blue-600 text-white scale-110'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-600 text-center mt-2">
                {formData.rpe <= 3 && '💚 Facile'}
                {formData.rpe > 3 && formData.rpe <= 6 && '🟡 Modéré'}
                {formData.rpe > 6 && formData.rpe <= 8 && '🟠 Dur'}
                {formData.rpe > 8 && '❤️ Très difficile'}
              </p>
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Conditions météo</h4>
            <div className="grid grid-cols-3 gap-2">
              {conditionOptions.map((cond) => (
                <button
                  key={cond.id}
                  onClick={() => toggleCondition(cond.id)}
                  className={`py-3 px-3 rounded-lg border transition text-center text-sm font-medium ${
                    formData.conditions.includes(cond.id)
                      ? 'bg-blue-100 border-blue-400 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg block mb-1">{cond.emoji}</span>
                  {cond.label.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Feeling */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Sensation globale</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'poor', emoji: '😫', label: 'Pas bien' },
                { id: 'okay', emoji: '😐', label: 'Correct' },
                { id: 'good', emoji: '😊', label: 'Bien' },
                { id: 'great', emoji: '🔥', label: 'Excellent' }
              ].map((feeling) => (
                <button
                  key={feeling.id}
                  onClick={() => setFormData(prev => ({ ...prev, feeling: feeling.id }))}
                  className={`py-4 rounded-lg border transition text-center ${
                    formData.feeling === feeling.id
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-3xl block mb-2">{feeling.emoji}</span>
                  <span className="text-xs font-medium text-slate-700">{feeling.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">Notes — Optionnel</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Douleurs, sensations, observations..."
              rows="4"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex gap-3">
          <button className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition">
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Sauver
          </button>
        </div>

        {/* Success message */}
        {savedMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
            <div className="bg-white rounded-xl p-6 text-center">
              <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-900">Séance enregistrée!</h3>
              <p className="text-slate-600 text-sm mt-2">Données sauvegardées localement</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrajectoryLogger;
