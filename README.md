# 🐕 CustomK9 - Comprehensive Dog Training Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Odoo](https://img.shields.io/badge/Odoo-ERP-714B67?style=for-the-badge&logo=odoo&logoColor=white)](https://www.odoo.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> A modern, full-stack dog training management platform that revolutionizes how training businesses operate, manage clients, and deliver exceptional service experiences.

## 🌟 Platform Overview

CustomK9 is a sophisticated business management platform designed specifically for professional dog training services. Built with modern web technologies and integrated with Odoo ERP, it provides a comprehensive solution for managing every aspect of a dog training business.

### 🎯 Key Personas

- **👨‍💼 Business Owners (Admin)**: Complete business oversight with financial dashboards, analytics, and management tools
- **🏋️‍♀️ Professional Trainers**: Specialized interface for session management, progress tracking, and client communication
- **👨‍👩‍👧‍👦 Dog Owners (Clients)**: Intuitive portal for booking sessions, tracking progress, and managing dog profiles

## ✨ Core Features

### 🏢 **Admin Dashboard**
- **Financial Analytics**: Revenue tracking, service performance metrics, appointment analytics
- **Business Intelligence**: Real-time charts and graphs with time-series data
- **Quick Actions**: Streamlined registration, editing, and management workflows
- **Comprehensive Management**: Dogs, owners, trainers, appointments, and services
- **Card-Based Interface**: YouTube-style intuitive cards for all data visualization

### 👨‍🏫 **Trainer Interface**
- **Session Management**: Track appointments, add detailed session notes
- **Progress Monitoring**: Visual progress bars and training milestones
- **Client Communication**: Notes visible to dog owners and admins
- **Specialized Dashboard**: Trainer-specific views and quick actions
- **Assignment Management**: View assigned dogs and training plans

### 🏠 **Client Portal**
- **Smart Booking System**: Advanced appointment scheduling with conflict prevention
- **Dog Profile Management**: Comprehensive dog information with breed API integration
- **Progress Tracking**: Visual training progress and milestone achievements
- **Training Plans**: Access to personalized training schedules and goals
- **Event Participation**: Browse and register for group classes and events

### 🔧 **Advanced Technical Features**
- **Real-time Synchronization**: Live data integration with Odoo ERP
- **Mobile-First Design**: Responsive across all devices with modern UI/UX
- **Smart Validation**: Comprehensive form validation with visual feedback
- **API Integration**: Dog Breeds API for 283+ breed auto-population
- **Timezone Handling**: Proper UTC management across different locations

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.3.2**: React framework with App Router and server-side rendering
- **React 19.0.0**: Modern component architecture with hooks and context
- **TypeScript 5.0**: Static typing for enhanced development experience
- **Tailwind CSS 4.0**: Utility-first CSS framework for rapid UI development
- **Horizon UI Free**: Professional dashboard components and layouts

### **Backend & Integration**
- **Odoo ERP**: Business logic, data management, and CRM functionality
- **Custom API Layer**: Next.js API routes for Odoo integration
- **Authentication Service**: Session management and role-based access control
- **RESTful APIs**: Clean API design for all data operations

### **Development & Deployment**
- **ESLint**: Code quality and consistency enforcement
- **PostCSS**: CSS processing and optimization
- **Vercel**: Seamless deployment and hosting platform
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - JavaScript runtime environment
- **Odoo ERP Instance** - Backend business management system
- **Git** - Version control system

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/customk9.git
   cd customk9
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env.local file with:
   NEXT_PUBLIC_ODOO_BASE_URL=your_odoo_url
   NEXT_PUBLIC_ODOO_DATABASE=your_database
   NEXT_PUBLIC_ODOO_ADMIN_USERNAME=admin_email
   NEXT_PUBLIC_ODOO_ADMIN_PASSWORD=admin_password
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture & Design

### **Design Principles**
- **NN Group Guidelines**: User experience best practices
- **Gestalt Principles**: Visual hierarchy and cognitive design patterns
- **Mobile-First**: Responsive design starting from mobile devices
- **Accessibility**: WCAG 2.1 compliance for inclusive design
- **Consistency**: Unified design system across all personas

### **Technical Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   API Routes    │    │   Odoo ERP      │
│                 │◄──►│                 │◄──►│                 │
│ • Admin UI      │    │ • Auth Service  │    │ • Business Logic│
│ • Trainer UI    │    │ • Data Service  │    │ • Data Storage  │
│ • Client Portal │    │ • Validation    │    │ • User Mgmt     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Authentication Flow**
1. **User Registration/Login**: Secure authentication through client portal
2. **Session Management**: Dual session handling (Next.js + Odoo)
3. **Role-Based Access**: Automatic permission assignment based on user role
4. **Data Isolation**: Secure data separation using Odoo record rules

## 📁 Project Structure

```
customk9/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin interface (planned)
│   │   ├── trainer/           # Trainer interface (planned)
│   │   ├── client-area/       # Customer portal
│   │   ├── api/               # API routes
│   │   └── components/        # Reusable UI components
│   ├── services/              # Business logic services
│   │   ├── auth/              # Authentication service
│   │   └── odoo/              # Odoo integration
│   └── types/                 # TypeScript type definitions
├── docs/                      # Documentation
├── public/                    # Static assets
└── CUSTOMK9_DEVELOPMENT_ROADMAP.md
```

## 🎨 UI/UX Features

### **Modern Design Elements**
- **Horizon UI Free**: Professional dashboard components
- **Acrylic & Skeuomorphic**: Modern glass-morphism effects
- **Floating Navigation**: Dynamic navbar with contextual actions
- **Card-Based Interface**: Intuitive information display
- **Progress Visualization**: Training progress bars and milestones

### **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Tablet & Desktop**: Scalable layouts for all screen sizes
- **Touch-Friendly**: Optimized for touch interactions
- **Cross-Browser**: Compatible with all modern browsers

## 🔧 Development Status

### **Current Phase**: Platform Refinement (July-August 2025)

**🔴 Priority 1: Critical Bug Fixes**
- ✅ Registration form validation overhaul
- ⏳ Odoo appointment deletion functionality
- ⏳ Double-booking prevention system

**🟡 Priority 2: Admin/Trainer Interfaces**
- ⏳ Admin dashboard with financial analytics
- ⏳ Trainer interface with session management
- ⏳ Role-based access control implementation

**🟠 Priority 3: UI/UX Enhancements**
- ⏳ Responsive navbar redesign
- ⏳ Dog registration workflow improvement
- ⏳ Mobile-first design implementation

See [Development Roadmap](CUSTOMK9_DEVELOPMENT_ROADMAP.md) for detailed timeline and tasks.

## 📊 Key Metrics & Goals

### **Technical Targets**
- 🎯 **Performance**: Page load times <3 seconds
- 🎯 **Accessibility**: WCAG 2.1 AA compliance (90%+ score)
- 🎯 **Mobile**: Responsive design score >90
- 🎯 **Quality**: 95%+ form validation coverage
- 🎯 **Reliability**: Zero critical bugs in production

### **Business Objectives**
- 📈 **User Experience**: Reduced registration abandonment
- 📈 **Efficiency**: Improved booking completion rates
- 📈 **Satisfaction**: Positive feedback on admin/trainer interfaces
- 📈 **Growth**: Successful organizational handover by August 2025

## 🤝 Contributing

We welcome contributions to the CustomK9 platform! Please read our [Development Roadmap](CUSTOMK9_DEVELOPMENT_ROADMAP.md) for current priorities and upcoming features.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Follow our coding standards (ESLint configuration)
4. Submit a pull request

## 📚 Documentation

- **[Development Roadmap](CUSTOMK9_DEVELOPMENT_ROADMAP.md)** - Detailed project timeline and tasks
- **[Odoo Integration Guide](docs/odoo-user-groups-integration.md)** - Backend setup instructions
- **[Calendar API Guide](docs/odoo-calendar-api-guide.md)** - Appointment system documentation
- **[Deployment Guide](docs/appointment-implementation-guide.md)** - Production deployment instructions

## 🚀 Deployment

### **Vercel Deployment** (Recommended)
```bash
npm run build
vercel --prod
```

### **Manual Deployment**
1. Configure environment variables in your hosting platform
2. Ensure Odoo instance accessibility
3. Set up proper CORS configuration
4. Deploy using your preferred Node.js hosting service

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/customk9/issues)
- **Documentation**: Available in the `docs/` directory
- **Development**: See [Development Roadmap](CUSTOMK9_DEVELOPMENT_ROADMAP.md)

---

**Built with ❤️ for the dog training community**

*CustomK9 Platform - Transforming dog training businesses through technology*
