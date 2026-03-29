<div align="center">
<a id="top"></a>

# EventsHub - The Future of Events is Here.

### College Event Management Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)](https://github.com/kushalvachar2006/EventsHub)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://react.dev/versions) 
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)

**A role-driven event management platform that centralizes college events and simplifies student participation approvals.**

**Live Demo**: [EventsHub](https://events-hub-kva.netlify.app/)

[About](#about) •
[Features](#features) • 
[Tech Stack](#tech-stack) • 
[Getting Started](#getting-started) • 
[Contributing](#contributing) 


</div>

---

## <a id="about"></a> 📖 About
**EventsHub** is a comprehensive MERN stack–based, role-driven event management platform designed to centralize college events and streamline student participation approvals. The platform addresses real-world challenges in college event visibility and approval workflows through a digitized, efficient system.

### The Problems :

- **Event Discovery**: Students struggle to find relevant college events scattered across multiple platforms
- **Registration Difficulty**: Event hosts face difficulties managing large volumes of registrations manually
- **Approval Delays**: Paper-based HOD approval processes cause delays and inefficiencies

### Our Solution

EventsHub provides a unified platform where:
- 🎓 **Students** can easily discover and register for college-specific events
- 🎤 **Event Hosts** can efficiently manage registrations and select participants
- 👔 **Admin** can digitally approve participation requests with one click

---

## <a id="features"></a> Features

### For Students
- Browse and discover college-specific events
- One-click event registration
- Track participation approval status in real-time
- Personalized event recommendations
- View event history and upcoming events

### For Event Hosts
- Create and manage events with rich details
- Review and manage student registrations
- Select participants based on custom criteria
- Send automated notifications to participants
- Access event analytics and insights

### For Admin (Head of Department)
- Digital approval dashboard for participation requests
- One-click approve/reject functionality
- Department-wide event participation overview
- Monitor student engagement metrics
- Paperless approval workflow

### Security & Core Features
- JWT-based authentication
- Role-based access control (RBAC)
- Responsive design (mobile-first)
- Real-time notifications
- Advanced search and filtering

---

## <a id="tech-stack"></a> Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3/TailWindCSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **HTTP** - For Server

### Authentication & Security
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

---

## Project Structure

```
EventsHub/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── context/       # Context API
│   │   └── App.js
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Entry point
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## Screenshots
<img width="1365" height="599" alt="image" src="https://github.com/user-attachments/assets/bc65ef4a-b8f8-49a8-bc40-3c091eb12983" />

### Student Dashboard
<img width="715" height="554" alt="image" src="https://github.com/user-attachments/assets/0b2eda43-1e1a-467c-a5ff-9fcc55c76b36" />


### Event Host Dashboard
<img width="689" height="463" alt="image" src="https://github.com/user-attachments/assets/f5ee3c1d-db65-4b69-bea4-d05991b896df" />


### Admin Dashboard
<img width="690" height="488" alt="image" src="https://github.com/user-attachments/assets/049e00a6-ebd4-4f7a-8c41-6b04dd34e742" />

---
## <a id="getting-started"></a> Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kushalvachar2006/EventsHub.git
   cd EventsHub
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb://localhost:27017/eventshub
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventshub

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d

   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the Development Servers**

   **Backend** (Terminal 1):
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:5000
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd client
   npm start
   # Client runs on http://localhost:3000
   ```

6. **Access the Application**
   
   Open your browser and navigate to `http://localhost:3000`
---

## <a id="contributing"></a> Contributing

We welcome contributions from the community! EventsHub is open-source and we encourage you to fork the repository and extend it with new features or enhancements.

### How to Contribute

1. **Fork the Repository**
   - Click the 'Fork' button at the top right of this repository

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/EventsHub.git
   cd EventsHub
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add comments where necessary

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: amazing new feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click 'New Pull Request'
   - Select your feature branch
   - Describe your changes in detail
     
---

## Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/kushalvachar2006/EventsHub/issues)
- **Email**: kushalv1306@gmail.com
- **Discussions**: [Join our discussions](https://github.com/kushalvachar2006/EventsHub/discussions)

---

## Author
<div align="center" style="font-size:28px; font-weight:700; padding:8px 16px; border-radius:10px; background:#1f2937; color:#ffffff;">
  Kushal V Achar
</div>



- GitHub: [@kushalvachar2006](https://github.com/kushalvachar2006)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/kushal-v-achar-796049317/)

---

<div align="center">

[⬆ Back to Top](#top)


</div>
