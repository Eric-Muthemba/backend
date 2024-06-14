# 🚀 Ilara health case study.

## 🌟 Introduction
Welcome to Eric Muthemba Kiarie, Ilara health backend case study submission.

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup
- clone `git clone {url}`
- Navigate: `cd backend`
- Install dependencies: `npm ci`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

### Step 3: 🏃‍♂️ Running the Project
- run migrations : `npx prisma migrate dev --name init`
- cd into src: `cd src `
- seed the database with users: `node seed.js && cd .. `
- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`


