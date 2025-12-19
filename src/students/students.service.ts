import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Add a new student with login credentials
   * Admin provides: student info + username + password
   * System creates: User account + Student record
   */
  async addStudent(createStudentDto: CreateStudentDto) {
    const {
      firstName,
      lastName,
      dateOfBirth,
      contactNumber,
      email,
      guardianName,
      guardianContact,
      username,
      password,
    } = createStudentDto;

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Student and User in a transaction
    const student = await this.prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        contactNumber,
        email: email || null,
        guardianName,
        guardianContact,
        status: 'ACTIVE', // Default status when added by admin
        user: {
          create: {
            username,
            passwordHash: hashedPassword,
            role: 'STUDENT',
          },
        },
      },
      include: {
        user: true,
      },
    });

    // Return student info without sensitive data
    return {
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      contactNumber: student.contactNumber,
      email: student.email,
      guardianName: student.guardianName,
      guardianContact: student.guardianContact,
      admissionDate: student.admissionDate,
      status: student.status,
      username: student.user?.username,
      message: 'Student added successfully',
    };
  }

  /**
   * Get all students
   */
  async getAllStudents() {
    return this.prisma.student.findMany({
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Get student by ID
   */
  async getStudentById(studentId: number) {
    return this.prisma.student.findUnique({
      where: { studentId },
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
        studentBatches: true,
        fees: true,
      },
    });
  }

  /**
   * Update student information
   */
  async updateStudent(studentId: number, updateData: Partial<CreateStudentDto>) {
    return this.prisma.student.update({
      where: { studentId },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        dateOfBirth: updateData.dateOfBirth,
        contactNumber: updateData.contactNumber,
        email: updateData.email,
        guardianName: updateData.guardianName,
        guardianContact: updateData.guardianContact,
      },
    });
  }

  /**
   * Delete student
   */
  async deleteStudent(studentId: number) {
    return this.prisma.student.delete({
      where: { studentId },
    });
  }
}
