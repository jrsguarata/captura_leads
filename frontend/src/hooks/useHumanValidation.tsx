import { useState, useEffect, useCallback } from 'react';

interface HumanValidationResult {
  isHuman: boolean;
  honeypotValue: string;
  setHoneypotValue: (value: string) => void;
  formStartTime: number;
  validateSubmission: () => { valid: boolean; message: string };
  resetValidation: () => void;
  HoneypotField: React.FC;
}

const MIN_FILL_TIME_MS = 3000; // Tempo mínimo de 3 segundos para preencher o formulário

export const useHumanValidation = (): HumanValidationResult => {
  const [honeypotValue, setHoneypotValue] = useState('');
  const [formStartTime, setFormStartTime] = useState(Date.now());

  useEffect(() => {
    setFormStartTime(Date.now());
  }, []);

  const validateSubmission = useCallback(() => {
    // Verifica se o campo honeypot foi preenchido (bots tendem a preencher todos os campos)
    if (honeypotValue.trim() !== '') {
      return {
        valid: false,
        message: 'Validação de segurança falhou. Por favor, tente novamente.',
      };
    }

    // Verifica o tempo mínimo de preenchimento
    const elapsedTime = Date.now() - formStartTime;
    if (elapsedTime < MIN_FILL_TIME_MS) {
      return {
        valid: false,
        message: 'Por favor, preencha o formulário com mais cuidado.',
      };
    }

    return { valid: true, message: '' };
  }, [honeypotValue, formStartTime]);

  const resetValidation = useCallback(() => {
    setHoneypotValue('');
    setFormStartTime(Date.now());
  }, []);

  // Componente do campo honeypot (invisível para usuários humanos)
  const HoneypotField: React.FC = () => (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        opacity: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor="website_url">Website</label>
      <input
        type="text"
        id="website_url"
        name="website_url"
        value={honeypotValue}
        onChange={(e) => setHoneypotValue(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );

  return {
    isHuman: honeypotValue === '',
    honeypotValue,
    setHoneypotValue,
    formStartTime,
    validateSubmission,
    resetValidation,
    HoneypotField,
  };
};

export default useHumanValidation;
