import { Tencent } from '../src';

const config = {
  secretId: process.env.TENCENT_SECRET_ID,
  secretKey: process.env.TENCENT_SECRET_KEY,
};
describe('Dict Tencent', () => {
  const tencent = new Tencent({ config });

  it('should translate successfully', async () => {
    const result = await tencent.translate('I love you', 'en', 'zh-CN');

    expect(result).toEqual({
      success: true,
      type: 'tencent',
      text: 'I love you',
      from: 'en',
      to: 'zh-CN',
      /** 原文 */
      origin: {
        paragraphs: ['I love you'],
      },
      /** 译文 */
      trans: {
        paragraphs: ['我爱你'],
      },
    });
  }, 5000);

  it('should get supported languages', () => {
    const result = tencent.getSupportLanguages();

    expect(result).toContain('auto');
    expect(result).toContain('zh-CN');
    expect(result).toContain('en');
  }, 5000);

  describe('withSDK', () => {
    it('should translate successfully', async () => {
      const result = await tencent['requestWithSDK'](
        'I love you',
        'en',
        'zh-CN',
        config,
      );

      expect(result).toEqual({
        success: true,
        text: 'I love you',
        from: 'en',
        to: 'zh-CN',
        /** 原文 */
        origin: {
          paragraphs: ['I love you'],
        },
        /** 译文 */
        trans: {
          paragraphs: ['我爱你'],
        },
      });
    }, 5000);
  });

  describe('withoutSDK', () => {
    describe('工具函数', () => {
      it('should get token url', async () => {
        tencent['tokenUrl'] = undefined;

        const url = await tencent['fetchTokenUrl']();

        expect(typeof url).toBe('string');
        expect(tencent['tokenUrl']).toBe(url);
      });
      it('should get token without tokenUrl', async () => {
        tencent['qtk'] = undefined;
        tencent['qtv'] = undefined;
        tencent['tokenUrl'] = undefined;

        const data = await tencent['fetchToken']();

        expect(typeof data.qtk).toBe('string');
        expect(data.qtk).not.toBe('');
        expect(typeof data.qtv).toBe('string');
        expect(data.qtv).not.toBe('');

        expect(typeof tencent['tokenUrl']).toBe('string');
      });
      it('should get token with tokenUrl', async () => {
        tencent['tokenUrl'] = undefined;
        const url = await tencent['fetchTokenUrl']();

        expect(tencent['tokenUrl']).toBeDefined();
        const data = await tencent['fetchToken']();

        expect(typeof data.qtk).toBe('string');
        expect(data.qtk).not.toBe('');
        expect(typeof data.qtv).toBe('string');
        expect(data.qtv).not.toBe('');
        expect(tencent['tokenUrl']).toBe(url);
      });
    });

    it('should get translate result without token', async () => {
      tencent['qtk'] = undefined;
      tencent['qtv'] = undefined;

      const result = await tencent['requestWithoutSDK'](
        'I love you',
        'en',
        'zh-CN',
      );

      expect(result).toEqual({
        success: true,
        text: 'I love you',
        from: 'en',
        to: 'zh-CN',
        /** 原文 */
        origin: {
          paragraphs: ['I love you'],
        },
        /** 译文 */
        trans: {
          paragraphs: ['我爱你'],
        },
      });
    });
  });

  describe('query', () => {
    it('should get translate result with outdate token', async () => {
      tencent['qtk'] = '73e215b2e89e1431';
      tencent['qtv'] =
        '7Z6dJ0uvorb2OgbZFPtLL+d077Fe85VYZhpQBEiCtEQpPDuaDqx7Lynpkw8simEY7lRxY+hld1b1q1HZNMQffnL0jsjlOXx4PFRcaMdyRT4/RExdXl10EIuIIXWRIpcBe7q35HXhtq+Aw1jGmQEopA==';

      const input =
        'It is made primarily for JavaScript, but it can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included.';
      const result = await tencent['query'](input, 'en', 'zh-CN');

      expect(result).toEqual({
        success: true,
        text: input,
        from: 'en',
        to: 'zh-CN',
        /** 原文 */
        origin: {
          paragraphs: [input],
        },
        /** 译文 */
        trans: {
          paragraphs: [
            '它主要是为JavaScript设计的，但如果包含相应的加载器，它也可以转换前端资产，如HTML、CSS和图像。',
          ],
        },
      });
    });
  });
});
