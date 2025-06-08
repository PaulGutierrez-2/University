import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDetails } from '../types/view-types';

@Injectable()
export class UserDetailsService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<UserDetails[]> {
    const userDetails = await this.prisma.$queryRaw<UserDetails[]>`
      SELECT * FROM user_details 
      ORDER BY name ASC
    `;
    return userDetails;
  }

  async getUsersByType(userType: string): Promise<UserDetails[]> {
    const userDetails = await this.prisma.$queryRaw<UserDetails[]>`
      SELECT * FROM user_details 
      WHERE user_type = ${userType}
      ORDER BY name ASC
    `;
    return userDetails;
  }

  async getActiveUsers(): Promise<UserDetails[]> {
    const userDetails = await this.prisma.$queryRaw<UserDetails[]>`
      SELECT * FROM user_details 
      WHERE "isActive" = true
      ORDER BY name ASC
    `;
    return userDetails;
  }

  async getUserById(id: number): Promise<UserDetails | null> {
    const userDetails = await this.prisma.$queryRaw<UserDetails[]>`
      SELECT * FROM user_details 
      WHERE id = ${id}
    `;
    return userDetails[0] || null;
  }

  async searchUsersByName(searchTerm: string): Promise<UserDetails[]> {
    const userDetails = await this.prisma.$queryRaw<UserDetails[]>`
      SELECT * FROM user_details 
      WHERE name ILIKE ${`%${searchTerm}%`}
      ORDER BY name ASC
    `;
    return userDetails;
  }

  async getUsersPaginated(page: number, limit: number): Promise<{
    data: UserDetails[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    
    const [data, totalResult] = await Promise.all([
      this.prisma.$queryRaw<UserDetails[]>`
        SELECT * FROM user_details 
        ORDER BY name ASC
        LIMIT ${limit} OFFSET ${offset}
      `,
      this.prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM user_details
      `
    ]);

    const total = Number(totalResult[0].count);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}