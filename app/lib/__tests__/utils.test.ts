import { formatCurrency } from '../utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format a number into BRL currency format', () => {
      const amountInCents = 12345;
      const formatted = formatCurrency(amountInCents);
      
      expect(formatted).toContain('R$');
      expect(formatted).toContain('123,45');
    });

    it('should handle zero correctly', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('R$');
      expect(formatted).toContain('0,00');
    });

    it('should handle large numbers correctly', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain('R$');
      expect(formatted).toContain('10.000,00');
    });
  });
});
