import { Search, MapPin, DollarSign, Clock, Building2, Users, TrendingUp, ArrowRight, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { apiCall } from "../lib/fetch";

// Job type definition
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  department: string;
  description: string;
  postedDate: string;
  applicants: number
}
 interface PaginatedJobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
};

const stats = [
  { icon: Building2, label: "Companies", value: "500+" },
  { icon: Users, label: "Active Jobs", value: "2,340" },
  { icon: TrendingUp, label: "Placements", value: "12,500+" }
];

export default function Index() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // Fetch jobs from API
 useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (locationFilter) params.append("location", locationFilter);
      if (typeFilter) params.append("type", typeFilter);
      params.append("page", page.toString()); // ✅ Include page

      const query = params.toString() ? `?${params.toString()}` : "";

      const jobsData = await apiCall(`/jobs${query}`);
      setJobs(jobsData.jobs); // ✅ Corrected
      setTotalPages(Math.ceil(jobsData.total / jobsData.pageSize)); // ✅ Corrected
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Backend not available - showing demo jobs");
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, [searchTerm, locationFilter, typeFilter, page]); // ✅ Include page



  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleSearch = () => {
    // Trigger immediate search (will use useEffect)
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (locationFilter) params.append('location', locationFilter);
        if (typeFilter) params.append('type', typeFilter);
        const query = params.toString() ? `?${params.toString()}` : '';

       const jobsData = await apiCall(`/jobs${query}`);
setJobs(jobsData.jobs);
setTotalPages(Math.ceil(jobsData.total / jobsData.pageSize));
setPage(1); 

      } catch (err) {
      }
    };
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Find Your Next
            <span className="text-primary block">Dream Job</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Connect with top companies and discover opportunities that match your skills and ambitions. 
            Your perfect career awaits.
          </p>

          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Job title or company"
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Latest Job Opportunities</h2>
              <p className="text-muted-foreground">Discover your next career move</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <WifiOff className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium">Running in Demo Mode</p>
                  <p className="text-blue-600 text-sm mt-1">
                    Backend server not available - showing sample job listings for demonstration.
                  </p>
                  <p className="text-blue-600 text-sm mt-2">
                    To connect your backend, see the <code className="bg-blue-100 px-1 rounded">CONNECT_YOUR_BACKEND.md</code> guide.
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Jobs Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || locationFilter || typeFilter
                  ? "Try adjusting your search criteria"
                  : "No job listings available at the moment"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{job.company}</p>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.postedDate}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {job.applicants} applicants
                    </span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              View All Jobs
            </button>
          </div>
        </div>
      </section>
      {totalPages > 1 && (
  <div className="flex justify-center items-center space-x-4 mt-8">
    <button
      onClick={handlePrevPage}
      disabled={page === 1}
      className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-sm text-muted-foreground">
      Page {page} of {totalPages}
    </span>
    <button
      onClick={handleNextPage}
      disabled={page === totalPages}
      className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}


      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">RecruitPro</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting talent with opportunity. Find your perfect job or hire the best candidates.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">For Job Seekers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">My Applications</Link></li>
                <li><Link to="/resume" className="hover:text-primary transition-colors">Resume Builder</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">For Employers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/admin" className="hover:text-primary transition-colors">Post Jobs</Link></li>
                <li><Link to="/admin/applications" className="hover:text-primary transition-colors">Manage Applications</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 RecruitPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
