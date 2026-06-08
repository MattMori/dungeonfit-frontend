import api from "./api";

function unwrap(response) {
  return response?.data?.data || response?.data;
}

export async function getOnboardingStatus() {
  const response = await api.get("/onboarding");
  return unwrap(response);
}

export async function completeOnboardingStep(step) {
  const response = await api.patch("/onboarding/step", { step });
  return unwrap(response);
}

export async function chooseOnboardingGoal(primary_goal) {
  const response = await api.post("/onboarding/choose-goal", { primary_goal });
  return unwrap(response);
}

export async function skipOnboarding() {
  const response = await api.post("/onboarding/skip");
  return unwrap(response);
}

export async function completeOnboarding() {
  const response = await api.post("/onboarding/complete");
  return unwrap(response);
}
