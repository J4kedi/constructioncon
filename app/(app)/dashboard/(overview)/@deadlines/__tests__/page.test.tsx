import React from 'react';
import { render, screen } from '@testing-library/react';
import DeadlinesPage from '../page';
import { fetchUpcomingDeadlines } from '@/app/lib/data/dashboard-overview';
import '@testing-library/jest-dom';

jest.mock('@/app/lib/data/dashboard-overview', () => ({
  fetchUpcomingDeadlines: jest.fn(),
}));

jest.mock('@/app/ui/dashboard/(overview)/UpcomingDeadlines', () => {
  return function DummyUpcomingDeadlines({ deadlines }: { deadlines: any[] }) {
    return (
      <div data-testid="deadlines-list">
        {deadlines.map(d => <div key={d.id}>{d.nome}</div>)}
      </div>
    );
  };
});

jest.mock('next/headers', () => ({
  headers: jest.fn(() => {
    const headerMap = new Map();
    headerMap.set('x-tenant-subdomain', 'test-tenant');
    return headerMap;
  }),
}));

describe('DeadlinesPage Server Component', () => {
  it('should render deadlines when data is returned', async () => {
    const mockDeadlines = [
      { id: '1', nome: 'Projeto Alpha', dataPrevistaFim: '2025-10-15' },
      { id: '2', nome: 'Projeto Beta', dataPrevistaFim: '2025-10-16' },
    ];

    (fetchUpcomingDeadlines as jest.Mock).mockResolvedValue(mockDeadlines);

    const PageComponent = await DeadlinesPage();
    render(PageComponent);

    expect(screen.getByText('Projeto Alpha')).toBeInTheDocument();
    expect(screen.getByText('Projeto Beta')).toBeInTheDocument();
  });

  it('should render nothing if no subdomain is found', async () => {
    (require('next/headers').headers as jest.Mock).mockReturnValue(new Map());

    const PageComponent = await DeadlinesPage();
    const { container } = render(PageComponent);

    expect(container).toBeEmptyDOMElement();
  });
});
