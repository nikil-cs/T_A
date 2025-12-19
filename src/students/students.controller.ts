import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * POST /students
   * Admin adds a new student with login credentials
   * Returns: Student details + username (without password)
   */
  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async addStudent(@Body(ValidationPipe) createStudentDto: CreateStudentDto) {
    return this.studentsService.addStudent(createStudentDto);
  }
  
  /**
   * GET /students
   * Get all students
   */
  @Get()
  @Roles('admin')
  async getAllStudents() {
    return this.studentsService.getAllStudents();
  }

  /**
   * GET /students/:id
   * Get student by ID
   */
  @Get(':id')
  @Roles('admin', 'student')
  async getStudentById(@Param('id') id: string) {
    return this.studentsService.getStudentById(Number(id));
  }

  /**
   * PUT /students/:id
   * Update student information (admin only)
   */
  @Put(':id')
  @Roles('admin')
  async updateStudent(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateStudentDto>,
  ) {
    return this.studentsService.updateStudent(Number(id), updateData);
  }

  /**
   * DELETE /students/:id
   * Delete student (admin only)
   */
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStudent(@Param('id') id: string) {
    return this.studentsService.deleteStudent(Number(id));
  }
}
