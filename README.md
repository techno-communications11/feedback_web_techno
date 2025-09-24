This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

📘 Next.js Employee Evaluation System

This is a Next.js + MySQL project for managing employee evaluations, notifications, and manager comments.

🛠 Tech Stack

Frontend: Next.js (React, TypeScript)

Backend: Next.js API Routes

Database: MySQL

Authentication & Roles: Admin, User, Market Manager

🚦 System Workflow Overview
1️⃣ User Creation (Admin)

Admin logs in.

Admin creates new users (employees) with details like:

Name

NTID

Email

Market

Users are stored in the users table.

2️⃣ Monthly Data Entry (Admin)

Admin fills evaluation forms once per month for each employee.

Data includes:

Hours Worked

Boxes Completed

Accessories Sold

Feature Revenue

CSAT

Retention Metrics

Records are stored in the evaluations table.

3️⃣ Notification + Email (System)

After submission:

Creates a notification for the user (stored in notifications table).

Sends an email with evaluation summary to the user.

4️⃣ User Access (Employee Portal)

Users log into the portal.

Click Notifications.

View evaluation details.

5️⃣ Comments Flow (Manager / User)

Users or managers can:

Add comments.

Edit existing comments (tracked with timestamps).

Each comment is linked to:

user_id

form_id

manager_commented_at timestamp

6️⃣ Admin Access (Full Control)

Admin can:

View all users and evaluations

View all comments

Add users

Update passwords

Edit or manage evaluation forms

📊 Database Tables
Users Table
Column	Type	Key / Default
id	int	NO, UNI
applicant_uuid	char(36)	NO, PRI
email	varchar(255)	NO, UNI
password	varchar(255)	NO
role	enum('employee','admin','market_manager')	NO, default 'employee'
created_at	timestamp	YES, CURRENT_TIMESTAMP
updated_at	timestamp	YES, CURRENT_TIMESTAMP
ntid	varchar(10)	NO, UNI
market_id	int	YES, MUL


Evaluations Table (form data)
Column	Type	Key / Default
form_id	int	NO, PRI, auto_increment
applicant_uuid	char(36)	NO, MUL
first_name	varchar(100)	NO
last_name	varchar(100)	NO
ntid	varchar(100)	NO
market_manager_firstname	varchar(100)	YES
market_manager_lastname	varchar(100)	YES
hours_worked	int	YES, 0
boxes_completed	int	YES, 0
accessories_sold	int	YES, 0
feature_revenue	int	YES, 0
csat	int	YES, 0
day_155_activation_retention	int	YES, 0
day_155_future_mrc_retention	int	YES, 0
created_at	timestamp	YES, CURRENT_TIMESTAMP
updated_at	timestamp	YES, auto-update CURRENT_TIMESTAMP


Comments Table
Column	Type	Key / Default
comment_id	int	NO, PRI, auto_increment
form_id	int	NO, UNI
applicant_uuid	char(36)	NO, MUL
comment_text	text	NO
version	int	NO, default 1
created_at	timestamp	YES, CURRENT_TIMESTAMP
manager_comment	text	YES
updated_at	datetime	YES, CURRENT_TIMESTAMP
market_manager_edit_date	datetime	YES
manager_commented_at	datetime	YES, CURRENT_TIMESTAMP


Notifications Table
Column	Type	Key / Default
id	char(36)	NO, PRI, uuid()
user_id	char(36)	NO, MUL
form_id	int	NO
role	enum('employee','admin','market_manager')	NO
type	varchar(50)	NO
is_read	tinyint(1)	YES, 0
created_at	timestamp	YES, CURRENT_TIMESTAMP


Markets Table
Column	Type	Key / Default
market_id	int	NO, PRI, auto_increment
market_name	varchar(1000)	NO
created_at	timestamp	YES, CURRENT_TIMESTAMP


🔑 Roles Summary
Role	Access
Admin	Create users, enter monthly data, full view access, update passwords
User	View evaluations, notifications, add comments
Manager	Commenting access, edit comments
System	Sends notifications & emails automatically
🚀 Getting Started

Run the development server:

npm run dev
# or
yarn dev
# or
npm dev



┌─────────────┐
│   Admin     │
│─────────────│
│ - Create Users
│ - Enter Monthly Data
│ - Full View Access
│ - Update Passwords
└───────┬─────┘
        │
        ▼
┌─────────────┐
│   System    │
│─────────────│
│ - Stores Evaluations
│ - Sends Email Notifications
│ - Creates Notification Entry
└───────┬─────┘
        │
        ▼
┌─────────────┐
│    User     │
│─────────────│
│ - Logs in to Portal
│ - Checks Notifications
│ - Views Evaluation Data
│ - Adds Comments
└───────┬─────┘
        │
        ▼
┌─────────────┐
│   Manager   │
│─────────────│
│ - Add/Edit Manager Comments
│ - Review Employee Data
└─────────────┘




[Admin]
   │
   │ create users & fill monthly data, update password
   ▼
[Evaluations Table] ──▶ [Notifications Table] ──▶ Email sent to User
   │
   ▼
[User Portal] ──▶ Click Notification ──▶ View Evaluation and add comment
   │
   ▼
[Manager / User Comments] ──▶ Updates Comments Table
   │
   ▼
[Admin] (Audit & Full View)
