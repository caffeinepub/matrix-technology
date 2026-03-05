# Matrix Technology

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing/login page with email+password manual login form (Google OAuth and phone OTP are not supported on this platform; manual auth only)
- Authorization system for user accounts
- 3D interactive globe dashboard using React Three Fiber + Three.js showing India highlighted, startup nodes as 3D points, and connection arcs between nodes
- Startup node creation form: Company Name, Description, Sector, City, Latitude, Longitude, Directive (dropdown: Looking for Investors / Co-Founders / Developers / Collaborators)
- Backend storage for startup nodes: id, owner, companyName, description, sector, city, latitude, longitude, directive, createdAt
- Backend storage for user profiles: userId, name, email, phone, city, sector, startupName, bio
- Profile management page: view and edit profile fields
- Contact section with Obulesh (9177631009), Abhishek (9959970072), email goudabhi7890@gmail.com
- Privacy/security settings page: change password UI, delete account option
- Sample startup nodes seeded across major Indian cities (Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata)
- Navigation sidebar with: Dashboard, My Node, Profile, Settings, Contact

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select authorization component
2. Generate Motoko backend with:
   - StartupNode CRUD (create, read list, read by id, update, delete own)
   - UserProfile CRUD (get own, upsert)
   - Sample seed data for demo nodes across Indian cities
3. Frontend:
   - Auth pages (login, register) wired to authorization component
   - Main layout with sidebar navigation
   - 3D Globe dashboard using React Three Fiber: rotating Earth, India highlighted, startup nodes as glowing spheres at lat/lng positions, arcs connecting nearby nodes
   - Node initialization form (modal or page) to create a startup node
   - Profile page to view/edit user profile
   - Settings page with change password and delete account (UI only for security features)
   - Contact page with team contact info
   - Responsive design with dark matrix/tech aesthetic
