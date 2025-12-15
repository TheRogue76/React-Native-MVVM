import {device, element, by} from 'detox';
describe('Example', () => {
  beforeEach(async () => {
    await device.launchApp({newInstance: true});
  });

  it('should show home screen after start up', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect(element(by.id('home_counter'))).toBeVisible();
  });

  it('should be able to click on go to details and go to the details screen', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect(element(by.text('Go to Details'))).toBeVisible();
    await element(by.text('Go to Details')).tap();
    await expect(element(by.text('Details Screen'))).toBeVisible();
  })
});
