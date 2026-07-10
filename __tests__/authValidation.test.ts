import {validateLogin, validateProfile, validateRegister} from '../src/utils/validation/authValidation';

describe('authValidation', () => {
  it('passes valid registration', () => {
    const errors = validateRegister({
      name: 'John', email: 'john@test.com', password: 'pass12',
      confirmPassword: 'pass12', gender: 'male', mobile: '9876543210',
      address: 'Street 1', city: 'Mumbai',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('requires 10 digit mobile', () => {
    const errors = validateRegister({
      name: 'John', email: 'john@test.com', password: 'pass12',
      confirmPassword: 'pass12', gender: 'female', mobile: '123',
      address: 'Street', city: 'Delhi',
    });
    expect(errors.mobile).toBeDefined();
  });

  it('requires min 6 char password on login', () => {
    const errors = validateLogin({email: 'a@b.com', password: '123'});
    expect(errors.password).toBeDefined();
  });

  it('validates profile fields on save', () => {
    const errors = validateProfile({
      name: '',
      gender: '',
      mobile: '123',
      address: '',
      city: '',
    });
    expect(errors.name).toBeDefined();
    expect(errors.mobile).toBeDefined();
  });
});
