import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const mockStats = [
  { icon: Briefcase, label: "Active Jobs", value: "24", change: "+3 this week" },
  { icon: Users, label: "Total Applications", value: "156", change: "+12 today" },
  { icon: CheckCircle, label: "Hired", value: "8", change: "+2 this month" },
  { icon: TrendingUp, label: "Success Rate", value: "68%", change: "+5% vs last month" }
];

const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    status: "Active",
    applicants: 24,
    posted: "2 days ago",
    deadline: "Jan 30, 2024"
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    status: "Active",
    applicants: 31,
    posted: "1 day ago",
    deadline: "Feb 15, 2024"
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    status: "Closed",
    applicants: 18,
    posted: "3 days ago",
    deadline: "Jan 20, 2024"
  }
];

const mockApplications = [
  {
    id: 1,
    applicant: "John Smith",
    email: "john@example.com",
    job: "Senior Frontend Developer",
    status: "Pending",
    applied: "2 hours ago",
    experience: "5+ years"
  },
  {
    id: 2,
    applicant: "Sarah Johnson",
    email: "sarah@example.com",
    job: "Product Manager",
    status: "Accepted",
    applied: "1 day ago",
    experience: "7+ years"
  },
  {
    id: 3,
    applicant: "Mike Chen",
    email: "mike@example.com",
    job: "UX Designer",
    status: "Rejected",
    applied: "3 days ago",
    experience: "3+ years"
  }
];

export default function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and track applications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <div key={index} className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white border border-border rounded-xl">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Job Posts</h2>
                <Link to="/admin/jobs" className="text-primary hover:text-primary/80 transition-colors">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.department} • {job.location}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{job.applicants} applicants</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white border border-border rounded-xl">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Applications</h2>
                <Link to="/admin/applications" className="text-primary hover:text-primary/80 transition-colors">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{application.applicant}</h3>
                      <p className="text-sm text-muted-foreground">{application.job}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{application.applied}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/admin/jobs/new"
              className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Post New Job</h3>
                  <p className="text-sm text-muted-foreground">Create a new job posting</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/applications"
              className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Review Applications</h3>
                  <p className="text-sm text-muted-foreground">Manage candidate applications</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/analytics"
              className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">View Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track hiring metrics</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
