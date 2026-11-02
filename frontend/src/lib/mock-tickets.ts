import { Ticket } from '../types/ticket';

export const INITIAL_SEEDED_TICKETS: Ticket[] = [
  {
    id: 'TCK-001',
    userId: 'USR-101',
    orderId: 'ORD-9012',
    subject: 'Delayed package delivery inquiry',
    message: 'Where is my package #ORD-9012? It was supposed to arrive yesterday.',
    status: 'Pending',
    result: null,
    createdAt: '2026-11-01T14:24:00Z',
  },
  {
    id: 'TCK-002',
    userId: 'USR-204',
    orderId: null,
    subject: 'Enterprise tier account upgrade request',
    message: 'Can you upgrade my account to Enterprise tier?',
    status: 'Pending',
    result: null,
    createdAt: '2026-11-01T16:10:00Z',
  },
  {
    id: 'TCK-003',
    userId: 'USR-309',
    orderId: null,
    subject: 'Profile picture update help',
    message: 'How do I update my profile picture?',
    status: 'Pending',
    result: null,
    createdAt: '2026-11-01T17:45:00Z',
  },
];
