import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @jest-environment node
 */
import { POST } from './route';
import { API_POST_RESPONSE, INVALID_FILE, VALID_FILE } from './test.constants';

jest.mock('@nangohq/node', () => ({
  Nango: jest.fn().mockImplementation(() => ({
    getToken: jest.fn().mockResolvedValue('mock-token'),
    getConnection: jest.fn().mockResolvedValue({
      connection_config: { realmId: 'mock-realm-id' },
    }),
  })),
}));

const mockRequest = (body: any): NextRequest =>
  ({
    json: jest.fn().mockResolvedValue(body),
  }) as unknown as NextRequest;

const mockResponse = (data: any, status: number): NextResponse =>
  ({
    ok: true,
    status,
    json: () => Promise.resolve(data),
  }) as unknown as NextResponse;

const setupMockNango = (
  token: string | undefined,
  realmId: string | undefined,
) => {
  const NangoMock = require('@nangohq/node').Nango;
  NangoMock.mockImplementation(() => ({
    getToken: jest.fn().mockResolvedValue(token),
    getConnection: jest.fn().mockResolvedValue({
      connection_config: { realmId },
    }),
  }));
};

describe('POST /api/bills', () => {
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(mockResponse(API_POST_RESPONSE, StatusCodes.OK));
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  describe('Validation', () => {
    it('should return 400 if userId or file is missing', async () => {
      const req = mockRequest({});

      const result = await POST(req);

      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
      const responseBody = await result.json();
      expect(responseBody.message).toBe('User ID and File are required');
    });

    it('should throw an error if the file is invalid', async () => {
      const req = mockRequest({ userId: 'mock-user-id', file: INVALID_FILE });

      await expect(POST(req)).rejects.toThrow(
        new Error('Failed to create bill in QuickBooks'),
      );
    });
  });

  describe('Quickbooks Authorization', () => {
    it('should return 200 and response data if QuickBooks is authorized', async () => {
      setupMockNango('mock-token', 'mock-realm-id');
      const req = mockRequest({
        userId: 'some-user-id',
        file: VALID_FILE,
      });

      const result = await POST(req);

      expect(result.status).toBe(StatusCodes.OK);
      const responseBody = await result.json();
      expect(responseBody.Id).toBe(API_POST_RESPONSE.Id);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        }),
      );
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

      expect(result.status).toBe(StatusCodes.UNAUTHORIZED);
      const responseBody = await result.json();
      expect(responseBody).toBe('QuickBooks not authorized');
    });
  });
});
