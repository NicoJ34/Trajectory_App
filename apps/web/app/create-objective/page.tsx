'use client'

import { useState } from 'react'
import type { RaceDistance } from '@trajectory/shared'
import ProgressBar from './components/ProgressBar'
import Step1Distance from './components/Step1Distance'
import Step2Details from './components/Step2Details'
import Step3Confirmation from './components/Step3Confirmation'

interface DistanceData {
  distance?: RaceDistance
  distanceKm?: number
}

interface DetailsData {
  targetDate?: string
  name?: string
  elevationGain?: number
  notes?: string
}

type Step = 1 | 2 | 3

export default function CreateObjectivePage() {
  const [step, setStep] = useState<Step>(1)
  const [distanceData, setDistanceData] = useState<DistanceData>({})
  const [detailsData, setDetailsData] = useState<DetailsData>({})

  const isStep3Ready =
    distanceData.distance !== undefined &&
    distanceData.distanceKm !== undefined &&
    detailsData.targetDate !== undefined

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <span className="text-lg font-semibold tracking-tight">Trajectory</span>
        </div>

        <ProgressBar current={step} total={3} />

        {step === 1 && (
          <Step1Distance
            data={distanceData}
            onChange={setDistanceData}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2Details
            data={detailsData}
            onChange={setDetailsData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && isStep3Ready && (
          <Step3Confirmation
            data={{
              distance: distanceData.distance!,
              distanceKm: distanceData.distanceKm!,
              targetDate: detailsData.targetDate!,
              name: detailsData.name,
              elevationGain: detailsData.elevationGain,
              notes: detailsData.notes,
            }}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  )
}
