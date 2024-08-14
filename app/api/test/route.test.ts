/**
 * @jest-environment node
 */
import { StatusCodes } from 'http-status-codes';

import { GET, POST } from './route';

describe('GET /api/test', () => {
  it('should return data with status 200', async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.length).toBe(2);
  });
});

describe('POST /api/test', () => {
  it('should return 400 if request body is empty', async () => {
    const response = await POST({
      json: jest.fn().mockResolvedValue({ message: 'This is the message' }),
    } as any);
    const body = await response.json();

    expect(response.status).toBe(StatusCodes.OK);
    expect(body.message).toBe('Received request');
  });
});
