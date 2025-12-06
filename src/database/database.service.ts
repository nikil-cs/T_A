import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private readonly sql;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    this.sql = neon(databaseUrl);
  }

  // Execute raw SQL queries using Neon serverless driver
  async query<T>(queryString: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
    return this.sql(queryString, ...values);
  }

  // Example: Get all students
  async getStudents() {
    const data = await this.sql`SELECT * FROM students`;
    return data;
  }

  // Example: Get student by ID
  async getStudentById(id: number) {
    const data = await this.sql`SELECT * FROM students WHERE student_id = ${id}`;
    return data[0];
  }

  // Example: Get all courses
  async getCourses() {
    const data = await this.sql`SELECT * FROM courses`;
    return data;
  }

  // Example: Get all batches with course info
  async getBatchesWithCourses() {
    const data = await this.sql`
      SELECT b.*, c.course_name 
      FROM batches b 
      JOIN courses c ON b.course_id = c.course_id
    `;
    return data;
  }

  // Example: Get pending fees
  async getPendingFees() {
    const data = await this.sql`
      SELECT f.*, s.first_name, s.last_name 
      FROM fees f 
      JOIN students s ON f.student_id = s.student_id 
      WHERE f.is_paid = false
    `;
    return data;
  }
}
