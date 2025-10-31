import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from '../../database/entities/auth-token.entity';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.extractToken(req);

      if (!token) {
        return next();
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      });

      // Check if token exists in database and is not revoked
      const authToken = await this.authTokenRepository.findOne({
        where: {
          accessToken: token,
          revoked: false,
        },
      });

      if (!authToken || authToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Token has been revoked or expired');
      }

      // Attach user payload to request object
      req.user = {
        userId: payload.sub,
        ...payload,
      };
      
      req.cookies.accessToken = authToken.accessToken;
      req.cookies.refreshToken = authToken.refreshToken;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      next();
    }
  }

  private extractToken(req: Request): string | null {
    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }

    if (req.headers.cookie) {
      const cookies = this.parseCookies(req.headers.cookie);
      if (cookies.accessToken) {
        return cookies.accessToken;
      }
    }

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }

    return null;
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
      const [name, ...rest] = cookie.trim().split('=');
      if (name && rest.length > 0) {
        cookies[name] = rest.join('=');
      }
    });
    return cookies;
  }
}

