let _onboardingDone = false;

export function isOnboardingDone(): boolean {
  return _onboardingDone;
}

export function markOnboardingDone(): void {
  _onboardingDone = true;
}

export function resetOnboarding(): void {
  _onboardingDone = false;
}
