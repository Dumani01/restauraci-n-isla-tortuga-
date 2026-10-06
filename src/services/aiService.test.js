import { askAssistant, validateAiRequest } from './aiService.js';

test('valida y limita el payload del asistente', () => {
  expect(validateAiRequest({ message: '  ¿Qué es la restauración coralina?  ', language: 'en', role: 'ADMIN', context: { page: 'restoration', ignored: true } })).toEqual({ valid: true, payload: { message: '¿Qué es la restauración coralina?', language: 'en', role: 'ADMIN', context: { page: 'restoration', restorationZoneId: undefined } } });
  expect(validateAiRequest({ message: '' }).error).toBe('INVALID_INPUT');
  expect(validateAiRequest({ message: 'a'.repeat(2001) }).error).toBe('INVALID_INPUT');
});

test('devuelve error controlado si no hay webhook configurado', async () => {
  const response = await askAssistant({ message: 'Consulta demo', language: 'es', role: 'USER' });
  expect(response.success).toBe(false);
  expect(response.error).toBe('N8N_UNAVAILABLE');
});
