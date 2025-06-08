-- This is an empty migration.

-- Crear vista para usuarios con información completa
CREATE VIEW user_details AS
SELECT 
    u.id,
    u.email,
    u.name,
    u."isActive",
    u."createdAt",
    u."updatedAt",
    CASE 
        WHEN s.id IS NOT NULL THEN 'Student'
        WHEN p.id IS NOT NULL THEN 'Professor'
        ELSE 'User'
    END as user_type,
    s.code as student_code,
    p.code as professor_code
FROM users u
LEFT JOIN students s ON u.id = s."userId"
LEFT JOIN professors p ON u.id = p."userId";

-- Crear vista para profesores con información completa
CREATE VIEW professor_summary AS
SELECT 
    p.id as professor_id,
    p.code as professor_code,
    u.name as professor_name,
    u.email,
    u."isActive",
    COUNT(DISTINCT ps."B") as total_subjects,
    COUNT(DISTINCT pd."B") as total_degrees,
    STRING_AGG(DISTINCT d.name, ', ') as degree_names
FROM professors p
JOIN users u ON p."userId" = u.id
LEFT JOIN "_ProfessorsSubjects" ps ON p.id = ps."A"
LEFT JOIN "_ProfessorsDegrees" pd ON p.id = pd."A"
LEFT JOIN degrees d ON pd."B" = d.id
GROUP BY p.id, p.code, u.name, u.email, u."isActive";

-- Crear vista para estudiantes con información completa
CREATE VIEW student_summary AS
SELECT 
    s.id as student_id,
    s.code as student_code,
    u.name as student_name,
    u.email,
    u."isActive",
    COUNT(DISTINCT ss."B") as total_subjects,
    COUNT(DISTINCT sd."B") as total_degrees,
    STRING_AGG(DISTINCT d.name, ', ') as degree_names
FROM students s
JOIN users u ON s."userId" = u.id
LEFT JOIN "_StudentsSubjects" ss ON s.id = ss."A"
LEFT JOIN "_StudentsDegrees" sd ON s.id = sd."A"
LEFT JOIN degrees d ON sd."B" = d.id
GROUP BY s.id, s.code, u.name, u.email, u."isActive";

-- Crear vista para roles de usuario con detalles
CREATE VIEW user_roles_details AS
SELECT 
    ur.id as user_role_id,
    u.id as user_id,
    u.name as user_name,
    u.email,
    r.id as role_id,
    r.name as role_name,
    r.description as role_description,
    d.name as degree_name,
    s.name as subject_name,
    ur."isActive"
FROM user_roles ur
JOIN users u ON ur."userId" = u.id
JOIN roles r ON ur."roleId" = r.id
LEFT JOIN degrees d ON ur."degreeId" = d.id
LEFT JOIN subjects s ON ur."subjectId" = s.id;

-- Crear vista para permisos por rol
CREATE VIEW role_permissions_summary AS
SELECT 
    r.id as role_id,
    r.name as role_name,
    COUNT(rp."permissionId") as total_permissions,
    STRING_AGG(DISTINCT p.resource, ', ') as resources,
    STRING_AGG(DISTINCT p.action, ', ') as actions,
    STRING_AGG(DISTINCT CONCAT(p.resource, ':', p.action), ', ') as permission_list
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp."roleId"
LEFT JOIN permissions p ON rp."permissionId" = p.id
GROUP BY r.id, r.name;

-- Crear vista para materias con información de carrera
CREATE VIEW subject_details AS
SELECT 
    s.id as subject_id,
    s.name as subject_name,
    s.code as subject_code,
    s."isActive",
    d.id as degree_id,
    d.name as degree_name,
    d.code as degree_code,
    COUNT(DISTINCT ps."A") as total_professors,
    COUNT(DISTINCT ss."A") as total_students
FROM subjects s
JOIN degrees d ON s."degreeId" = d.id
LEFT JOIN "_ProfessorsSubjects" ps ON s.id = ps."B"
LEFT JOIN "_StudentsSubjects" ss ON s.id = ss."B"
GROUP BY s.id, s.name, s.code, s."isActive", d.id, d.name, d.code;

-- Crear vista para estadísticas por carrera
CREATE VIEW degree_statistics AS
SELECT 
    d.id as degree_id,
    d.name as degree_name,
    d.code as degree_code,
    d."isActive",
    COUNT(DISTINCT s.id) as total_subjects,
    COUNT(DISTINCT sd."A") as total_students,
    COUNT(DISTINCT pd."A") as total_professors
FROM degrees d
LEFT JOIN subjects s ON d.id = s."degreeId"
LEFT JOIN "_StudentsDegrees" sd ON d.id = sd."B"
LEFT JOIN "_ProfessorsDegrees" pd ON d.id = pd."B"
GROUP BY d.id, d.name, d.code, d."isActive";