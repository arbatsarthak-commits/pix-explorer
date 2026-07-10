export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export type RegisterFormValues = {
  name: string; email: string; password: string; confirmPassword: string;
  gender: string; mobile: string; address: string; city: string;
};
export type LoginFormValues = {email: string; password: string};
export type ProfileFormValues = {
  name: string;
  gender: string;
  mobile: string;
  address: string;
  city: string;
};

const MIN_PW = 6;
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const mobileOk = (m: string) => /^\d{10}$/.test(m.trim());

export function validateRegister(values: RegisterFormValues): FieldErrors<keyof RegisterFormValues & string> {
  const e: FieldErrors<keyof RegisterFormValues & string> = {};
  if (!values.name.trim()) e.name = 'Name is required.';
  if (!emailOk(values.email)) e.email = 'Enter a valid email address.';
  if (!values.gender) e.gender = 'Gender is required.';
  if (!values.mobile.trim()) e.mobile = 'Mobile number is required.';
  else if (!mobileOk(values.mobile)) e.mobile = 'Mobile must be exactly 10 digits.';
  if (!values.address.trim()) e.address = 'Address is required.';
  if (!values.city.trim()) e.city = 'City is required.';
  if (values.password.length < MIN_PW) e.password = `Password must be at least ${MIN_PW} characters.`;
  if (values.confirmPassword !== values.password) e.confirmPassword = 'Passwords do not match.';
  return e;
}

export function validateLogin(values: LoginFormValues): FieldErrors<keyof LoginFormValues & string> {
  const e: FieldErrors<keyof LoginFormValues & string> = {};
  if (!emailOk(values.email)) e.email = 'Enter a valid email address.';
  if (!values.password.trim()) e.password = 'Password is required.';
  else if (values.password.length < MIN_PW) e.password = `Password must be at least ${MIN_PW} characters.`;
  return e;
}

export function validateProfile(
  values: ProfileFormValues,
): FieldErrors<keyof ProfileFormValues & string> {
  const e: FieldErrors<keyof ProfileFormValues & string> = {};
  if (!values.name.trim()) e.name = 'Name is required.';
  if (!values.gender) e.gender = 'Gender is required.';
  if (!values.mobile.trim()) e.mobile = 'Mobile number is required.';
  else if (!mobileOk(values.mobile)) e.mobile = 'Mobile must be exactly 10 digits.';
  if (!values.address.trim()) e.address = 'Address is required.';
  if (!values.city.trim()) e.city = 'City is required.';
  return e;
}
