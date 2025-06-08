import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Roles
  const [adminRole, profRole, studentRole] = await Promise.all([
    prisma.role.create({ data: { name: 'admin', description: 'Administrador' } }),
    prisma.role.create({ data: { name: 'profesor', description: 'Profesor' } }),
    prisma.role.create({ data: { name: 'alumno', description: 'Alumno' } }),
  ]);

  // Permisos
  const [perm1, perm2, perm3] = await Promise.all([
    prisma.permission.create({ data: { name: 'degree:manage', resource: 'degree', action: 'manage', description: 'Gestionar carreras' } }),
    prisma.permission.create({ data: { name: 'subject:read', resource: 'subject', action: 'read', description: 'Ver materias' } }),
    prisma.permission.create({ data: { name: 'student:write', resource: 'student', action: 'write', description: 'Editar estudiantes' } }),
  ]);

  // Asignar permisos a roles
  await Promise.all([
    prisma.rolePermission.create({ data: { roleId: adminRole.id, permissionId: perm1.id } }),
    prisma.rolePermission.create({ data: { roleId: profRole.id, permissionId: perm2.id } }),
    prisma.rolePermission.create({ data: { roleId: studentRole.id, permissionId: perm3.id } }),
  ]);

  // Usuarios
  const [adminUser, profUser, studentUser] = await Promise.all([
    prisma.user.create({ data: { email: 'admin2@demo.com', password: 'hash1', name: 'Admin Dos' } }),
    prisma.user.create({ data: { email: 'prof2@demo.com', password: 'hash2', name: 'Prof Dos' } }),
    prisma.user.create({ data: { email: 'alumno2@demo.com', password: 'hash3', name: 'Alumno Dos' } }),
  ]);

  // Degrees
  const [degree1, degree2] = await Promise.all([
    prisma.degree.create({ data: { name: 'Derecho', code: 'LAW' } }),
    prisma.degree.create({ data: { name: 'Arquitectura', code: 'ARCH' } }),
  ]);

  // Subjects
  const [subject1, subject2, subject3] = await Promise.all([
    prisma.subject.create({ data: { name: 'Introducción al Derecho', code: 'LAW101', degreeId: degree1.id } }),
    prisma.subject.create({ data: { name: 'Historia de la Arquitectura', code: 'ARCH101', degreeId: degree2.id } }),
    prisma.subject.create({ data: { name: 'Ética Profesional', code: 'ETH101', degreeId: degree1.id } }),
  ]);

  // Professor y Student
  const professor = await prisma.professor.create({
    data: {
      userId: profUser.id,
      code: 'PROF002',
      subjects: { connect: [{ id: subject1.id }, { id: subject3.id }] },
      degrees: { connect: [{ id: degree1.id }] },
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      code: 'STU002',
      subjects: { connect: [{ id: subject1.id }, { id: subject2.id }] },
      degrees: { connect: [{ id: degree1.id }, { id: degree2.id }] },
    },
  });

  // UserRole
  await Promise.all([
    prisma.userRole.create({ data: { userId: adminUser.id, roleId: adminRole.id, isActive: true } }),
    prisma.userRole.create({ data: { userId: profUser.id, roleId: profRole.id, isActive: true, degreeId: degree1.id } }),
    prisma.userRole.create({ data: { userId: studentUser.id, roleId: studentRole.id, isActive: true, degreeId: degree2.id } }),
  ]);

  console.log('Seed completado con datos diferentes.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });