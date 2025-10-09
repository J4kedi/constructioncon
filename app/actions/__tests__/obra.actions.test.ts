import { createObra } from '../obra.actions';
import { executeFormAction } from '@/app/lib/action-handler';
import { ObraSchema } from '@/app/lib/definitions';

// Mock do next-auth para evitar erros de ES Modules
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock do server-utils que usa o next-auth
jest.mock('@/app/lib/server-utils', () => ({
  getRequestContext: jest.fn(() => Promise.resolve({ subdomain: 'test-tenant' })),
}));

jest.mock('@/app/lib/action-handler', () => ({
  executeFormAction: jest.fn(),
}));

jest.mock('@/app/lib/data/tenant', () => ({
  findCompany: jest.fn(() => Promise.resolve({ id: 'test-company-id' })),
}));

describe('createObra Server Action', () => {
  it('should call executeFormAction with the correct parameters', async () => {
    const mockFormData = new FormData();
    mockFormData.append('nome', 'Nova Obra de Teste');
    mockFormData.append('endCustomerName', 'Cliente Teste');
    mockFormData.append('orcamentoTotal', '100000');
    mockFormData.append('dataInicio', '2025-01-01');
    mockFormData.append('dataPrevistaFim', '2025-12-31');
    mockFormData.append('obraType', 'RESIDENCIAL');

    const mockPrevState = {};

    await createObra(mockPrevState, mockFormData);

    expect(executeFormAction).toHaveBeenCalledWith({
      formData: mockFormData,
      schema: ObraSchema,
      requires: ['subdomain'],
      revalidatePath: '/dashboard/obras',
      redirectPath: '/dashboard/obras',
      logic: expect.any(Function),
      successMessage: 'Obra criada com sucesso!',
    });
  });
});