
Lead-Management-System
Repository navigation
Code
Issues
Pull requests
Lead-Management-System
/README (2).md
shivaram1350-code
shivaram1350-code
1 minute ago
211 lines (155 loc) · 6 KB

Preview

Code

Blame
Lead Management System (Mini CRM)
A full-stack web application to manage sales leads — add, view, filter, update status, and delete. Built as part of the Sankar Group Full Stack Development Internship assignment.

Stack: React (Vite) · Node.js (Express) · PostgreSQL

✨ Features
Core
✅ Add a new lead (Name, Phone, Source: Call / WhatsApp / Field)
✅ View list of all leads
✅ Update lead status (Interested / Not Interested / Converted)
✅ Delete lead
✅ Form validation (frontend + backend)
✅ Clean, responsive UI
Bonus
✅ Search by name or phone
✅ Filter by status and source
✅ Dashboard with stats (total, interested, converted, not interested, conversion rate)
✅ Toast notifications
✅ Mobile-friendly layout
📁 Project Structure
lead-management-system/
├── backend/
│   ├── src/
│   │   ├── config/db.js              # PostgreSQL connection pool
│   │   ├── controllers/              # Request handlers
│   │   ├── middleware/               # Validation
│   │   ├── routes/                   # Route definitions
│   │   └── server.js                 # Express app entry
│   ├── schema.sql                    # DB schema + seed data
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # LeadForm, LeadList, Dashboard, SearchFilter
│   │   ├── services/api.js           # Fetch wrapper
│   │   ├── App.jsx                   # Main app
│   │   └── main.jsx                  # Vite entry
│   ├── index.html
│   └── package.json
└── README.md
🚀 Getting Started (Local Setup)
Prerequisites
Node.js v18 or higher
PostgreSQL v13 or higher
npm (comes with Node)
1. Clone the repo
git clone <your-repo-url>
cd lead-management-system
2. Set up the database
Make sure PostgreSQL is running, then create the database and load the schema:

# Create the database
createdb lead_management

# Load schema and seed data
psql -d lead_management -f backend/schema.sql
💡 On Windows or if createdb isn't available, run inside psql:

CREATE DATABASE lead_management;
\c lead_management
\i backend/schema.sql
3. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env and set your PostgreSQL credentials
npm run dev
Backend runs on http://localhost:5000

4. Frontend setup
In a new terminal:

cd frontend
npm install
npm run dev
Frontend runs on http://localhost:3000

Open the browser and start adding leads 🎉

🔌 API Endpoints
Method	Endpoint	Description
GET	/api/leads	List all leads. Supports ?search=, ?status=, ?source=
GET	/api/leads/stats	Dashboard statistics
POST	/api/leads	Create a new lead
PATCH	/api/leads/:id/status	Update lead status
DELETE	/api/leads/:id	Delete a lead
Example: Create a lead
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name": "Rahul Sharma", "phone": "9876543210", "source": "Call"}'
Example: Update status
curl -X PATCH http://localhost:5000/api/leads/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Converted"}'
🗄️ Database Schema
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('Call', 'WhatsApp', 'Field')),
    status VARCHAR(20) NOT NULL DEFAULT 'Interested'
        CHECK (status IN ('Interested', 'Not Interested', 'Converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
Indexes are added on status, source, and created_at for query performance, and a trigger keeps updated_at in sync on every update.

✅ Validation Rules
Field	Rule
Name	Required, 1–100 characters
Phone	Required, 10–15 digits (optional + prefix)
Source	Required, must be Call, WhatsApp, or Field
Status	Must be Interested, Not Interested, or Converted
Validation runs on both the client (for UX) and the server (for safety). The database also enforces source/status via CHECK constraints — defence in depth.

🌐 Deployment Notes
Backend (Render / Railway / Fly.io):

Set DATABASE_URL env var to the production Postgres connection string
Set NODE_ENV=production
Start command: npm start
Frontend (Vercel / Netlify):

Build command: npm run build
Output directory: dist
Set VITE_API_URL to the deployed backend URL
Database (Supabase / Neon / Render Postgres):

Run schema.sql once after provisioning
🧪 Testing the App
A few seeded leads are inserted by schema.sql so you can see the dashboard populated immediately. To start fresh, just delete them or re-run the schema.

📦 Tech Choices
Vite over Create React App — faster dev server and modern defaults
pg driver with a connection pool — efficient connection reuse
No ORM — keeps the project small and shows raw SQL skill; queries are parameterised against injection
Plain CSS — no extra dependencies, easier to review
Centralised API service — single place to handle errors and base URL
📄 License
MIT
