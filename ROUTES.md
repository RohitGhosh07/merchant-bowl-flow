# Merchant's Cup 2025-26 Route Documentation

## Public Routes

### Home Page
- **Route:** `/`
- **Purpose:** Main registration page for teams
- **Features:**
  - Registration form for new teams
  - Team details input
  - Payment selection
  - Receipt generation
  - Email confirmation

### Track Registration
- **Route:** `/track`
- **Purpose:** Track registration status using tracking ID
- **Features:**
  - Input 6-digit tracking ID
  - View registration details
  - Check payment status
  - View team information
  - View company details

## Administrative Routes

### Admin Login
- **Route:** `/admin`
- **Purpose:** Admin authentication page
- **Features:**
  - Secure login for administrators
  - Access control for admin features

### Admin Dashboard
- **Route:** `/admin/dashboard`
- **Purpose:** Administrative control panel
- **Features:**
  - View all registrations
  - Manage team details
  - Update payment status
  - Generate reports
  - Export data

### Registrations Overview
- **Route:** `/registrations`
- **Purpose:** View all tournament registrations
- **Features:**
  - List all registered teams
  - Filter and search capabilities
  - View registration details
  - Export registration data

## How to Use

### For Players/Teams:
1. **Registration Process:**
   - Visit `/` (home page)
   - Fill in company and team details
   - Choose payment method
   - Receive 6-digit tracking ID

2. **Track Registration:**
   - Visit `/track`
   - Enter 6-digit tracking ID
   - View registration status and details

### For Administrators:
1. **Access Admin Panel:**
   - Visit `/admin`
   - Login with admin credentials
   - Access dashboard at `/admin/dashboard`

2. **Manage Registrations:**
   - View all registrations at `/registrations`
   - Update payment status
   - Manage team information
   - Generate reports

## Navigation Tips

- The navigation bar provides quick access to:
  - Home page (Registration)
  - Track Registration
  - Admin section (if authorized)

- Each page includes:
  - Clear breadcrumb navigation
  - Back buttons where applicable
  - Status indicators
  - Error handling messages

## Error Pages

- **404 Not Found**
  - Shown when accessing non-existent routes
  - Provides link back to home page
  - Clear error message and instructions

## Security Notes

- Admin routes (`/admin/*`) require authentication
- Registration tracking requires valid tracking ID
- All data transmission is secure
- Session management for admin users
