import 'reflect-metadata';

jest.mock('native-views', () => ({

}));

jest.mock('native-modules', () => ({
  multiply: jest.fn()
}));