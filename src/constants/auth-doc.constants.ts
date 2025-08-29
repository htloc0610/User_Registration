import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// Auth Module Documentation Decorators
export const AuthDoc = {
  // Login Endpoint
  LoginSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'User Login',
        description: 'Authenticate user with email and password to receive access and refresh tokens',
      }),
    ),

  LoginSuccess: () =>
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
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    isActive: { type: 'boolean', example: true },
                    emailVerified: { type: 'boolean', example: false },
                    roleId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174001' },
                    createdAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      }),
    ),

  LoginUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid credentials' },
            code: { type: 'number', example: HttpStatus.UNAUTHORIZED },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'credentials' },
                  error_code: { type: 'string', example: 'AUTH001' },
                  message: { type: 'string', example: 'Invalid email or password' },
                  details: { type: 'string', example: 'The provided credentials are incorrect. Please check your email and password.' },
                },
              },
            },
          },
        },
      }),
    ),

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
        description: 'Registration successful',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Registration successful' },
            code: { type: 'number', example: HttpStatus.CREATED },
            data: {
              type: 'object',
              properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    isActive: { type: 'boolean', example: true },
                    emailVerified: { type: 'boolean', example: false },
                    roleId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174001' },
                    createdAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
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
        description: 'Email already exists',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Email already exists' },
            code: { type: 'number', example: HttpStatus.CONFLICT },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  error_code: { type: 'string', example: 'AUTH002' },
                  message: { type: 'string', example: 'Email already exists' },
                  details: { type: 'string', example: 'A user with this email address already exists. Please use a different email or try logging in.' },
                },
              },
            },
          },
        },
      }),
    ),

  // Profile Endpoint
  GetProfileSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get Current User Profile',
        description: 'Retrieve the authenticated user\'s profile information',
      }),
    ),

  GetProfileSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Profile retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Profile retrieved successfully' },
            code: { type: 'number', example: HttpStatus.OK },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                isActive: { type: 'boolean', example: true },
                isDeleted: { type: 'boolean', example: false },
                emailVerified: { type: 'boolean', example: false },
                roleId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174001' },
                createdAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                updatedAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                role: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174001' },
                    name: { type: 'string', example: 'user' },
                    description: { type: 'string', example: 'Regular user with limited access' },
                    isActive: { type: 'boolean', example: true },
                    isDeleted: { type: 'boolean', example: false },
                    createdAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      }),
    ),

  GetProfileUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Unauthorized' },
            code: { type: 'number', example: HttpStatus.UNAUTHORIZED },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'authorization' },
                  error_code: { type: 'string', example: 'AUTH003' },
                  message: { type: 'string', example: 'Authentication credentials are missing or invalid' },
                  details: { type: 'string', example: 'Please provide a valid authentication token in the Authorization header' },
                },
              },
            },
          },
        },
      }),
    ),

  // Refresh Token Endpoint
  RefreshTokenSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Refresh Access Token',
        description: 'Use refresh token to get a new access token',
      }),
    ),

  RefreshTokenSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Token refreshed successfully',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Token refreshed successfully' },
            code: { type: 'number', example: HttpStatus.OK },
            data: {
              type: 'object',
              properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
      }),
    ),

  RefreshTokenUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid refresh token',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid refresh token' },
            code: { type: 'number', example: HttpStatus.UNAUTHORIZED },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'refresh_token' },
                  error_code: { type: 'string', example: 'AUTH004' },
                  message: { type: 'string', example: 'Invalid or expired refresh token' },
                  details: { type: 'string', example: 'The refresh token is invalid, expired, or has been revoked. Please log in again.' },
                },
              },
            },
          },
        },
      }),
    ),

  // Logout Endpoint
  LogoutSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'User Logout',
        description: 'Logout user and revoke current access token',
      }),
    ),

  LogoutSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Logout successful',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Successfully logged out' },
            code: { type: 'number', example: HttpStatus.OK },
          },
        },
      }),
    ),

  LogoutUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Unauthorized' },
            code: { type: 'number', example: HttpStatus.UNAUTHORIZED },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'authorization' },
                  error_code: { type: 'string', example: 'AUTH005' },
                  message: { type: 'string', example: 'Authentication credentials are missing or invalid' },
                  details: { type: 'string', example: 'Please provide a valid authentication token in the Authorization header' },
                },
              },
            },
          },
        },
      }),
    ),
};
