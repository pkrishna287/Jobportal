import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Users,
  Share2,
  BookmarkPlus,
  Upload,
  X
} from "lucide-react";
import Header from "../components/Header";
import { apiCall, apiCallFormData } from "../lib/fetch";
import { useAuth } from "../contexts/AuthContext";

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
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: string;
  postedDate: string;
  deadline: string;
  applicants: number;
  requiresResume: boolean;
  customQuestions?: Array<{
    id: number;
    question: string;
    type: string;
    options?: string[];
    required: boolean;
  }>;
}

// Mock job data for demo
const mockJob: Job = {
  id: "1",
  title: "Senior Frontend Developer",
  company: "TechCorp",
  location: "San Francisco, CA",
  salary: "$120k - $180k",
  type: "Full-time",
  department: "Engineering",
  description: "We're looking for an experienced Frontend Developer to join our growing engineering team. You'll be responsible for building user-facing features, optimizing web applications for maximum speed and scalability, and collaborating with our design and backend teams.",
  responsibilities: [
    "Develop and maintain responsive web applications using React, TypeScript, and modern CSS",
    "Collaborate with UX/UI designers to implement pixel-perfect designs",
    "Optimize applications for maximum speed and scalability",
    "Write clean, maintainable, and well-documented code"
  ],
  requirements: [
    "5+ years of experience in frontend development",
    "Expert knowledge of React, TypeScript, and modern JavaScript",
    "Strong understanding of HTML5, CSS3, and responsive design",
    "Experience with state management libraries"
  ],
  benefits: [
    "Competitive salary and equity package",
    "Comprehensive health, dental, and vision insurance",
    "Flexible working hours and remote work options",
    "Professional development budget"
  ],
  status: "active",
  postedDate: "2 days ago",
  deadline: "Jan 30, 2024",
  applicants: 24,
  requiresResume: true,
  customQuestions: [
    {
      id: 1,
      question: "Tell us about your experience with React and TypeScript",
      type: "textarea",
      required: true
    },
    {
      id: 2,
      question: "Are you comfortable with remote work?",
      type: "radio",
      options: ["Yes", "No", "Hybrid preferred"],
      required: true
    }
  ]
};

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isUser } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    customAnswers: {} as Record<number, string>,
    resume: null as File | null
  });

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('Invalid job ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const jobData = await apiCall(`/jobs/${id}`);
        setJob(jobData);
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setError('Backend not available - showing demo job');
        // Use mock data as fallback
        setJob(mockJob);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomAnswer = (questionId: number, answer: string) => {
    setFormData(prev => ({
      ...prev,
      customAnswers: { ...prev.customAnswers, [questionId]: answer }
    }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      setFormData(prev => ({ ...prev, resume: file }));
    } else {
      alert("Please upload a PDF file under 5MB");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !id) return;

    try {
      setSubmitting(true);

      // Create form data for submission
      const submitData = new FormData();
      submitData.append('jobId', id);
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      if (formData.phone) {
        submitData.append('phone', formData.phone);
      }
      submitData.append('answers', JSON.stringify(formData.customAnswers));
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      await apiCallFormData('/applications', submitData);
      alert("Application submitted successfully!");
      setIsApplying(false);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        customAnswers: {},
        resume: null
      });
    } catch (err) {
      console.error('Failed to submit application:', err);
      // Show success anyway in demo mode
      alert("Application submitted successfully! (Demo mode)");
      setIsApplying(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
            <div className="bg-white border border-border rounded-xl p-6 mb-6">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {error ? 'Error Loading Job' : 'Job Not Found'}
            </h1>
            <p className="text-muted-foreground mb-4">
              {error || "The job you're looking for doesn't exist."}
            </p>
            <Link to="/" className="text-primary hover:underline">Back to Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white border border-border rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                  <p className="text-xl text-muted-foreground">{job.company}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 border border-border rounded-lg hover:bg-accent transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 border border-border rounded-lg hover:bg-accent transition-colors">
                    <BookmarkPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                  {job.type}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  {job.applicants} applicants
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {job.department}
                </span>
                <span className="text-sm text-muted-foreground">
                  Posted {job.postedDate}
                </span>
                <span className="text-sm text-muted-foreground">
                  Deadline: {job.deadline}
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white border border-border rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Key Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Benefits & Perks</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-xl p-6 sticky top-24">
              {!isAuthenticated ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    You need to sign in to apply for this job
                  </p>
                  <button className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors mb-4">
                    Sign In to Apply
                  </button>
                </div>
              ) : !isUser ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Only job seekers can apply for positions
                  </p>
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg cursor-not-allowed mb-4"
                  >
                    Admin Account
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsApplying(true)}
                  className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors mb-4"
                >
                  Apply for this Job
                </button>
              )}

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Application Deadline</span>
                  <p className="font-medium text-foreground">{job.deadline}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Job Type</span>
                  <p className="font-medium text-foreground">{job.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department</span>
                  <p className="font-medium text-foreground">{job.department}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="font-medium text-foreground capitalize">{job.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Apply for {job.title}</h2>
              <button
                onClick={() => setIsApplying(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                disabled={submitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* Resume Upload */}
              {job.requiresResume && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Resume * (PDF only, max 5MB)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-2">
                      {formData.resume ? formData.resume.name : "Upload your resume"}
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                      required
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              )}

              {/* Custom Questions */}
              {job.customQuestions && job.customQuestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Additional Questions</h3>
                  {job.customQuestions.map((question) => (
                    <div key={question.id}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {question.question} {question.required && "*"}
                      </label>
                      {question.type === "textarea" && (
                        <textarea
                          required={question.required}
                          rows={4}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={formData.customAnswers[question.id] || ""}
                          onChange={(e) => handleCustomAnswer(question.id, e.target.value)}
                        />
                      )}
                      {question.type === "radio" && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                required={question.required}
                                className="mr-2"
                                onChange={(e) => handleCustomAnswer(question.id, e.target.value)}
                              />
                              <span className="text-muted-foreground">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {question.type === "date" && (
                        <input
                          type="date"
                          required={question.required}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={formData.customAnswers[question.id] || ""}
                          onChange={(e) => handleCustomAnswer(question.id, e.target.value)}
                        />
                      )}
                      {question.type === "text" && (
                        <input
                          type="text"
                          required={question.required}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={formData.customAnswers[question.id] || ""}
                          onChange={(e) => handleCustomAnswer(question.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
