import { MorningMessageMeanPage } from './app.po';

describe('morning-message-mean App', () => {
  let page: MorningMessageMeanPage;

  beforeEach(() => {
    page = new MorningMessageMeanPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
