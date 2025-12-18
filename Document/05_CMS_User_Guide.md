# CMS User Guide
## The Bureau of Wonders - Content Management System

**Version:** 1.0  
**Last Updated:** 10 December 2024

---

## 📋 Overview

คู่มือนี้จะแนะนำวิธีการใช้งาน Content Management System (CMS) สำหรับเว็บไซต์ The Bureau of Wonders ซึ่งใช้ Strapi เป็น Headless CMS

---

## 🔐 Getting Started

### Login to CMS

1. เปิด Browser และไปที่ **[CMS URL]/admin**
2. กรอก Email และ Password
3. Click "Login"

---

## 📄 Managing Content

### 1. Blog Posts / Articles

**สร้างบทความใหม่:**
1. ไปที่ **Content Manager** → **Blog Posts**
2. Click **"Create new entry"**
3. กรอกข้อมูล:
   - **Title:** ชื่อบทความ
   - **Slug:** URL path (auto-generate จาก title)
   - **Excerpt:** สรุปสั้นๆ
   - **Content:** เนื้อหาหลัก (รองรับ Rich Text)
   - **Featured Image:** รูปภาพหลัก
   - **Category:** เลือกหมวดหมู่
   - **Tags:** ใส่ Tags ที่เกี่ยวข้อง
   - **Published At:** วันที่เผยแพร่
4. Click **"Save"** แล้ว **"Publish"**

**Categories ที่มี:**
- News
- Insights
- Case Study
- Thought Leadership

---

### 2. Case Studies

**สร้าง Case Study ใหม่:**
1. ไปที่ **Content Manager** → **Case Studies**
2. Click **"Create new entry"**
3. กรอกข้อมูลตาม Template:
   - **Title:** ชื่อโปรเจค
   - **Client:** ชื่อลูกค้า
   - **Industry:** อุตสาหกรรม
   - **Challenge:** ปัญหาที่ต้องแก้ไข
   - **Strategy:** กลยุทธ์ที่ใช้
   - **Execution:** การดำเนินงาน
   - **Results:** ผลลัพธ์ที่ได้
   - **Gallery:** รูปภาพประกอบ (หลายรูป)
4. Click **"Save"** แล้ว **"Publish"**

---

### 3. Careers / Job Postings

**เพิ่มตำแหน่งงาน:**
1. ไปที่ **Content Manager** → **Careers**
2. Click **"Create new entry"**
3. กรอก:
   - **Position:** ชื่อตำแหน่ง
   - **Department:** แผนก
   - **Location:** สถานที่ทำงาน
   - **Type:** Full-time / Part-time / Contract
   - **Description:** รายละเอียดงาน
   - **Requirements:** คุณสมบัติที่ต้องการ
   - **Is Active:** เปิด/ปิด การรับสมัคร
4. Click **"Save"** แล้ว **"Publish"**

---

### 4. Page Content

**แก้ไขเนื้อหาหน้าหลัก:**

| Page | Content Manager Path |
|------|---------------------|
| Homepage | Single Types → Homepage |
| About | Single Types → About Page |
| Services | Single Types → Services Page |
| Contact | Single Types → Contact Page |

**ตัวอย่าง: แก้ไข Homepage**
1. ไปที่ **Single Types** → **Homepage**
2. แก้ไขข้อมูลที่ต้องการ:
   - Hero Title, Hero Subtitle
   - Introduction Text
   - Featured Services
3. Click **"Save"**

---

## 🖼️ Media Library

### Upload Images

1. ไปที่ **Media Library** (icon ด้านซ้าย)
2. Click **"Add new assets"**
3. ลากไฟล์มาวาง หรือ Click เพื่อเลือกไฟล์
4. รองรับ: JPG, PNG, GIF, WebP, SVG, MP4

### Best Practices

| Image Type | Recommended Size | Format |
|------------|------------------|--------|
| Hero Image | 1920 × 1080 px | JPG/WebP |
| Featured Image | 800 × 600 px | JPG/WebP |
| Thumbnail | 400 × 300 px | JPG/WebP |
| Logo | 200 × 60 px | PNG/SVG |

---

## 🔍 SEO Settings

ทุก Page และ Blog Post มี SEO Fields:

| Field | Description | Recommended |
|-------|-------------|-------------|
| **Meta Title** | Title ที่แสดงบน Search Engine | 50-60 ตัวอักษร |
| **Meta Description** | คำอธิบายบน Search Engine | 150-160 ตัวอักษร |
| **OG Image** | รูปภาพเมื่อ Share บน Social | 1200 × 630 px |

---

## 📧 Contact Form Submissions

ดู Contact Form ที่ส่งเข้ามา:

1. ไปที่ **Content Manager** → **Contact Submissions**
2. ดูรายการทั้งหมด
3. Click แต่ละรายการเพื่อดูรายละเอียด

**ข้อมูลที่บันทึก:**
- Name, Company, Email
- Message
- Submitted At (วันที่ส่ง)

---

## 👤 User Management

### Add New Admin User

1. ไปที่ **Settings** → **Administration panel** → **Users**
2. Click **"Create new user"**
3. กรอก: First name, Last name, Email
4. เลือก Role: Super Admin / Editor / Author
5. Click **"Save"**

### Roles & Permissions

| Role | Can Create | Can Edit | Can Delete | Can Publish |
|------|------------|----------|------------|-------------|
| Super Admin | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ |
| Author | ✅ | Own only | ❌ | ❌ |

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Changes not showing on website | รอ 1-2 นาที (Cache update) หรือ Hard refresh (Ctrl+F5) |
| Can't upload large file | ไฟล์ต้องไม่เกิน 10 MB |
| Image looks blurry | ใช้รูปที่มี Resolution สูงกว่า |
| Content not published | ตรวจสอบว่ากด "Publish" แล้ว |

---

## 📞 Support

หากมีปัญหาในการใช้งาน กรุณาติดต่อ:

**Technical Support**  
Email: [support@directionsgroup.com]  
Phone: [Support Phone]  
Available: Mon-Fri 9:00 - 18:00
