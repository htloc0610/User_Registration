import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// Auth Module Documentation Decorators
export const AuthDoc = {
  // Registration Endpoint
  RegisterSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'User Registration',
        description: 'Create a new user account with email, password, and personal information',
      }),
    ),

  RegisterSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User registered successfully',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User registered successfully' },
            code: { type: 'number', example: HttpStatus.CREATED },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    first_name: { type: 'string', example: 'John' },
                    last_name: { type: 'string', example: 'Doe' },
                    created_at: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                    updated_at: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      }),
    ),

  RegisterBadRequest: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation failed',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation failed' },
            code: { type: 'number', example: HttpStatus.BAD_REQUEST },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                oneOf: [
                  {
                    properties: {
                      field: { type: 'string', example: 'email' },
                      error_code: { type: 'string', example: 'VAL001' },
                      message: { type: 'string', example: 'Email must be a valid email address' },
                      details: { type: 'string', example: 'Please provide a valid email address format' },
                    },
                  },
                  {
                    properties: {
                      field: { type: 'string', example: 'password' },
                      error_code: { type: 'string', example: 'VAL002' },
                      message: { type: 'string', example: 'Password must be at least 8 characters long' },
                      details: { type: 'string', example: 'Password should contain at least 8 characters' },
                    },
                  },
                  {
                    properties: {
                      field: { type: 'string', example: 'firstName' },
                      error_code: { type: 'string', example: 'VAL003' },
                      message: { type: 'string', example: 'First name is required' },
                      details: { type: 'string', example: 'Please provide your first name' },
                    },
                  },
                ],
              },
            },
          },
        },
      }),
    ),

  RegisterConflict: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'User with this email already exists',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User with this email already exists' },
            code: { type: 'number', example: HttpStatus.CONFLICT },
            error: { type: 'string', example: 'Conflict' },
          },
        },
      }),
    ),

  // Sign In Endpoint
  SignInSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'User Sign In',
        description: 'Authenticate user with email and password to get access and refresh tokens',
      }),
    ),

  SignInSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Login successful',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful' },
            code: { type: 'number', example: HttpStatus.OK },
            data: {
              type: 'object',
              properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
              },
            },
          },
        },
      }),
    ),

  SignInBadRequest: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation failed',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation failed' },
            code: { type: 'number', example: HttpStatus.BAD_REQUEST },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                oneOf: [
                  {
                    properties: {
                      field: { type: 'string', example: 'email' },
                      error_code: { type: 'string', example: 'VAL001' },
                      message: { type: 'string', example: 'Email must be a valid email address' },
                      details: { type: 'string', example: 'Please provide a valid email address format' },
                    },
                  },
                  {
                    properties: {
                      field: { type: 'string', example: 'password' },
                      error_code: { type: 'string', example: 'VAL002' },
                      message: { type: 'string', example: 'Password is required' },
                      details: { type: 'string', example: 'Please provide your password' },
                    },
                  },
                ],
              },
            },
          },
        },
      }),
    ),

  SignInUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials or account deactivated',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid credentials' },
            code: { type: 'number', example: HttpStatus.UNAUTHORIZED },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      }),
    ),
  }
