# Tech Stack Documentation
## The Bureau of Wonders - Corporate Website

**Document Version:** 1.0  
**Date:** 10 December 2024  
**Client:** The Bureau of Wonders / Directions Group

---

## 📋 Overview

โปรเจคนี้เป็นการพัฒนาเว็บไซต์ Corporate สำหรับ The Bureau of Wonders ซึ่งเป็น Agency ด้าน Communications, PR, Events และ CRM

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.8 | React Framework สำหรับ Server-Side Rendering & Static Generation |
| **React** | 19.2.1 | UI Component Library |
| **TypeScript** | 5.x | Type Safety & Developer Experience |
| **TailwindCSS** | 4.x | Utility-First CSS Framework |
| **Framer Motion** | 12.x | Animation Library สำหรับ Micro-interactions |
| **Axios** | 1.x | HTTP Client สำหรับเชื่อมต่อ API |
| **Heroicons** | 2.2.x | Icon Library |

### Backend (CMS)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Strapi** | 5.31.3 | Headless CMS สำหรับจัดการ Content |
| **PostgreSQL** | 16.x | Production Database |
| **SQLite** | (Dev) | Development Database |
| **Nodemailer** | - | Email Service สำหรับ Contact Form |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **pgAdmin** | Database Management UI |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS CloudFront (CDN)                       │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌─────────────────────┐             ┌─────────────────────────┐
│   Next.js Frontend  │             │    Strapi CMS Backend   │
│   (AWS ECS/Fargate) │◄───────────►│    (AWS ECS/Fargate)    │
└─────────────────────┘             └─────────────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────────┐
                                    │  AWS RDS PostgreSQL │
                                    └─────────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────────┐
                                    │     AWS S3 Bucket   │
                                    │   (Media Storage)   │
                                    └─────────────────────┘
```

---

## 📁 Project Structure

```
DirectionsGroup-web/
├── bureau-wonders/           # Next.js Frontend
│   ├── app/                  # App Router Pages
│   ├── components/           # React Components
│   ├── hooks/                # Custom React Hooks
│   ├── lib/                  # Utility Functions & API
│   ├── public/               # Static Assets
│   ├── styles/               # Global CSS
│   └── types/                # TypeScript Types
│
├── bureau-wonders-cms/       # Strapi CMS
│   ├── config/               # Strapi Configuration
│   ├── src/                  # API & Content Types
│   ├── scripts/              # Seed & Utility Scripts
│   └── public/               # Uploaded Assets
│
├── docker-compose.yml        # Docker Configuration
└── Document/                 # Project Documentation
```

---

## 🎨 Design System

### Color Palette

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary Blue | Soft Sky Blue | `#4DA3FF` |
| CTA Blue | Bright Modern Blue | `#1877F2` |
| Light Background | Mist Blue | `#EAF6FF` |
| Main Background | Pure White | `#FFFFFF` |
| Soft Background | Snow White | `#F7F9FC` |
| Primary Text | Dark Gray | `#1A1A1A` |
| Secondary Text | Cool Gray | `#6B7280` |
| Borders | Soft Gray | `#E5E7EB` |
| Success | Green | `#22C55E` |
| Warning | Orange | `#F59E0B` |
| Error | Red | `#EF4444` |

### UI Guidelines
- Rounded corners (12–20px) for cards
- Soft shadows for depth
- Blue gradients for hero sections
- Subtle micro-animations (fade, slide, hover effects)
- Generous whitespace for clean layout

---

## 🔑 Key Features

1. **Server-Side Rendering (SSR)** - SEO optimized pages
2. **Incremental Static Regeneration (ISR)** - Fast page loads with fresh content
3. **Headless CMS** - Easy content management for non-technical users
4. **Responsive Design** - Mobile-first approach
5. **Animation System** - Smooth micro-interactions
6. **SEO Ready** - Meta tags, OG data, structured data
7. **Contact Form** - Email notifications with form storage

---

## 📞 Contact

**Development Team:** Directions Group  
**Project Manager:** [TBD]  
**Technical Lead:** [TBD]
