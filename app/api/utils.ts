import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

export const badRequest = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.BAD_REQUEST,
  });

export const unauthorized = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.UNAUTHORIZED,
  });

export const internalServerError = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  });

export const ok = (data: any) =>
  new NextResponse(JSON.stringify(data), {
    status: StatusCodes.OK,
  });

export const notFound = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.NOT_FOUND,
  });

export const forbidden = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.FORBIDDEN,
  });

export const conflict = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.CONFLICT,
  });

export const created = (data: any) =>
  new NextResponse(JSON.stringify(data), {
    status: StatusCodes.CREATED,
  });

export const noContent = () =>
  new NextResponse(null, {
    status: StatusCodes.NO_CONTENT,
  });

export const accepted = (data: any) =>
  new NextResponse(JSON.stringify(data), {
    status: StatusCodes.ACCEPTED,
  });

export const methodNotAllowed = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.METHOD_NOT_ALLOWED,
  });

export const serviceUnavailable = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.SERVICE_UNAVAILABLE,
  });

export const notAcceptable = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.NOT_ACCEPTABLE,
  });

export const unsupportedMediaType = (message: string) =>
  new NextResponse(JSON.stringify(message), {
    status: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
  });

export const invalidResponseError = async (
  message: string,
  response: Response,
): Promise<Error> => {
  const errorText = response.text();
  return new Error(`${response.status}: ${message}, ${errorText}`);
};
