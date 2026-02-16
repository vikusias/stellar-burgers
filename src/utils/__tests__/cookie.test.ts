import { setCookie, getCookie, deleteCookie } from '../cookie';

describe('cookie utilities', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  });

  it('setCookie и getCookie: устанавливает и возвращает значение', () => {
    setCookie('test', 'value');
    expect(getCookie('test')).toBe('value');
  });

  it('setCookie с expires числом (в секундах) не вызывает ошибок и кука устанавливается', () => {
    setCookie('test', 'value', { expires: 60 });
    expect(getCookie('test')).toBe('value');
  });

  it('setCookie с expires как Date', () => {
    const futureDate = new Date(Date.now() + 3600000);
    setCookie('test', 'value', { expires: futureDate });
    expect(getCookie('test')).toBe('value');
  });

  it('setCookie с дополнительными пропами (path, domain) не вызывает ошибок', () => {
    expect(() =>
      setCookie('test', 'value', { path: '/', domain: 'example.com' })
    ).not.toThrow();
    // В jsdom атрибуты path/domain могут игнорироваться, но код не должен падать
  });

  it('getCookie возвращает undefined для несуществующего ключа', () => {
    expect(getCookie('nonexistent')).toBeUndefined();
  });

  it('deleteCookie удаляет куки', () => {
    setCookie('test', 'value');
    expect(getCookie('test')).toBe('value');
    deleteCookie('test');
    expect(getCookie('test')).toBeUndefined();
  });

  it('setCookie кодирует значение', () => {
    setCookie('test', 'value with spaces and =');
    expect(getCookie('test')).toBe('value with spaces and =');
  });
});
