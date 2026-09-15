# Jer Yung Frontend

โปรเจกต์นี้ถูกสร้างขึ้นด้วย [Next.js](https://nextjs.org/)

## การติดตั้งและรันโปรเจกต์ (Installation)

คำแนะนำสำหรับการตั้งค่าโปรเจกต์บนเครื่องของคุณ (Local Development) หลังจากที่ทำการโคลน (Clone) Repository มาแล้ว

### 1. ติดตั้ง Dependencies

หลังจากโคลนโปรเจกต์ลงมาที่เครื่องแล้ว ให้เปิด Terminal (หรือ Command Prompt) เข้ามาในโฟลเดอร์ของโปรเจกต์และรันคำสั่งต่อไปนี้ เพื่อติดตั้งแพ็กเกจที่จำเป็น (เลือกใช้ตาม Package Manager ที่คุณถนัด):

```bash
npm install
# หรือ
yarn install
# หรือ
pnpm install
# หรือ
bun install
```

### 2. ตั้งค่า Environment Variables (.env)

โปรเจกต์นี้จำเป็นต้องมีการตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables) เพื่อให้สามารถเชื่อมต่อกับ Backend API หรือบริการอื่นๆ ได้

ให้ทำการสร้างไฟล์ชื่อ `.env.local` ไว้ที่ Root โฟลเดอร์ของโปรเจกต์ (ระดับเดียวกับไฟล์ `package.json`) โดยคุณสามารถนำค่ามาจากไฟล์ต้นฉบับของโปรเจกต์ (สอบถามทีมงาน หรืออ้างอิงจากระบบเดิม) มาใส่ไว้ในไฟล์นี้ 

ตัวอย่างข้อมูลที่ต้องมีในไฟล์ `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://185.84.161.189.nip.io
NEXT_PUBLIC_API_PROXY_URL=/api/backend
BACKEND_API_URL=https://185.84.161.189.nip.io
```
*(หมายเหตุ: URL และค่าต่างๆ ด้านบนเป็นเพียงตัวอย่างอ้างอิงจากต้นฉบับ คุณอาจต้องปรับเปลี่ยนตาม Environment ที่ใช้งานจริง)*

### 3. รัน Development Server

เมื่อทำการติดตั้ง Dependencies และตั้งค่าไฟล์ `.env.local` เสร็จเรียบร้อยแล้ว สามารถสตาร์ทโปรเจกต์ในโหมดพัฒนา (Development mode) ได้ด้วยคำสั่ง:

```bash
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
# หรือ
bun dev
```

จากนั้นให้เปิดเว็บเบราว์เซอร์และเข้าไปที่ [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์ของเว็บไซต์

คุณสามารถเริ่มแก้ไขหน้าเว็บได้ที่ `src/app/page.tsx` หรือ `app/page.tsx` (ตามโครงสร้างที่มี) หน้าเว็บจะทำการอัปเดต (Hot Reload) อัตโนมัติเมื่อมีการเปลี่ยนแปลงโค้ดและบันทึกไฟล์

---

## ข้อมูลเพิ่มเติมเกี่ยวกับ Next.js

หากต้องการศึกษาเพิ่มเติมเกี่ยวกับ Next.js สามารถดูได้จากแหล่งข้อมูลเหล่านี้:

- [Next.js Documentation](https://nextjs.org/docs) - เรียนรู้เกี่ยวกับฟีเจอร์และ API ของ Next.js
- [Learn Next.js](https://nextjs.org/learn) - บทเรียน Next.js แบบ Interactive

## การ Deploy

วิธีที่ง่ายที่สุดในการ Deploy โปรเจกต์ Next.js คือการใช้แพลตฟอร์ม [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) จากผู้สร้าง Next.js

สามารถดูรายละเอียดเชิงลึกเพิ่มเติมเกี่ยวกับการนำขึ้น Production ได้ที่ [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
