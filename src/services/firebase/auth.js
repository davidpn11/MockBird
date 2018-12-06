import { auth, provider } from './firebase'

export function signOut() {
  auth.signOut()
}

export function signIn() {
  return auth.signInWithPopup(provider)
}
