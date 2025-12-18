# AWS Deployment Plan
## The Bureau of Wonders - Corporate Website

**Document Version:** 1.0  
**Date:** 10 December 2024  
**Client:** The Bureau of Wonders / Directions Group

---

## 📋 Executive Summary

เอกสารนี้อธิบายแผนการ Deploy เว็บไซต์ The Bureau of Wonders บน Amazon Web Services (AWS) รวมถึง Services ที่จะใช้งาน, การประมาณค่าใช้จ่าย และ Architecture Diagram

---

## 🏗️ AWS Architecture

```
                         ┌───────────────────────────┐
                         │       Route 53            │
                         │    (DNS Management)       │
                         └───────────────────────────┘
                                     │
                                     ▼
                         ┌───────────────────────────┐
                         │    AWS Certificate        │
                         │    Manager (SSL/TLS)      │
                         └───────────────────────────┘
                                     │
                                     ▼
                         ┌───────────────────────────┐
                         │      CloudFront           │
                         │   (Global CDN + WAF)      │
                         └───────────────────────────┘
                                     │
              ┌──────────────────────┴──────────────────────┐
              ▼                                              ▼
┌───────────────────────────────┐          ┌───────────────────────────────┐
│   Application Load Balancer   │          │   Application Load Balancer   │
│        (Frontend)             │          │         (CMS API)             │
└───────────────────────────────┘          └───────────────────────────────┘
              │                                              │
              ▼                                              ▼
┌───────────────────────────────┐          ┌───────────────────────────────┐
│       ECS Fargate             │          │       ECS Fargate             │
│   (Next.js Frontend)          │          │     (Strapi CMS)              │
│   - 2 Tasks (HA)              │          │   - 2 Tasks (HA)              │
└───────────────────────────────┘          └───────────────────────────────┘
                                                         │
                                                         ▼
                                           ┌───────────────────────────────┐
                                           │        RDS PostgreSQL         │
                                           │       (db.t3.medium)          │
                                           │   - Multi-AZ for HA           │
                                           └───────────────────────────────┘
                                                         │
                                                         ▼
                                           ┌───────────────────────────────┐
                                           │          S3 Bucket            │
                                           │   (Media/Assets Storage)      │
                                           │   + Backup Storage            │
                                           └───────────────────────────────┘
```

---

## 📦 AWS Services Required

### 1. Compute & Containers

| Service | Purpose | Specification |
|---------|---------|---------------|
| **Amazon ECS (Fargate)** | Container Orchestration | 2 Services (Frontend + CMS) |
| **ECR (Elastic Container Registry)** | Docker Image Storage | 2 Repositories |

**Configuration:**
- Frontend: 0.5 vCPU / 1 GB Memory × 2 Tasks
- CMS: 1 vCPU / 2 GB Memory × 2 Tasks

### 2. Database

| Service | Purpose | Specification |
|---------|---------|---------------|
| **RDS PostgreSQL** | Application Database | db.t3.medium (2 vCPU, 4GB RAM) |

**Configuration:**
- Multi-AZ deployment สำหรับ High Availability
- Storage: 50 GB SSD (gp3)
- Automated Backups: 7 days retention
- Encryption at rest enabled

### 3. Storage

| Service | Purpose | Specification |
|---------|---------|---------------|
| **S3** | Media Storage | Standard + Intelligent Tiering |
| **S3** | Backup Storage | Standard-IA / Glacier |

**Configuration:**
- Media Bucket: Cross-origin resource sharing (CORS) enabled
- Lifecycle rules สำหรับ cost optimization
- Versioning enabled

### 4. Networking & Security

| Service | Purpose |
|---------|---------|
| **VPC** | Isolated Network Environment |
| **Application Load Balancer (ALB)** | Traffic Distribution × 2 |
| **Security Groups** | Firewall Rules |
| **AWS WAF** | Web Application Firewall |
| **AWS Shield Standard** | DDoS Protection (Free) |

### 5. Content Delivery & DNS

| Service | Purpose |
|---------|---------|
| **CloudFront** | Global CDN with Edge Caching |
| **Route 53** | DNS Management |
| **ACM (Certificate Manager)** | SSL/TLS Certificates (Free) |

### 6. Monitoring & Logging

| Service | Purpose |
|---------|---------|
| **CloudWatch** | Logs & Metrics |
| **CloudWatch Alarms** | Alerting |
| **AWS SNS** | Notification Service |

### 7. CI/CD (Optional)

| Service | Purpose |
|---------|---------|
| **CodePipeline** | Automated Deployment Pipeline |
| **CodeBuild** | Container Image Build |
| **GitHub Actions** | Alternative CI/CD (Recommended) |

---

## 💰 Monthly Cost Estimation (THB)

> อ้างอิงอัตราแลกเปลี่ยน 1 USD = 35 THB  
> Prices based on AWS Asia Pacific (Singapore) Region

### Production Environment

| Service | Configuration | Est. Monthly (USD) | Est. Monthly (THB) |
|---------|---------------|--------------------|--------------------|
| **ECS Fargate (Frontend)** | 0.5 vCPU × 2 Tasks × 730h | ~$30 | ฿1,050 |
| **ECS Fargate (CMS)** | 1 vCPU × 2 Tasks × 730h | ~$60 | ฿2,100 |
| **RDS PostgreSQL** | db.t3.medium Multi-AZ | ~$140 | ฿4,900 |
| **ALB** | 2 Load Balancers | ~$36 | ฿1,260 |
| **CloudFront** | ~100 GB/month | ~$20 | ฿700 |
| **S3** | ~50 GB Storage + Requests | ~$5 | ฿175 |
| **Route 53** | Hosted Zone + Queries | ~$2 | ฿70 |
| **CloudWatch** | Logs & Metrics | ~$15 | ฿525 |
| **ECR** | Image Storage | ~$5 | ฿175 |
| **WAF** | Basic Rules | ~$15 | ฿525 |
| **Data Transfer** | ~50 GB out | ~$5 | ฿175 |

### **Total Estimated Monthly: ~$333 USD (฿11,650 THB)**

### Cost Optimization Options

| Option | Savings | Monthly Cost |
|--------|---------|--------------|
| **Reserved Instances (1 Year)** | ~30% on RDS | ฿10,000 |
| **Savings Plans (1 Year)** | ~20% on Fargate | ฿9,500 |
| **Spot Instances (Dev/Staging)** | ~70% discount | - |

---

## 🚀 Deployment Phases

### Phase 1: Infrastructure Setup (Week 1)
- [ ] Create VPC & Subnets
- [ ] Configure Security Groups
- [ ] Setup RDS PostgreSQL
- [ ] Create S3 Buckets
- [ ] Setup ECR Repositories

### Phase 2: Application Deployment (Week 2)
- [ ] Build & Push Docker Images
- [ ] Create ECS Cluster & Services
- [ ] Configure Load Balancers
- [ ] Setup CloudFront Distribution
- [ ] Configure Route 53 DNS

### Phase 3: Security & Monitoring (Week 3)
- [ ] Install SSL Certificates
- [ ] Configure WAF Rules
- [ ] Setup CloudWatch Alarms
- [ ] Configure Backup Policies
- [ ] Security Audit

### Phase 4: Go-Live (Week 4)
- [ ] DNS Cutover
- [ ] Performance Testing
- [ ] Go-Live Checklist
- [ ] Post-Launch Monitoring

---

## 🔒 Security Considerations

1. **Network Security**
   - Private subnets for RDS
   - NAT Gateway for outbound traffic
   - Bastion host for admin access

2. **Application Security**
   - WAF with OWASP rules
   - Rate limiting
   - IP whitelisting for CMS

3. **Data Security**
   - Encryption at rest (RDS, S3)
   - Encryption in transit (TLS/SSL)
   - Regular security patches

4. **Access Control**
   - IAM roles & policies
   - MFA for admin accounts
   - Least privilege principle

---

## 📞 Support & Maintenance

| Item | Recommendation |
|------|----------------|
| **AWS Support** | Business Plan (~$100/month) |
| **Maintenance Window** | Weekly (Sunday 2-4 AM) |
| **Backup Retention** | 7 days (Automated) |
| **Monitoring** | 24/7 CloudWatch Alarms |

---

## 📄 Alternative Deployment Options

### Option A: AWS Amplify (Simpler)
- **Pros:** Easier setup, integrated CI/CD
- **Cons:** Less flexibility, higher cost at scale
- **Cost:** ~$50-100/month

### Option B: Vercel + Railway (Recommended for MVP)
- **Frontend:** Vercel (Free tier available)
- **CMS:** Railway / Render
- **Database:** Supabase / PlanetScale
- **Cost:** ~$30-50/month

### Option C: Full AWS (This Document)
- **Pros:** Full control, enterprise-grade
- **Cons:** Higher complexity, higher cost
- **Cost:** ~$300-500/month
