import React, { useState } from 'react';
import { ArrowRight, Flag, Calendar, MapPin, Zap, ChevronLeft } from 'lucide-react';

const TrajectoryCreateObjective = () => {
  const [step, setStep] = useState('distance'); // 'distance', 'details', 'summary'
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    distance: null,
    goalTime: '',
    elevationGain: '',
    notes: '',
    customDistance: ''
  });

  const distanceOptions = [
    {
      id: '10',
      label: '10K',
      distance: 10,
      emoji: '🏃',
      description: 'Course courte',
      typical: '45-60 min',
      prep: '4-8 semaines'
    },
    {
      id: '21.1',
      label: 'Semi-Marathon',
      distance: 21.1,
      emoji: '🏃‍♂️',
      description: 'Distance classique',
      typical: '1h30-2h30',
      prep: '8-12 semaines'
    },
    {
      id: '42.2',
      label: 'Marathon',
      distance: 42.2,
      emoji: '🏁',
      description: 'L\'ultime',
      typical: '3h-5h',
      prep: '12-16 semaines'
    },
    {
      id: 'custom',
      label: 'Trail/Custom',
      distance: null,
      emoji: '⛰️',
      description: 'Distance personnalisée',
      typical: 'Varies',
      prep: 'Varies'
    }
  ];

  const handleSelectDistance = (distId) => {
    if (distId === 'custom') {
      setFormData(prev => ({ ...prev, distance: 'custom', customDistance: '' }));
    } else {
      setFormData(prev => ({ ...prev, distance: distId, customDistance: '' }));
    }
    setStep('details');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = () => {
    // Validation
    if (!formData.name || !formData.date) {
      alert('Remplis au moins le nom et la date');
      return;
    }
    setStep('summary');
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('distance');
    } else if (step === 'summary') {
      setStep('details');
    }
  };

  const getSelectedDistanceLabel = () => {
    if (formData.distance === 'custom') {
      return formData.customDistance ? `${formData.customDistance} km` : 'À définir';
    }
    const selected = distanceOptions.find(d => d.id === formData.distance);
    return selected ? selected.label : '';
  };

  const getRaceDate = () => {
    if (!formData.date) return '';
    return new Date(formData.date).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilRace = () => {
    if (!formData.date) return 0;
    const today = new Date();
    const raceDate = new Date(formData.date);
    const diff = raceDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // ===== STEP 1: Distance Selection =====
  if (step === 'distance') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-4">
              <Flag size={32} className="text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">Créer un nouvel objectif</h1>
            </div>
            <p className="text-slate-600">Choisis la distance de ta course pour que Trajectory adapte le plan d'entraînement</p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-6">Étape 1/3 — Sélectionne la distance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {distanceOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelectDistance(option.id)}
                className="group relative bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition text-left overflow-hidden"
              >
                {/* Gradient bg on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl">{option.emoji}</span>
                    <ArrowRight size={20} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{option.label}</h3>
                  <p className="text-sm text-slate-600 mb-4">{option.description}</p>
                  
                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-4">
                    <p><span className="font-medium">Durée typique:</span> {option.typical}</p>
                    <p><span className="font-medium">Préparation:</span> {option.prep}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
            <p className="text-sm font-semibold text-blue-900 mb-2">💡 Pas sûr?</p>
            <p className="text-sm text-blue-800">Trajectory crée un plan d'entraînement minimum 8 semaines avant ta course. Tu peux avoir plusieurs objectifs à la fois — le plan les gère automatiquement.</p>
          </div>
        </main>
      </div>
    );
  }

  // ===== STEP 2: Détails =====
  if (step === 'details') {
    const selectedOption = distanceOptions.find(d => d.id === formData.distance);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition"
            >
              <ChevronLeft size={20} />
              Retour
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Détails de la course</h1>
            <p className="text-slate-600 mt-2">
              {selectedOption?.label}
              {formData.distance === 'custom' && formData.customDistance && ` • ${formData.customDistance} km`}
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">Étape 2/3 — Complète les détails</p>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            
            {/* Custom distance field (if selected) */}
            {formData.distance === 'custom' && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Distance (km) *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="customDistance"
                    value={formData.customDistance}
                    onChange={handleInputChange}
                    placeholder="ex: 42, 80, 100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                    step="0.1"
                    min="1"
                  />
                  <span className="absolute right-4 top-3 text-slate-500 font-medium">km</span>
                </div>
              </div>
            )}

            {/* Race name */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Nom de la course *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="ex: Semi-Marathon de Montpellier, Trail des Cévennes"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <p className="text-xs text-slate-500 mt-2">Sois descriptif — tu voudras retrouver cette course plus tard</p>
            </div>

            {/* Race date */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Date de la course *</label>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.date && getDaysUntilRace() > 0 && (
                  <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-900 whitespace-nowrap">
                    {getDaysUntilRace()} jours
                  </div>
                )}
              </div>
            </div>

            {/* Goal time */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Objectif de temps — Optionnel</label>
              <input
                type="text"
                name="goalTime"
                value={formData.goalTime}
                onChange={handleInputChange}
                placeholder="ex: 1h45, 3h30, sub-4h"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-2">Laisse vide si tu vises juste la finition</p>
            </div>

            {/* Elevation gain */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Dénivelé — Optionnel</label>
              <div className="relative">
                <input
                  type="number"
                  name="elevationGain"
                  value={formData.elevationGain}
                  onChange={handleInputChange}
                  placeholder="ex: 2400"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <span className="absolute right-4 top-3 text-slate-500 font-medium">m</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Important pour les trails — impacte le plan d'entraînement</p>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Notes & Motivation — Optionnel</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Pourquoi cette course? Terrain? Altitude? Aspirations?"
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Auto-planning info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-900 font-medium">
                📅 Plan automatique {formData.date && `à partir du ${new Date(formData.date).getDay() === 3 ? 'mercredi avant' : '8 semaines avant'}`}
              </p>
              <p className="text-xs text-blue-800 mt-1">Trajectory crée un plan d'entraînement adapté. Les sessions s'ajustent selon tes performances réelles chaque semaine.</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Retour
            </button>
            <button
              onClick={handleCreate}
              disabled={!formData.name || !formData.date}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              Voir le résumé
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ===== STEP 3: Summary =====
  if (step === 'summary') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition"
            >
              <ChevronLeft size={20} />
              Retour
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Résumé de ton objectif</h1>
            <p className="text-slate-600 mt-2">Vérifie avant de confirmer</p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">Étape 3/3 — Confirmation</p>

          {/* Summary card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 mb-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-8">{formData.name}</h2>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Distance</p>
                <p className="text-2xl font-bold">{getSelectedDistanceLabel()}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Date</p>
                <p className="text-2xl font-bold">{getRaceDate()}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Jours restants</p>
                <p className="text-2xl font-bold">{getDaysUntilRace()}</p>
              </div>
              {formData.goalTime && (
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Objectif</p>
                  <p className="text-2xl font-bold">{formData.goalTime}</p>
                </div>
              )}
            </div>

            {formData.elevationGain && (
              <div className="border-t border-blue-400 pt-6 mb-0">
                <p className="text-blue-100 text-sm font-medium mb-2">⛰️ Dénivelé</p>
                <p className="text-2xl font-bold">{formData.elevationGain} m</p>
              </div>
            )}
          </div>

          {/* Details sections */}
          <div className="space-y-4 mb-8">
            {formData.notes && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Notes</p>
                <p className="text-slate-900 italic">"{formData.notes}"</p>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Plan d'entraînement</p>
              <div className="space-y-2 text-sm text-slate-700">
                <p>✅ Durée minimale: 8 semaines</p>
                <p>✅ Adaptatif: s'ajuste chaque semaine selon tes performances</p>
                <p>✅ Incluera des séances de renforcement et activités croisées</p>
                {formData.elevationGain && <p>✅ Intègre des montées/descentes adaptées au dénivelé</p>}
                <p>✅ Sessions loggées = ajustements automatiques</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <p className="text-sm font-semibold text-amber-900 mb-3">⚠️ À savoir</p>
              <ul className="text-xs text-amber-800 space-y-2">
                <li>• Le plan commence 8 semaines avant ta course (minimum)</li>
                <li>• Si tu as plusieurs objectifs, le plan les réconcilie automatiquement</li>
                <li>• Tu peux modifier l'objectif à tout moment</li>
                <li>• Toutes les données restent locales sur ton appareil</li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Modifier
            </button>
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <Flag size={18} />
              Créer l'objectif
            </button>
          </div>
        </main>
      </div>
    );
  }
};

export default TrajectoryCreateObjective;
