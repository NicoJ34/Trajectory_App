import localforage from 'localforage'

const profileStore = localforage.createInstance({
  name: 'trajectory',
  storeName: 'trajectory_profile',
})

export async function getProfile(): Promise<unknown | null> {
  return profileStore.getItem('profile')
}
