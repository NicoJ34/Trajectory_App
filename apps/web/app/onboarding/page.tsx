'use client'

import { useState } from 'react'
import type { ExperienceLevel, Terrain, RaceDistance, CrossTraining, Units } from '@trajectory/shared'
import ProgressBar from './components/ProgressBar'
import Step1Profile from './components/Step1Profile'
import Step2Race from './components/Step2Race'
import Step3Preferences from './components/Step3Preferences'
import Step4Preview from './components/Step4Preview'

interface ProfileData {
  experience?: ExperienceLevel
  weeklyVolume?: number
  availableDays?: number
  terrain?: Terrain
  injuries?: string
}

interface RaceData {
  distance?: RaceDistance
  distanceKm?: number
  targetDate?: string
  name?: string
  elevationGain?: number
}

interface PreferencesData {
  preferredLongRunDay?: 'saturday' | 'sunday'
  crossTraining?: CrossTraining
  units?: Units
}

type Step = 1 | 2 | 3 | 4

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1)
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [raceData, setRaceData] = useState<RaceData>({})
  const [prefsData, setPrefsData] = useState<PreferencesData>({})

  // Profil complet pour Step4 (fusionné profileData + prefsData)
  const fullProfile = {
    experience: profileData.experience!,
    weeklyVolume: profileData.weeklyVolume!,
    availableDays: profileData.availableDays!,
    terrain: profileData.terrain ?? 'road' as Terrain,
    injuries: profileData.injuries,
    preferredLongRunDay: prefsData.preferredLongRunDay!,
    crossTraining: prefsData.crossTraining!,
    units: prefsData.units!,
  }

  const fullRace = {
    distance: raceData.distance!,
    distanceKm: raceData.distanceKm!,
    targetDate: raceData.targetDate!,
    name: raceData.name,
    elevationGain: raceData.elevationGain,
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <span className="text-lg font-semibold tracking-tight">Trajectory</span>
        </div>

        <ProgressBar current={step} total={4} />

        {step === 1 && (
          <Step1Profile
            data={profileData}
            onChange={setProfileData}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2Race
            data={raceData}
            onChange={setRaceData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3Preferences
            data={prefsData}
            onChange={setPrefsData}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step4Preview
            profile={fullProfile}
            race={fullRace}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  )
}
