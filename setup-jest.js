import 'reflect-metadata';
// eslint-disable-next-line no-undef
jest.mock('native-views', () => ({

}));

// eslint-disable-next-line no-undef
jest.mock('native-modules', () => ({
  // eslint-disable-next-line no-undef
  multiply: jest.fn(),
}));