import { Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

/**
 * @jest-environment node
 */
import { POST } from './route';
import { API_POST_RESPONSE, INVALID_FILE, VALID_FILE } from './test.constants';

jest.mock('@nangohq/node', () => {
  return {
    Nango: jest.fn().mockImplementation(() => ({
      getToken: jest.fn().mockResolvedValue('mock-token'),
      getConnection: jest.fn().mockResolvedValue({
        connection_config: { realmId: 'mock-realm-id' },
      }),
    })),
  };
});

const mockRequest = (body: any): NextRequest => {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
};

const mockResponse = (data: any, status: number) => {
  return {
    ok: true,
    status,
    json: () => Promise.resolve(data),
  };
};

const createBillInQuickBooks = jest.fn();

describe('POST /api/bills', () => {
  describe('with invalid file', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error if file is invalid', async () => {
      const req = mockRequest({ userId: 'mock-user-id', file: INVALID_FILE });

      await expect(POST(req)).rejects.toThrow(
        new Error('Failed to create bill in QuickBooks'),
      );
    });
  });

  describe('with valid file', () => {
    beforeAll(() => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(mockResponse(API_POST_RESPONSE, 200));
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if userId or file is missing', async () => {
      const req = mockRequest({});

      const result = await POST(req);

      expect(result.status).toBe(400);
      const responseBody = await result.json();
      expect(responseBody.message).toBe('User ID and File are required');
    });

    it('should return 200 and response data if QuickBooks is authorized', async () => {
      const req = mockRequest({
        userId: 'some-user-id',
        file: VALID_FILE,
      });

      createBillInQuickBooks.mockResolvedValue(
        mockResponse(API_POST_RESPONSE, 200),
      );

      const result = await POST(req);

      expect(result.status).toBe(200);
      const responseBody = await result.json();
      expect(responseBody.Id).toBe(API_POST_RESPONSE.Id);
    });

    it('should return 401 if QuickBooks is not authorized', async () => {
      jest.resetAllMocks();
      jest.mock('@nangohq/node', () => {
        return {
          Nango: jest.fn().mockImplementation(() => ({
            getToken: jest.fn().mockResolvedValue(undefined),
            getConnection: jest.fn().mockResolvedValue({
              connection_config: { realmId: undefined },
            }),
          })),
        };
      });

      const req = mockRequest({ userId: 'some-user-id', file: VALID_FILE });

      const result = await POST(req);

      expect(result.status).toBe(401);
      const responseBody = await result.json();
      expect(responseBody).toBe('QuickBooks not authorized');
    });
  });
});
