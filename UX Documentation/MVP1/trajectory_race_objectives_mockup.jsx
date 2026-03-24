import React, { useState } from 'react';
import { Plus, X, Calendar, Flag, Clock, Edit2, Trash2, ChevronRight } from 'lucide-react';

const TrajectoryRaceObjectives = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    distance: '21.1',
    goalTime: '',
    elevationGain: '',
    notes: '',
    visibility: 'visible'
  });

  // Mock data - races
  const races = [
    {
      id: 1,
      name: 'Semi-Marathon de Montpellier',
      date: '2026-05-10',
      distance: '21.1',
      elevationGain: null,
      daysLeft: 47,
      goalTime: '1h45',
      status: 'active',
      startDate: '2026-03-24',
      notes: 'Objectif principal de printemps. Viser un temps compétitif.',
      progressPercentage: 35
    },
    {
      id: 2,
      name: 'Trail des Cévennes',
      date: '2026-10-04',
      distance: '42',
      elevationGain: 2400,
      daysLeft: 194,
      goalTime: null,
      status: 'planned',
      startDate: '2026-07-01',
      notes: 'Trail long - focus sur l\'endurance et la gestion de l\'effort.',
      progressPercentage: 0
    },
    {
      id: 3,
      name: '10K Estivale de la Plage',
      date: '2026-08-15',
      distance: '10',
      elevationGain: 120,
      daysLeft: 144,
      goalTime: '40:00',
      status: 'planned',
      startDate: '2026-07-15',
      notes: null,
      progressPercentage: 0
    }
  ];

  const getDistanceLabel = (dist) => {
    const distances = {
      '10': '10K',
      '21.1': 'Semi-Marathon',
      '42.2': 'Marathon',
      '42': 'Ultra/Trail'
    };
    return distances[dist] || dist + ' km';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-blue-100 text-blue-900 border-blue-300'
      : 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getStatusLabel = (status) => {
    return status === 'active' ? 'En cours' : 'Planifié';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Save logic here
    setShowModal(false);
    setFormData({
      name: '',
      date: '',
      distance: '21.1',
      goalTime: '',
      notes: '',
      visibility: 'visible'
    });
    setEditingId(null);
  };

  const handleEdit = (race) => {
    setFormData({
      name: race.name,
      date: race.date,
      distance: race.distance,
      goalTime: race.goalTime || '',
      elevationGain: race.elevationGain ? race.elevationGain.toString() : '',
      notes: race.notes || '',
      visibility: 'visible'
    });
    setEditingId(race.id);
    setShowModal(true);
  };

  const handleNew = () => {
    setFormData({
      name: '',
      date: '',
      distance: '21.1',
      goalTime: '',
      elevationGain: '',
      notes: '',
      visibility: 'visible'
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleDelete = (raceId, raceName) => {
    setDeleteConfirm({ id: raceId, name: raceName });
  };

  const handleConfirmDelete = () => {
    // Logic to delete race
    console.log('Deleting race:', deleteConfirm.id);
    setDeleteConfirm(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
                <Flag size={32} className="text-blue-600" />
                Objectifs & Courses
              </h1>
              <p className="text-slate-600 text-sm mt-1">Manage your training targets and race calendar</p>
            </div>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              <Plus size={18} />
              Ajouter une course
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Active race highlight */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Objectif principal</h2>
          {races.filter(r => r.status === 'active').map(race => (
            <div key={race.id} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 shadow-lg relative">
              {/* Edit/Delete buttons */}
              <div className="absolute top-6 right-6 flex gap-2">
                <button
                  onClick={() => handleEdit(race)}
                  className="p-2 hover:bg-blue-500 rounded-lg transition"
                  title="Éditer"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(race.id, race.name)}
                  className="p-2 hover:bg-red-600 rounded-lg transition"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Title & Info */}
                <div className="md:col-span-2">
                  <h3 className="text-3xl font-bold mb-2">{race.name}</h3>
                  <div className="space-y-2 text-blue-100">
                    <p className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(race.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="flex items-center gap-2">
                      <Flag size={16} />
                      {getDistanceLabel(race.distance)}
                      {race.elevationGain && <span className="ml-2">• ⛰️ {race.elevationGain.toLocaleString()}m</span>}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <p className="text-sm opacity-90 font-medium mb-2">Progression du plan</p>
                  <div className="bg-blue-500/30 rounded-full h-3 mb-3 overflow-hidden">
                    <div 
                      className="bg-white h-full transition-all" 
                      style={{ width: `${race.progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-lg font-bold">{race.progressPercentage}%</p>
                </div>

                {/* Days left */}
                <div className="flex flex-col justify-center">
                  <p className="text-sm opacity-90 font-medium mb-2">Jours restants</p>
                  <p className="text-5xl font-bold">{race.daysLeft}</p>
                  {race.goalTime && (
                    <p className="text-sm opacity-80 mt-3">Objectif: {race.goalTime}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Planned races */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Courses planifiées</h2>
          <div className="space-y-3">
            {races.filter(r => r.status === 'planned').map(race => (
              <div
                key={race.id}
                className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{race.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(race.status)}`}>
                        {getStatusLabel(race.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(race.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flag size={14} />
                        {getDistanceLabel(race.distance)}
                      </span>
                      {race.elevationGain && (
                        <span className="flex items-center gap-1">
                          ⛰️ {race.elevationGain.toLocaleString()}m
                        </span>
                      )}
                      {race.goalTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          Objectif: {race.goalTime}
                        </span>
                      )}
                    </div>
                    {race.notes && (
                      <p className="text-sm text-slate-600 mt-3 italic">"{race.notes}"</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(race)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(race.id, race.name)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Planning dates */}
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 border border-slate-200 mt-3">
                  <p className="font-medium">📅 Plan d'entraînement: <span className="text-slate-900 font-semibold">{new Date(race.startDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</span> → <span className="text-slate-900 font-semibold">{new Date(race.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar view hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-medium">💡 Le plan d'entraînement s'adapte automatiquement selon tes objectifs et dates.</p>
          <p className="text-xs text-blue-800 mt-1">Chaque race crée une phase de préparation spécifique. Les activités crosstraining se distribuent automatiquement entre les semaines.</p>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-red-50 px-6 py-6">
              <h3 className="text-xl font-semibold text-red-900">Supprimer cet objectif?</h3>
            </div>
            
            <div className="px-6 py-6">
              <p className="text-slate-700 mb-2">Tu es sur le point de supprimer:</p>
              <p className="font-semibold text-slate-900 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {deleteConfirm.name}
              </p>
              <p className="text-sm text-slate-600 mb-6">
                ⚠️ Cette action est irréversible. Ton historique d'entraînement restera intact, mais l'objectif sera supprimé du calendrier.
              </p>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {editingId ? 'Modifier la course' : 'Ajouter une nouvelle course'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-blue-500 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-8 max-h-[70vh] overflow-y-auto">
              
              {/* Course name */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Nom de la course *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ex: Semi-Marathon de Montpellier"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Date de la course *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Distance */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Distance *</label>
                <select
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="10">10 km</option>
                  <option value="21.1">Semi-Marathon (21.1 km)</option>
                  <option value="42.2">Marathon (42.2 km)</option>
                  <option value="42">Ultra/Trail (42+ km)</option>
                </select>
              </div>

              {/* Goal time */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Objectif de temps — Optionnel</label>
                <input
                  type="text"
                  name="goalTime"
                  value={formData.goalTime}
                  onChange={handleInputChange}
                  placeholder="ex: 1h45 ou 3h30"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-2">Pour personnes qui veulent un objectif de temps. Laisse vide si tu vises juste la finition.</p>
              </div>

              {/* Elevation gain */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Dénivelé — Optionnel</label>
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
                <p className="text-xs text-slate-500 mt-2">Important pour les trails et courses en montagne. Impacte le plan d'entraînement.</p>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Notes & Motivation — Optionnel</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Pourquoi cette course? Tes attentes? Conditions spéciales (terrain, altitude)?"
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="text-blue-900 font-medium mb-2">📅 Planning automatique</p>
                <p className="text-blue-800 text-xs">Trajectory créera un plan d'entraînement d'au minimum 8 semaines avant la course. Si tu spécifies un dénivelé, le plan incluera des sessions de montée/descente adaptées. Tu peux gérer plusieurs courses — le plan s'adaptera automatiquement avec des phases de transition.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Flag size={18} />
                {editingId ? 'Mettre à jour' : 'Créer l\'objectif'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrajectoryRaceObjectives;
