-- usuario de prueba, tabla users para autenticación y perfiles
CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  email NVARCHAR(255) NOT NULL UNIQUE,
  password NVARCHAR(255) NOT NULL,
  created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
