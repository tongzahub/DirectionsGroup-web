# About Page Setup Guide

## ภาพรวม

About Page ได้รับการอัพเดทให้มีเมนูย่อย (submenu) พร้อมหน้าย่อยต่างๆ ดังนี้:

1. **Brand Story** - เรื่องราวการก่อตั้งและพัฒนาการของบริษัท
2. **Brand Philosophy** - ปรัชญาและแนวคิดหลักในการทำงาน
3. **Who We Are** - ทีมงานและความเชี่ยวชาญ
4. **Leadership Introduction** - แนะนำผู้บริหารระดับสูง
5. **Our Values** - คุณค่าหลักขององค์กร

## การติดตั้ง

### 1. เริ่มต้น Strapi CMS

```bash
cd bureau-wonders-cms
npm run develop
```

รอจนกว่า Strapi จะเริ่มทำงานที่ `http://localhost:1337`

**ข้อมูล About Sections จะถูก seed อัตโนมัติเมื่อ Strapi เริ่มทำงานครั้งแรก!**

### 2. ตั้งค่า Permissions (สำคัญ!)

เพื่อให้ Frontend เข้าถึงข้อมูลได้ ต้องตั้งค่า permissions:

1. เข้า Strapi Admin: `http://localhost:1337/admin`
2. ไปที่ **Settings** > **Users & Permissions Plugin** > **Roles**
3. คลิกที่ **Public**
4. เลื่อนลงหา **About-section** และเปิดใช้งาน:
   - ✅ find
   - ✅ findOne
5. คลิก **Save**

หรือใช้ API Token:
1. ไปที่ **Settings** > **API Tokens**
2. คลิก **Create new API Token**
3. ตั้งชื่อ: "Frontend Token"
4. Token type: **Read-only**
5. Token duration: **Unlimited**
6. คัดลอก token และเพิ่มใน `bureau-wonders/.env.local`:
   ```
   STRAPI_API_TOKEN=your_token_here
   ```

### 3. เริ่มต้น Frontend

```bash
cd bureau-wonders
npm run dev
```

### 3. เริ่มต้น Frontend

```bash
cd bureau-wonders
npm run dev
```

### 4. ดูผลลัพธ์

เปิดเบราว์เซอร์ไปที่:
- `http://localhost:3000/about` (หรือ port ที่แสดง) - หน้า About หลัก
- `http://localhost:3000/about/brand-story` - Brand Story
- `http://localhost:3000/about/brand-philosophy` - Brand Philosophy
- `http://localhost:3000/about/who-we-are` - Who We Are
- `http://localhost:3000/about/leadership-introduction` - Leadership
- `http://localhost:3000/about/our-values` - Our Values

**หมายเหตุ:** ถ้ายังไม่ได้ตั้งค่า permissions (ขั้นตอนที่ 2) หน้าเว็บจะแสดง error ให้กลับไปตั้งค่าก่อน

## โครงสร้างไฟล์ที่สร้างขึ้น

### CMS (bureau-wonders-cms)

```
src/api/about-section/
├── content-types/
│   └── about-section/
│       └── schema.json          # Schema definition
├── controllers/
│   └── about-section.ts         # API controller
├── services/
│   └── about-section.ts         # Business logic
└── routes/
    └── about-section.ts         # API routes

scripts/
└── seed-about-sections.sh       # Seed script
```

### Frontend (bureau-wonders)

```
app/about/
├── page.tsx                     # หน้า About หลัก
└── [slug]/
    └── page.tsx                 # หน้าย่อยแต่ละ section

components/layout/
└── AboutSubmenu.tsx             # Submenu navigation component

lib/
└── strapi-client.ts             # เพิ่ม methods: getAboutSections(), getAboutSection()

types/
└── index.ts                     # เพิ่ม AboutSection interface
```

## Features

### 1. Submenu Navigation
- แสดงเมนูย่อยแบบ horizontal scroll
- Sticky navigation (ติดด้านบนเมื่อ scroll)
- Active state สำหรับหน้าปัจจุบัน
- Responsive design สำหรับมือถือ

### 2. Dynamic Routing
- ใช้ Next.js dynamic routes `[slug]`
- SEO-friendly URLs
- ISR (Incremental Static Regeneration) ทุก 300 วินาที

### 3. Content Management
- จัดการเนื้อหาผ่าน Strapi CMS
- Rich text editor
- SEO metadata fields
- Order management สำหรับเรียงลำดับเมนู

## การแก้ไขเนื้อหา

### ผ่าน Strapi Admin Panel

1. เข้า `http://localhost:1337/admin`
2. ไปที่ Content Manager > About Sections
3. เลือก section ที่ต้องการแก้ไข
4. แก้ไขเนื้อหาและกด Save
5. กด Publish เพื่อเผยแพร่

### เพิ่ม Section ใหม่

1. ไปที่ Content Manager > About Sections
2. คลิก "Create new entry"
3. กรอกข้อมูล:
   - Title: ชื่อ section
   - Slug: URL slug (จะสร้างอัตโนมัติจาก title)
   - Content: เนื้อหา (รองรับ Markdown)
   - Order: ลำดับการแสดงผล (เลขน้อยแสดงก่อน)
   - SEO Title & Meta Description (optional)
4. กด Save และ Publish

## API Endpoints

### Get All About Sections
```
GET /api/about-sections?sort=order:asc
```

### Get Single About Section
```
GET /api/about-sections?filters[slug][$eq]=brand-story
```

## Styling

- ใช้ Tailwind CSS
- Color scheme ตาม design system
- Responsive breakpoints: mobile, tablet, desktop
- Smooth transitions และ hover effects

## Performance

- ISR revalidation: 300 seconds
- Optimized images (Next.js Image component)
- CSS-in-JS minimal overhead
- Lazy loading สำหรับ content

## หมายเหตุ

- ต้องมี API Token ที่ถูกต้องใน seed script
- ถ้า seed ไม่สำเร็จ ให้ตรวจสอบว่า Strapi กำลังทำงานอยู่
- สามารถแก้ไข TOKEN ใน `seed-about-sections.sh` ได้ถ้าจำเป็น
