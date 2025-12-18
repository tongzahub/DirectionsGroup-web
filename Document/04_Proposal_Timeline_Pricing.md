# Project Proposal
## The Bureau of Wonders - Corporate Website Development

**Proposal Number:** BOW-2024-001  
**Date:** 10 December 2024  
**Valid Until:** 10 January 2025  
**Prepared by:** Directions Group

---

## 📋 Executive Summary

Directions Group มีความยินดีนำเสนอ Proposal สำหรับการพัฒนาเว็บไซต์ Corporate ของ The Bureau of Wonders ซึ่งจะเป็นเว็บไซต์ที่สวยงาม ทันสมัย พร้อมระบบ CMS ที่ใช้งานง่าย

---

## 🎯 Project Scope Summary

| Category | Details |
|----------|---------|
| **Web Pages** | 6 Pages (Homepage, About, Services, Blog, Careers, Contact) |
| **CMS** | Strapi Headless CMS |
| **Design** | Based on Figma (ลูกค้าจัดเตรียม) |
| **Hosting** | AWS (ECS, RDS, CloudFront, S3) |
| **Features** | Blog, Case Studies, Contact Form, SEO |

---

## 📅 Project Timeline

### Total Duration: 8-10 Weeks

```
Week 1-2     │ Week 3-4     │ Week 5-6     │ Week 7-8     │ Week 9-10
─────────────┼──────────────┼──────────────┼──────────────┼──────────────
 Discovery   │  UI/UX &     │  Frontend    │  Backend &   │  Testing &
 & Planning  │  Design      │  Development │  Integration │  Launch
             │  Review      │              │              │
```

### Detailed Timeline

| Phase | Duration | Activities | Deliverables |
|-------|----------|------------|--------------|
| **Phase 1: Discovery & Planning** | 1 Week | Requirement Analysis, Tech Setup, Figma Review | Project Plan, Tech Doc |
| **Phase 2: Design Review** | 1-2 Weeks | Figma Review, Design Adjustments, Component Planning | Approved Design |
| **Phase 3: Frontend Development** | 2 Weeks | Next.js Development, Component Building, Responsive Design | Working Frontend |
| **Phase 4: Backend & CMS** | 1.5 Weeks | Strapi Setup, Content Types, API Integration | CMS Ready |
| **Phase 5: Integration** | 1 Week | Frontend-Backend Integration, Contact Form, SEO | Integrated System |
| **Phase 6: Testing** | 1 Week | QA Testing, Bug Fixes, Performance Optimization | QA Report |
| **Phase 7: Deployment** | 0.5 Week | AWS Setup, Go-Live, Training | Live Website |

---

## 👥 Team & Manday Estimation

### Team Structure

| Role | Responsibility | Allocation |
|------|---------------|------------|
| **Project Manager** | Planning, Client Communication | 20% |
| **Frontend Developer (Senior)** | Next.js Development, UI | 100% |
| **Frontend Developer (Mid)** | Components, Responsive | 50% |
| **Backend Developer** | Strapi CMS, API | 60% |
| **DevOps Engineer** | AWS, Docker, CI/CD | 30% |
| **QA Engineer** | Testing, Bug Reporting | 30% |

### Manday Breakdown

| Phase | Frontend (Sr) | Frontend (Mid) | Backend | DevOps | QA | PM | Total |
|-------|---------------|----------------|---------|--------|----|----|-------|
| Phase 1: Discovery | 1 | 0 | 1 | 1 | 0 | 2 | **5** |
| Phase 2: Design Review | 2 | 1 | 0 | 0 | 0 | 1 | **4** |
| Phase 3: Frontend Dev | 8 | 6 | 0 | 0 | 0 | 1 | **15** |
| Phase 4: Backend/CMS | 2 | 0 | 8 | 1 | 0 | 1 | **12** |
| Phase 5: Integration | 3 | 1 | 3 | 1 | 1 | 1 | **10** |
| Phase 6: Testing | 2 | 1 | 2 | 1 | 4 | 1 | **11** |
| Phase 7: Deployment | 1 | 0 | 1 | 3 | 1 | 1 | **7** |
| **Total Mandays** | **19** | **9** | **15** | **7** | **6** | **8** | **64** |

---

## 📋 Manday Estimation by Requirement

> ประเมิน Manday ตาม Requirement แต่ละข้อจากเอกสาร requirement.md

### 1. Website Structure (Frontend Pages)

| Page | Features | Frontend | Backend | QA | Mandays |
|------|----------|----------|---------|----| --------|
| **Homepage** | Hero, Introduction, Featured content, CTA | 3 | 0.5 | 0.5 | **4** |
| **About Page** | Brand Story, Philosophy, Who We Are, Leadership, Values | 3 | 0.5 | 0.5 | **4** |
| **Services Page** | 3 Service categories, 10 Industries list | 2.5 | 0.5 | 0.5 | **3.5** |
| **Blog/Insights/News** | Article listing, Search/Filter, Categories | 3 | 1 | 0.5 | **4.5** |
| **Case Study Layout** | Challenge, Strategy, Execution, Results, Gallery | 2.5 | 1 | 0.5 | **4** |
| **Careers Page** | Culture, Values, Open positions list | 2 | 0.5 | 0.5 | **3** |
| **Contact Page** | Contact form, Office details, Map | 2 | 0.5 | 0.5 | **3** |
| **Subtotal (Pages)** | | | | | **26** |

### 2. Backend Requirements (CMS & API)

| Requirement | Description | Backend | Frontend | QA | Mandays |
|-------------|-------------|---------|----------|----| --------|
| **CMS Setup & Integration** | Strapi installation, Configuration | 2 | 0 | 0.5 | **2.5** |
| **Blog/Insights CMS** | Create/Edit/Schedule posts, Categories/Tags | 2 | 1 | 0.5 | **3.5** |
| **Homepage CMS** | Editable Hero, Introduction text | 1 | 0.5 | 0.25 | **1.75** |
| **About Page CMS** | Story, Philosophy, Values fields | 1 | 0.5 | 0.25 | **1.75** |
| **Services CMS** | Service descriptions, Industries list | 1 | 0.5 | 0.25 | **1.75** |
| **Careers CMS** | Add/Remove job postings | 1 | 0.5 | 0.25 | **1.75** |
| **Contact CMS** | Address, Phone, Email fields | 0.5 | 0.25 | 0.25 | **1** |
| **Case Study Management** | Structured template (Challenge/Strategy/Execution/Results/Images) | 1.5 | 1 | 0.5 | **3** |
| **Contact Form Backend** | Email notifications to team | 1 | 0.5 | 0.5 | **2** |
| **Form Data Storage** | Store inquiries in CMS/Database | 0.5 | 0 | 0.25 | **0.75** |
| **SEO Fields** | Meta title, description, OG data per page | 1 | 0.5 | 0.25 | **1.75** |
| **Subtotal (Backend)** | | | | | **21.5** |

### 3. Design & UI Implementation

| Requirement | Description | Frontend | Mandays |
|-------------|-------------|----------|---------|
| **Blue-White Color Theme** | Implement color palette (#4DA3FF, #1877F2, etc.) | 0.5 | **0.5** |
| **Minimal Dynamic Layout** | Clean layouts, whitespace, soft colors | 1 | **1** |
| **Rounded Corners & Shadows** | Card designs (12-20px radius) | 0.5 | **0.5** |
| **Hero Gradients** | Blue gradient headers/sections | 0.5 | **0.5** |
| **Micro-interactions** | Fade, slide, hover effects | 2 | **2** |
| **Responsive Design** | Mobile-first, Desktop, Tablet | 3 | **3** |
| **Subtotal (Design)** | | | **7.5** |

### 4. Infrastructure & DevOps

| Task | Description | DevOps | Backend | Mandays |
|------|-------------|--------|---------|---------|
| **Docker Setup** | Containerization (Frontend + CMS) | 1 | 0.5 | **1.5** |
| **AWS Infrastructure** | VPC, ECS, RDS, S3, CloudFront setup | 2 | 0 | **2** |
| **CI/CD Pipeline** | GitHub Actions / CodePipeline | 1.5 | 0 | **1.5** |
| **SSL & Domain** | ACM Certificate, Route53 config | 0.5 | 0 | **0.5** |
| **Monitoring Setup** | CloudWatch, Alerts | 0.5 | 0 | **0.5** |
| **Subtotal (DevOps)** | | | | **6** |

### 5. Project Management & Documentation

| Task | PM | Others | Mandays |
|------|----| -------|---------|
| **Project Planning** | 1.5 | 0.5 | **2** |
| **Client Communication** | 2 | 0 | **2** |
| **Documentation** | 1 | 1 | **2** |
| **Training Session** | 0.5 | 0.5 | **1** |
| **Subtotal (PM)** | | | **7** |

---

### 📊 Summary by Category

| Category | Mandays | % of Total |
|----------|---------|------------|
| Website Pages (Frontend) | 26 | 38% |
| Backend/CMS Features | 21.5 | 31% |
| Design & UI | 7.5 | 11% |
| Infrastructure & DevOps | 6 | 9% |
| PM & Documentation | 7 | 10% |
| **Total** | **68** | 100% |

> **หมายเหตุ:** ตัวเลขรวม 68 Mandays แตกต่างจากตาราง Phase-based (64 Mandays) เล็กน้อย เนื่องจากการ overlap ของงานบางส่วน ใช้ตัวเลข **64 Mandays** สำหรับการคำนวณราคา

---

## 💰 Pricing

### Development Cost Breakdown

> อ้างอิงราคาตลาดประเทศไทย 2024

| Role | Rate/Day (THB) | Mandays | Amount (THB) |
|------|----------------|---------|--------------|
| Project Manager | ฿6,000 | 8 | ฿48,000 |
| Senior Frontend Developer | ฿8,000 | 19 | ฿152,000 |
| Mid Frontend Developer | ฿5,500 | 9 | ฿49,500 |
| Backend Developer | ฿7,000 | 15 | ฿105,000 |
| DevOps Engineer | ฿7,500 | 7 | ฿52,500 |
| QA Engineer | ฿4,500 | 6 | ฿27,000 |
| **Subtotal (Development)** | | **64** | **฿434,000** |

### Additional Costs

| Item | Amount (THB) | Note |
|------|--------------|------|
| Project Management & Overhead (15%) | ฿65,100 | |
| Contingency & Buffer (10%) | ฿43,400 | สำหรับ Unforeseen issues |
| **Additional Total** | | **฿108,500** |

---

## 📊 Total Project Investment

| Category | Amount (THB) |
|----------|--------------|
| Development Cost | ฿434,000 |
| PM & Overhead | ฿65,100 |
| Contingency | ฿43,400 |
| **Total (Excluding VAT)** | **฿542,500** |
| VAT 7% | ฿37,975 |
| **Grand Total (Including VAT)** | **฿580,475** |

### 💡 Package Options

| Package | Features | Price (THB) |
|---------|----------|-------------|
| **Standard** | Full scope as described | **฿580,000** |
| **Premium** | + 6 months maintenance, + Training (4 hours), + Priority support | **฿680,000** |
| **Enterprise** | + 12 months maintenance, + Advanced analytics, + Dedicated support | **฿850,000** |

---

## 💳 Payment Terms

| Milestone | Percentage | Amount (THB) | Trigger |
|-----------|------------|--------------|---------|
| **1. Project Kickoff** | 30% | ฿174,000 | ลงนามสัญญา |
| **2. Design Approval** | 20% | ฿116,000 | Approve Figma Implementation |
| **3. Development Complete** | 30% | ฿174,000 | Frontend + CMS Ready |
| **4. Go-Live** | 20% | ฿116,000 | Website Live + Training |
| **Total** | 100% | **฿580,000** | |

---

## 🔄 Recurring Costs (After Go-Live)

> ค่าใช้จ่ายประจำเดือนหลังจากเปิดใช้งาน

| Item | Monthly (THB) | Yearly (THB) |
|------|---------------|--------------|
| **AWS Hosting** | ฿12,000 | ฿144,000 |
| **Domain (.com)** | ฿50 | ฿600 |
| **SSL Certificate** | Free | Free |
| **Total** | **฿12,050** | **฿144,600** |

### Optional: Maintenance Package

| Package | Includes | Monthly (THB) |
|---------|----------|---------------|
| **Basic** | Bug fixes, Security patches, 2 hours support | ฿8,000 |
| **Standard** | + Content updates, 5 hours support, Monthly report | ฿15,000 |
| **Premium** | + Feature updates, 10 hours support, Priority response | ฿25,000 |

---

## ✅ What's Included

| Item | ✅ |
|------|---|
| 6 Web Pages (Responsive) | ✅ |
| Strapi CMS with Admin Panel | ✅ |
| Blog System with Categories | ✅ |
| Case Study Template | ✅ |
| Contact Form with Email | ✅ |
| SEO Optimization | ✅ |
| AWS Deployment | ✅ |
| Source Code (GitHub) | ✅ |
| Documentation | ✅ |
| Training (2 hours) | ✅ |
| 30-day Bug Fix Warranty | ✅ |

---

## ❌ What's Not Included

| Item |
|------|
| Content Writing (Text, Copy) |
| Photography / Videography |
| Logo Design / Branding |
| Monthly Hosting Cost |
| Multi-language Support |
| E-commerce Features |

---

## 📎 Terms & Conditions

1. **Scope Changes:** การเปลี่ยนแปลง Scope จะต้องผ่าน Change Request และอาจมีค่าใช้จ่ายเพิ่มเติม
2. **Payment:** Invoice จะถูกส่งตาม Milestone และมีเครดิต 15 วัน
3. **Warranty:** รับประกันแก้ไข Bug ฟรี 30 วันหลัง Go-Live
4. **Cancellation:** หากยกเลิกโปรเจค ค่าใช้จ่ายที่เกิดขึ้นแล้วจะไม่คืน
5. **Intellectual Property:** Source code เป็นกรรมสิทธิ์ของลูกค้าหลังชำระเงินครบ
6. **Confidentiality:** ข้อมูลทั้งหมดจะถูกเก็บเป็นความลับ

---

## 🤝 Why Choose Directions Group?

| Strength | Description |
|----------|-------------|
| **Experience** | ประสบการณ์พัฒนาเว็บไซต์ Corporate มากกว่า 50 โปรเจค |
| **Technology** | ใช้ Technology ทันสมัย (Next.js, Strapi, AWS) |
| **Quality** | มาตรฐานการพัฒนาระดับสากล |
| **Support** | ทีม Support พร้อมให้บริการ |
| **Transparency** | รายงานความคืบหน้าทุกสัปดาห์ |

---

## 📞 Contact

**Directions Group Co., Ltd.**

| | |
|---|---|
| **Address** | [Company Address] |
| **Phone** | [Phone Number] |
| **Email** | [Email Address] |
| **Website** | [Website URL] |

---

## ✍️ Acceptance

เมื่อลงนามด้านล่าง ถือว่าลูกค้ายอมรับเงื่อนไขทั้งหมดในเอกสารนี้

| | Client | Service Provider |
|---|--------|------------------|
| **Company** | The Bureau of Wonders | Directions Group Co., Ltd. |
| **Name** | | |
| **Position** | | |
| **Signature** | | |
| **Date** | | |
