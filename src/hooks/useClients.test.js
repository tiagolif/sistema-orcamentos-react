import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useClients from './useClients';

// Mock do Supabase
const { mockSelect, mockFrom, mockedSupabase } = vi.hoisted(() => {
  const mockSelect = vi.fn();
  const mockFrom = vi.fn(() => ({
    select: mockSelect,
  }));

  return {
    mockSelect,
    mockFrom,
    mockedSupabase: {
      from: mockFrom,
    },
  };
});

vi.mock('../supabaseClient', () => ({
  supabase: mockedSupabase,
}));

describe('useClients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation for select before each test
    mockSelect.mockImplementation(() => Promise.resolve({ data: [], error: null })); // Default to resolved empty array
  });

  it('should return initial loading state', () => {
    // Mock the select to return a pending promise to keep loading true initially
    mockSelect.mockImplementationOnce(() => new Promise(() => {}));

    const { result } = renderHook(() => useClients());
    expect(result.current.loading).toBe(true);
    expect(result.current.clients).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should fetch and return clients on success', async () => {
    const mockClients = [
      { id: 1, nome_completo: 'Cliente PF', razao_social: null, cpf: '111', cnpj: null, email: 'pf@test.com' },
      { id: 2, nome_completo: null, razao_social: 'Cliente PJ', cpf: null, cnpj: '222', email: 'pj@test.com' },
    ];

    // Mock the select to resolve with data for this specific test
    mockSelect.mockResolvedValueOnce({ data: mockClients, error: null });

    const { result } = renderHook(() => useClients());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.clients).toEqual([
        { id: 1, name: 'Cliente PF', document: '111', email: 'pf@test.com' },
        { id: 2, name: 'Cliente PJ', document: '222', email: 'pj@test.com' },
      ]);
      expect(result.current.error).toBe(null);
    });
  });

  it('should return an error if fetching clients fails', async () => {
    const mockError = new Error('Failed to fetch clients');
    // Mock the select to resolve with an error for this specific test
    mockSelect.mockResolvedValueOnce({ data: null, error: mockError });

    const { result } = renderHook(() => useClients());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.clients).toEqual([]);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});