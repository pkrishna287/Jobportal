import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Edit,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const mockProfile = {
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  joinDate: "March 2023",
  resume: "john_smith_resume.pdf"
};

const mockApplications = [
  {
    id: 1,
    job: "Senior Frontend Developer",
    company: "TechCorp",
    appliedDate: "2 days ago",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800"
  },
  {
    id: 2,
    job: "React Developer",
    company: "StartupXYZ",
    appliedDate: "1 week ago",
    status: "Accepted",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: 3,
    job: "Full Stack Developer",
    company: "InnovateLabs",
    appliedDate: "2 weeks ago",
    status: "Rejected",
    statusColor: "bg-red-100 text-red-800"
  },
  {
    id: 4,
    job: "Frontend Engineer",
    company: "DesignCorp",
    appliedDate: "3 weeks ago",
    status: "On Hold",
    statusColor: "bg-blue-100 text-blue-800"
  }
];

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockProfile);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save profile
    console.log("Profile saved:", profileData);
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "On Hold":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const stats = [
    { label: "Applications Sent", value: mockApplications.length.toString() },
    { label: "Pending", value: mockApplications.filter(app => app.status === "Pending").length.toString() },
    { label: "Accepted", value: mockApplications.filter(app => app.status === "Accepted").length.toString() },
    { label: "Success Rate", value: `${Math.round((mockApplications.filter(app => app.status === "Accepted").length / mockApplications.length) * 100)}%` }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile and track your applications</p>
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
                    <User className="w-10 h-10 text-primary" />
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
                </div>

                <div className="space-y-4">
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

            {/* Resume Section */}
            <div className="bg-white border border-border rounded-xl p-6 mt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Resume</h2>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{profileData.resume}</p>
                    <p className="text-sm text-muted-foreground">Updated 2 weeks ago</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button className="w-full mt-4 border border-border py-2 px-4 rounded-lg hover:bg-accent transition-colors">
                Upload New Resume
              </button>
            </div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white border border-border rounded-xl p-4">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Applications List */}
            <div className="bg-white border border-border rounded-xl">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">My Applications</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div key={application.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-foreground">{application.job}</h3>
                          <p className="text-sm text-muted-foreground">{application.company}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${application.statusColor}`}>
                            {getStatusIcon(application.status)}
                            <span>{application.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Applied {application.appliedDate}</span>
                        <div className="flex space-x-2">
                          <button className="text-primary hover:text-primary/80 transition-colors">
                            View Details
                          </button>
                          <button className="text-primary hover:text-primary/80 transition-colors">
                            Withdraw
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {mockApplications.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Applications Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start applying to jobs to see your applications here.
                    </p>
                    <Link
                      to="/"
                      className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
