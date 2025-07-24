import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Settings,
  Shield,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const mockAdminData = {
  name: "Sarah Johnson",
  email: "sarah@techcorp.com",
  phone: "+1 (555) 987-6543",
  location: "San Francisco, CA",
  company: "TechCorp Inc.",
  position: "HR Manager",
  joinDate: "January 2022",
  department: "Human Resources"
};

const mockCompanyStats = [
  { icon: Briefcase, label: "Active Jobs", value: "24", change: "+3 this week" },
  { icon: Users, label: "Total Applications", value: "156", change: "+12 today" },
  { icon: CheckCircle, label: "Hired This Month", value: "8", change: "+2 vs last month" },
  { icon: TrendingUp, label: "Success Rate", value: "68%", change: "+5% improvement" }
];

const recentActivity = [
  {
    id: 1,
    action: "New application received",
    job: "Senior Frontend Developer",
    applicant: "John Smith",
    time: "2 hours ago"
  },
  {
    id: 2,
    action: "Interview scheduled",
    job: "Product Manager",
    applicant: "Sarah Wilson",
    time: "4 hours ago"
  },
  {
    id: 3,
    action: "Candidate hired",
    job: "UX Designer",
    applicant: "Mike Chen",
    time: "1 day ago"
  },
  {
    id: 4,
    action: "Job posted",
    job: "Backend Developer",
    applicant: null,
    time: "2 days ago"
  }
];

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockAdminData);
  const { user, logout } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Admin profile saved:", profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">RecruitPro</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/admin/applications" className="text-muted-foreground hover:text-primary transition-colors">Applications</Link>
              <Link to="/profile" className="text-foreground hover:text-primary transition-colors">Profile</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <button 
                onClick={logout}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your profile and company settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      className="text-xl font-semibold text-center w-full border border-input rounded-lg px-3 py-2"
                      value={profileData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  ) : (
                    <h3 className="text-xl font-semibold text-foreground">{profileData.name}</h3>
                  )}
                  <p className="text-sm text-primary font-medium">HR Manager</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    {isEditing ? (
                      <input
                        type="text"
                        className="flex-1 border border-input rounded-lg px-3 py-2"
                        value={profileData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                    ) : (
                      <span className="text-muted-foreground">{profileData.company}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    {isEditing ? (
                      <input
                        type="email"
                        className="flex-1 border border-input rounded-lg px-3 py-2"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    ) : (
                      <span className="text-muted-foreground">{profileData.email}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    {isEditing ? (
                      <input
                        type="tel"
                        className="flex-1 border border-input rounded-lg px-3 py-2"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    ) : (
                      <span className="text-muted-foreground">{profileData.phone}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    {isEditing ? (
                      <input
                        type="text"
                        className="flex-1 border border-input rounded-lg px-3 py-2"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    ) : (
                      <span className="text-muted-foreground">{profileData.location}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined {profileData.joinDate}</span>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border border-border py-2 px-4 rounded-lg hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-border rounded-xl p-6 mt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  to="/admin/jobs/new"
                  className="flex items-center space-x-3 p-3 hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-foreground">Post New Job</span>
                </Link>
                
                <Link 
                  to="/admin/applications"
                  className="flex items-center space-x-3 p-3 hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-foreground">Review Applications</span>
                </Link>

                <Link 
                  to="/admin/settings"
                  className="flex items-center space-x-3 p-3 hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Settings className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-foreground">Company Settings</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Dashboard Overview */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {mockCompanyStats.map((stat, index) => (
                <div key={index} className="bg-white border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-border rounded-xl">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.job}
                          {activity.applicant && ` • ${activity.applicant}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Metrics */}
            <div className="bg-white border border-border rounded-xl mt-6">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">This Month's Performance</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">8</p>
                    <p className="text-sm text-muted-foreground">Successful Hires</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-2">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">156</p>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-2">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">$45K</p>
                    <p className="text-sm text-muted-foreground">Avg. Salary Offered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
