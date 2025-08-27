import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto, UpdateStudentDto, StudentQueryDto, StudentResponseDto, PaginatedStudentResponseDto } from './dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    const student = this.studentsRepository.create({
      ...createStudentDto,
      dateOfBirth: new Date(createStudentDto.dateOfBirth),
      enrollmentDate: createStudentDto.enrollmentDate 
        ? new Date(createStudentDto.enrollmentDate) 
        : new Date(),
    });

    const savedStudent = await this.studentsRepository.save(student);
    return new StudentResponseDto(savedStudent);
  }

  async findAll(queryDto: StudentQueryDto): Promise<PaginatedStudentResponseDto> {
    const { page, limit, search, grade, isActive, sortBy, sortOrder } = queryDto;

    const queryBuilder = this.studentsRepository.createQueryBuilder('student');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(student.firstName ILIKE :search OR student.lastName ILIKE :search OR student.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (grade) {
      queryBuilder.andWhere('student.grade = :grade', { grade });
    }

    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('student.isActive = :isActive', { isActive });
    }

    // Apply sorting
    queryBuilder.orderBy(`student.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [students, total] = await queryBuilder.getManyAndCount();

    return {
      data: students.map(student => new StudentResponseDto(student)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findOne({ where: { id } });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return new StudentResponseDto(student);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findOne({ where: { id } });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const updateData: any = { ...updateStudentDto };
    
    if (updateStudentDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
    }
    
    if (updateStudentDto.enrollmentDate) {
      updateData.enrollmentDate = new Date(updateStudentDto.enrollmentDate);
    }

    await this.studentsRepository.update(id, updateData);
    const updatedStudent = await this.studentsRepository.findOne({ where: { id } });
    
    return new StudentResponseDto(updatedStudent);
  }

  async remove(id: string): Promise<void> {
    const student = await this.studentsRepository.findOne({ where: { id } });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    await this.studentsRepository.remove(student);
  }

  async softDelete(id: string): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findOne({ where: { id } });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    await this.studentsRepository.update(id, { isActive: false });
    const updatedStudent = await this.studentsRepository.findOne({ where: { id } });
    
    return new StudentResponseDto(updatedStudent);
  }

  // Mock data methods for testing
  async seedMockData(): Promise<void> {
    const mockStudents = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        dateOfBirth: new Date('2000-01-15'),
        grade: '10th Grade',
        enrollmentDate: new Date('2024-01-15'),
        phone: '+1234567890',
        address: '123 Main St, City, State',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        dateOfBirth: new Date('2001-03-20'),
        grade: '9th Grade',
        enrollmentDate: new Date('2024-01-20'),
        phone: '+1234567891',
        address: '456 Oak Ave, City, State',
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@example.com',
        dateOfBirth: new Date('1999-12-10'),
        grade: '11th Grade',
        enrollmentDate: new Date('2024-01-10'),
        phone: '+1234567892',
        address: '789 Pine St, City, State',
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@example.com',
        dateOfBirth: new Date('2002-06-25'),
        grade: '8th Grade',
        enrollmentDate: new Date('2024-01-25'),
        phone: '+1234567893',
        address: '321 Elm St, City, State',
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@example.com',
        dateOfBirth: new Date('2000-09-18'),
        grade: '10th Grade',
        enrollmentDate: new Date('2024-01-18'),
        phone: '+1234567894',
        address: '654 Maple Ave, City, State',
      },
    ];

    for (const mockStudent of mockStudents) {
      const existingStudent = await this.studentsRepository.findOne({
        where: { email: mockStudent.email }
      });

      if (!existingStudent) {
        const student = this.studentsRepository.create(mockStudent);
        await this.studentsRepository.save(student);
      }
    }
  }
}
