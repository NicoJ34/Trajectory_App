import React, { useState } from 'react';
import { ChevronLeft, Zap, Calendar, Clock, Repeat2, Sparkles, AlertCircle } from 'lucide-react';

const TrajectorySetupSession = () => {
  const [step, setStep] = useState('type');
  const [formData, setFormData] = useState({
    sessionType: null,
    dayOfWeek: null,
    customDate: '',
    isRecurring: false,
    recurringUntil: '',
    sessionName: '',
    duration: '',
    programType: null, // 'optional', 'custom', 'ai', 'proposal'
    customProgram: '',
    notes: ''
  });

  const sessionTypes = [
    { id: 'run', label: 'Course à pied', emoji: '🏃', description: 'Sortie, tempo, fractionné, trail', examples: ['Sortie facile', 'Tempo', 'Fractionné'] },
    { id: 'cycling', label: 'Vélo', emoji: '🚴', description: 'Route, VTT, gravel', examples: ['Sortie steady', 'Interval', 'Montée'] },
    { id: 'strength', label: 'Force', emoji: '💪', description: 'Musculation, circuit', examples: ['Haut du corps', 'Bas du corps', 'Circuit'] },
    { id: 'swimming', label: 'Natation', emoji: '🏊', description: 'Piscine', examples: ['Crawl', 'Technique', 'Endurance'] },
    { id: 'crosstraining', label: 'Cross-training', emoji: '🧗', description: 'Yoga, HIIT, escalade', examples: ['Yoga', 'HIIT', 'Escalade'] },
    { id: 'rest', label: 'Repos actif', emoji: '😴', description: 'Marche, étirement', examples: ['Marche', 'Yoga léger', 'Mobilité'] }
  ];

  const daysOfWeek = [
    { id: 0, label: 'Dimanche', short: 'Dim' },
    { id: 1, label: 'Lundi', short: 'Lun' },
    { id: 2, label: 'Mardi', short: 'Mar' },
    { id: 3, label: 'Mercredi', short: 'Mer' },
    { id: 4, label: 'Jeudi', short: 'Jeu' },
    { id: 5, label: 'Vendredi', short: 'Ven' },
    { id: 6, label: 'Samedi', short: 'Sam' }
  ];

  // Mock data for Claude proposal
  const claudeProposal = {
    name: 'Sortie facile de récupération',
    duration: 45,
    program: '8 km à allure facile (5:45-6:15 min/km)\nÉcoute ton corps, pas d\'intensité',
    reasoning: [
      'Ton plan prévoyait du repos mais tu veux faire une séance',
      'Tes 3 dernières séances ont été intenses (RPE 7-8)',
      'Une sortie facile aide la récupération active',
      'Tu as 47 jours avant la Semi, on peut intensifier progressivement'
    ]
  };

  const handleSelectType = (typeId) => {
    setFormData(prev => ({ ...prev, sessionType: typeId }));
    setStep('schedule');
  };

  const handleSelectDay = (dayId) => {
    setFormData(prev => ({ ...prev, dayOfWeek: dayId, isRecurring: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 'schedule') {
      setStep('program');
    } else if (step === 'program') {
      setStep('summary');
    }
  };

  const handleBack = () => {
    if (step === 'summary') setStep('program');
    else if (step === 'program') setStep('schedule');
    else if (step === 'schedule') setStep('type');
  };

  const getSessionTypeInfo = () => sessionTypes.find(t => t.id === formData.sessionType);

  const getDayLabel = () => {
    if (formData.isRecurring && formData.dayOfWeek !== null) {
      return daysOfWeek.find(d => d.id === formData.dayOfWeek)?.label;
    }
    if (formData.customDate) {
      return new Date(formData.customDate).toLocaleDateString('fr-FR', { weekday: 'long', month: 'short', day: 'numeric' });
    }
    return '';
  };

  // ===== STEP 1: Type =====
  if (step === 'type') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-slate-900">Ajouter une séance</h1>
            <p className="text-slate-600 mt-2">En dehors de ton plan adaptatif ou en supplément</p>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">Étape 1/4 — Type</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {sessionTypes.map(type => (
              <button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className="group bg-white border-2 border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition text-left"
              >
                <span className="text-4xl mb-3 block">{type.emoji}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{type.label}</h3>
                <p className="text-sm text-slate-600 mb-3">{type.description}</p>
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((ex, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{ex}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ===== STEP 2: Schedule =====
  if (step === 'schedule') {
    const sessionType = getSessionTypeInfo();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button onClick={handleBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
              <ChevronLeft size={20} /> Retour
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Quand?</h1>
            <div className="flex items-center gap-2 mt-2 text-slate-600">
              <span className="text-2xl">{sessionType?.emoji}</span>
              <p>{sessionType?.label}</p>
            </div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">Étape 2/4 — Planning</p>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">Séance récurrente?</label>
              <button
                onClick={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring, customDate: '' }))}
                className={`relative inline-flex h-7 w-12 rounded-full transition ${formData.isRecurring ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-6 w-6 rounded-full bg-white transition transform ${formData.isRecurring ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {formData.isRecurring ? (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-900 mb-4">Quel jour?</label>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day.id}
                      onClick={() => handleSelectDay(day.id)}
                      className={`py-3 rounded-lg border-2 font-medium transition text-center ${
                        formData.dayOfWeek === day.id
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Date</label>
                <input
                  type="date"
                  name="customDate"
                  value={formData.customDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Nom — Optionnel</label>
              <input
                type="text"
                name="sessionName"
                value={formData.sessionName}
                onChange={handleInputChange}
                placeholder={`ex: ${getSessionTypeInfo()?.examples[0]}`}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Durée — Optionnel</label>
              <div className="relative">
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="45"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <span className="absolute right-4 top-3 text-slate-500 font-medium">min</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={handleBack} className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50">Retour</button>
            <button onClick={handleNext} disabled={!formData.dayOfWeek && !formData.customDate} className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">Continuer</button>
          </div>
        </main>
      </div>
    );
  }

  // ===== STEP 3: Program =====
  if (step === 'program') {
    const sessionType = getSessionTypeInfo();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button onClick={handleBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
              <ChevronLeft size={20} /> Retour
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Programme</h1>
            <p className="text-slate-600 mt-2">Optionnel — libre, personnalisé, Claude-généré, ou proposé</p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">Étape 3/4 — Plan</p>

          {/* 4 OPTIONS */}
          <div className="space-y-4 mb-8">
            {/* Option 1 */}
            <button
              onClick={() => setFormData(prev => ({ ...prev, programType: 'optional' }))}
              className={`w-full p-6 rounded-xl border-2 transition text-left ${
                formData.programType === 'optional'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">✨</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Séance libre</h3>
                  <p className="text-sm text-slate-600">Pas de programme. Juste un créneau au planning.</p>
                </div>
              </div>
            </button>

            {/* Option 2 */}
            <button
              onClick={() => setFormData(prev => ({ ...prev, programType: 'custom' }))}
              className={`w-full p-6 rounded-xl border-2 transition text-left ${
                formData.programType === 'custom'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">📝</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Programme personnalisé</h3>
                  <p className="text-sm text-slate-600">Tu fournis ton propre programme (distances, temps, exercices).</p>
                </div>
              </div>
            </button>

            {/* Option 3 */}
            <button
              onClick={() => setFormData(prev => ({ ...prev, programType: 'ai' }))}
              className={`w-full p-6 rounded-xl border-2 transition text-left ${
                formData.programType === 'ai'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Générer avec Claude</h3>
                  <p className="text-sm text-slate-600">Décris ce que tu veux, Claude crée un programme d'entraînement adapté.</p>
                </div>
              </div>
            </button>

            {/* Option 4 - THE NEW ONE */}
            <button
              onClick={() => setFormData(prev => ({ ...prev, programType: 'proposal' }))}
              className={`w-full p-6 rounded-xl border-2 transition text-left relative overflow-hidden ${
                formData.programType === 'proposal'
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">Smart</div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Proposition intelligente</h3>
                  <p className="text-sm text-slate-600">Claude propose quelque chose basé sur ton plan et tes performances récentes.</p>
                </div>
              </div>
            </button>
          </div>

          {/* CONTENU DYNAMIQUE SELON LA SÉLECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
            
            {formData.programType === 'optional' && (
              <div className="text-center py-6 text-slate-600">
                Aucun programme à remplir. Continue pour finir la configuration.
              </div>
            )}

            {formData.programType === 'custom' && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Décris ton programme</label>
                <textarea
                  name="customProgram"
                  value={formData.customProgram}
                  onChange={handleInputChange}
                  placeholder="ex: 5 km échauffement\n5×2km à allure 10K\n2 km retour au calme"
                  rows="8"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm font-mono"
                />
              </div>
            )}

            {formData.programType === 'ai' && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Que veux-tu?</label>
                <textarea
                  name="customProgram"
                  value={formData.customProgram}
                  onChange={handleInputChange}
                  placeholder="ex: Séance de force pour les jambes\nDurée: 45 min\nNiveau intermédiaire\nFocus: quads, fessiers"
                  rows="6"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button className="mt-4 w-full px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2">
                  <Sparkles size={16} /> Générer
                </button>
              </div>
            )}

            {formData.programType === 'proposal' && (
              <div>
                <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">📌 Proposition de Claude</h4>
                  <div className="bg-white rounded-lg p-4 mb-4 border border-amber-200">
                    <p className="text-sm font-medium text-slate-900 mb-2">{claudeProposal.name}</p>
                    <p className="text-xs text-slate-600 mb-3">Durée: {claudeProposal.duration} min</p>
                    <p className="text-sm whitespace-pre-wrap font-mono text-slate-700">{claudeProposal.program}</p>
                  </div>
                  
                  <div className="border-t border-amber-200 pt-4">
                    <p className="text-xs font-semibold text-amber-900 mb-2 uppercase">Pourquoi?</p>
                    <ul className="space-y-1">
                      {claudeProposal.reasoning.map((r, i) => (
                        <li key={i} className="text-xs text-amber-800">• {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-amber-100 text-amber-900 font-medium rounded-lg hover:bg-amber-200 flex items-center justify-center gap-2">
                    <Zap size={16} /> Accepter cette proposition
                  </button>
                  <button className="w-full px-4 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50">
                    Voir d'autres options
                  </button>
                  <button className="w-full px-4 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50">
                    Modifier
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50">Retour</button>
            <button onClick={handleNext} className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Résumé</button>
          </div>
        </main>
      </div>
    );
  }

  // ===== STEP 4: Summary =====
  if (step === 'summary') {
    const sessionType = getSessionTypeInfo();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button onClick={handleBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
              <ChevronLeft size={20} /> Retour
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Résumé</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">Étape 4/4 — Confirmation</p>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{sessionType?.emoji}</span>
              <div>
                <h2 className="text-3xl font-bold">{formData.sessionName || sessionType?.label}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-2">Quand</p>
                <p className="text-xl font-bold">{getDayLabel()}</p>
              </div>
              {formData.duration && (
                <div>
                  <p className="text-blue-100 text-sm mb-2">Durée</p>
                  <p className="text-xl font-bold">{formData.duration} min</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {formData.programType && formData.programType !== 'optional' && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <p className="text-sm font-semibold text-slate-600 mb-3 uppercase">Programme</p>
                {formData.programType === 'proposal' && (
                  <p className="text-xs text-amber-700 mb-2 flex items-center gap-1"><Zap size={12} /> Proposition Claude</p>
                )}
                <div className="bg-slate-50 rounded-lg p-4 whitespace-pre-wrap text-sm font-mono text-slate-700 max-h-48 overflow-y-auto">
                  {formData.customProgram || claudeProposal.program}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50">Modifier</button>
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <Zap size={18} /> Créer la séance
            </button>
          </div>
        </main>
      </div>
    );
  }
};

export default TrajectorySetupSession;
