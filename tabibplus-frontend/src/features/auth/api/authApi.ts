import api from "../../../lib/api";
import type { LoginRequest, LoginResponse } from "../types"
import type { RegisterPatientRequest ,RegisterProfessionnelRequest} from "../types";
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", credentials);
  return data;
}
export async function registerPatient(payload: RegisterPatientRequest): Promise<void> {
  await api.post("/auth/register/patient", payload);
}
export async function registerProfessionnel(
  payload: RegisterProfessionnelRequest
): Promise<void> {
  await api.post("/auth/register/professionnel", payload);
}