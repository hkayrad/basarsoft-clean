# BasarsoftClean

A full-stack geospatial application built with .NET 9 Web API and React TypeScript frontend for managing geographical features and roads with interactive mapping capabilities.

## 🚀 Features

- **Geospatial Data Management**: Store and query geographical features and roads using PostGIS
- **Interactive Maps**: React-based frontend with OpenLayers for map visualization
- **RESTful API**: Clean architecture .NET 9 Web API with Entity Framework Core
- **Spatial Queries**: Support for bounding box queries and spatial operations
- **Clean Architecture**: Repository pattern with Unit of Work implementation
- **API Versioning**: Built-in API versioning support
- **TypeScript Support**: Fully typed frontend application
- **Swagger Documentation**: Auto-generated API documentation

## 🏗️ Architecture

### Backend (.NET 9 Web API)
- **Clean Architecture** with separation of concerns
- **Entity Framework Core** with PostgreSQL and PostGIS
- **Repository Pattern** with Generic Repository implementation
- **Unit of Work** pattern for transaction management
- **API Versioning** using Asp.Versioning
- **Swagger/OpenAPI** documentation
- **CORS** enabled for frontend integration

### Frontend (React + TypeScript)
- **React 19** with TypeScript
- **OpenLayers** for interactive mapping
- **Vite** for fast development and building
- **Axios** for API communication
- **ESLint** for code quality

## 📋 Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) with [PostGIS](https://postgis.net/) extension
- [Git](https://git-scm.com/)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/hkayrad/basarsoft-clean.git
cd basarsoft-clean
```

### 2. Database Setup
1. Install PostgreSQL and PostGIS extension
2. Create a new database for the application
3. Update the connection string in `API/appsettings.json` and `API/appsettings.Development.json`

```json
{
  "ConnectionStrings": {
    "PostgresqlConnection": "Host=localhost;Database=YourDatabaseName;Username=YourUsername;Password=YourPassword"
  }
}
```

### 3. Backend Setup
```bash
cd API
dotnet restore
dotnet build
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7000`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:7000/swagger`

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
BasarsoftClean/
├── API/                           # .NET 9 Web API
│   ├── Controllers/              # API Controllers
│   │   ├── FeaturesController.cs
│   │   └── RoadsController.cs
│   ├── DAL/                      # Data Access Layer
│   │   ├── Contexts/            # DbContext
│   │   ├── DTOs/                # Data Transfer Objects
│   │   ├── Models/              # Entity Models
│   │   └── Repositories/        # Repository Pattern
│   ├── Services/                # Business Logic Layer
│   ├── Extensions/              # Extension Methods
│   ├── Helpers/                 # Helper Classes
│   └── Resources/               # Localization Resources
├── client/                       # React TypeScript Frontend
│   ├── src/
│   │   ├── app/                 # Main App Components
│   │   ├── assets/              # Static Assets
│   │   └── lib/                 # API Integration
│   └── public/                  # Public Assets & Map Tiles
└── README.md
```

## 🌐 API Endpoints

### Features
- `GET /api/v1/features` - Get all features (with pagination support)
- `GET /api/v1/features/{id}` - Get feature by ID
- `POST /api/v1/features` - Create new feature
- `POST /api/v1/features/addRange` - Create multiple features
- `PUT /api/v1/features/{id}` - Update feature
- `DELETE /api/v1/features/{id}` - Delete feature
- `GET /api/v1/features/count` - Get features count
- `GET /api/v1/features/getByBoundingBox` - Get features by bounding box

### Roads
- `GET /api/v1/roads` - Get roads by bounding box

## 🗺️ Geospatial Features

- **PostGIS Integration**: Leverage PostgreSQL PostGIS for spatial data storage
- **Geometry Support**: Store and query various geometry types (Points, Lines, Polygons)
- **Spatial Queries**: Bounding box queries for efficient map-based data retrieval
- **WKT Support**: Well-Known Text format for geometry representation
- **Map Visualization**: Interactive maps with custom tile layers

## 🔧 Configuration

### API Configuration
Key configuration files:
- `appsettings.json` - Production settings
- `appsettings.Development.json` - Development settings
- `launchSettings.json` - Launch profiles

### Frontend Configuration
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## 🚀 Development

### Running in Development Mode

**Backend:**
```bash
cd API
dotnet watch run
```

**Frontend:**
```bash
cd client
npm run dev
```

### Building for Production

**Backend:**
```bash
cd API
dotnet publish -c Release
```

**Frontend:**
```bash
cd client
npm run build
```

## 🧪 Testing

### Backend Testing
```bash
cd API
dotnet test
```

### Frontend Testing
```bash
cd client
npm run lint
```

## 📚 Technologies Used

### Backend
- **.NET 9** - Web API Framework
- **Entity Framework Core 9** - ORM
- **PostgreSQL** - Database
- **PostGIS** - Spatial Database Extension
- **NetTopologySuite** - .NET Spatial Library
- **Swagger/OpenAPI** - API Documentation
- **Asp.Versioning** - API Versioning

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **OpenLayers** - Mapping Library
- **Axios** - HTTP Client
- **ESLint** - Code Linting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **hkayrad** - *Initial work* - [hkayrad](https://github.com/hkayrad)

## 🙏 Acknowledgments

- Basarsoft for the project requirements
- OpenLayers community for the mapping library
- PostGIS community for spatial database capabilities