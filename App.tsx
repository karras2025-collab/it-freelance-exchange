import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Briefcase, 
  Search, 
  MessageSquare, 
  Settings, 
  PlusCircle, 
  CreditCard, 
  LayoutDashboard,
  LogOut,
  Send,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { 
  Role, 
  User, 
  Job, 
  Application, 
  Deal, 
  Message, 
  Category, 
  SubscriptionPlan 
} from './types';
import { 
  MOCK_USER_CLIENT, 
  MOCK_USER_FREELANCER, 
  MOCK_JOBS, 
  MOCK_APPLICATIONS, 
  MOCK_DEALS, 
  MOCK_MESSAGES 
} from './constants';
import { Button, Card, Badge } from './components/UI';

// --- View Definitions ---
type View = 
  | 'DASHBOARD' 
  | 'CREATE_JOB' 
  | 'SEARCH' 
  | 'APPLICATIONS' 
  | 'PROFILE' 
  | 'SUBSCRIPTION' 
  | 'CHAT' 
  | 'JOB_DETAILS'
  | 'MY_JOBS';

// --- Main Component ---
export default function App() {
  // --- Global State ---
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER_FREELANCER);
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data State
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // --- Derived State ---
  const isClient = currentUser.role === 'CLIENT';
  const isFreelancer = currentUser.role === 'FREELANCER';

  // --- Actions ---
  
  const switchRole = () => {
    if (isClient) {
      setCurrentUser(MOCK_USER_FREELANCER);
      setCurrentView('DASHBOARD');
    } else {
      setCurrentUser(MOCK_USER_CLIENT);
      setCurrentView('DASHBOARD');
    }
    setSidebarOpen(false);
  };

  const handleCreateJob = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setCurrentView('MY_JOBS');
  };

  const handleApply = (jobId: string, price: string, eta: string, message: string) => {
    // Check Limits
    if (currentUser.plan === 'FREE' && currentUser.weeklyApplicationsUsed >= 3) {
      alert('Weekly limit reached! Please upgrade to PRO or PREMIUM.');
      setCurrentView('SUBSCRIPTION');
      return;
    }

    const newApp: Application = {
      id: `a${Date.now()}`,
      jobId,
      freelancerId: currentUser.id,
      freelancerName: currentUser.name,
      price,
      eta,
      message,
      status: 'SENT'
    };

    setApplications([...applications, newApp]);
    
    // Increment usage if free
    if (currentUser.plan === 'FREE') {
      setCurrentUser({
        ...currentUser,
        weeklyApplicationsUsed: currentUser.weeklyApplicationsUsed + 1
      });
    }

    setCurrentView('APPLICATIONS');
    setSelectedJob(null);
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setCurrentUser({ ...currentUser, plan });
    alert(`Successfully upgraded to ${plan}!`);
  };

  const handleSendMessage = (text: string) => {
    if (!selectedDeal) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      dealId: selectedDeal.id,
      fromUserId: currentUser.id,
      text,
      createdAt: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
  };

  // --- Components within App Scope for Context Access ---

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setSidebarOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
        currentView === view
          ? 'bg-blue-50 text-blue-600'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-lg font-bold text-slate-800">FreelanceBot</span>
          <button className="md:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {isClient ? (
            <>
              <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
              <NavItem view="CREATE_JOB" icon={PlusCircle} label="Create Job" />
              <NavItem view="MY_JOBS" icon={Briefcase} label="My Jobs" />
              <NavItem view="PROFILE" icon={Settings} label="Profile" />
            </>
          ) : (
            <>
              <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
              <NavItem view="SEARCH" icon={Search} label="Find Jobs" />
              <NavItem view="APPLICATIONS" icon={Send} label="My Applications" />
              <NavItem view="CHAT" icon={MessageSquare} label="Chats" />
              <NavItem view="SUBSCRIPTION" icon={CreditCard} label="Subscription" />
              <NavItem view="PROFILE" icon={Settings} label="Profile" />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center p-3 mb-3 bg-slate-50 rounded-lg">
            <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
              <div className="flex items-center">
                <p className="text-xs text-slate-500 truncate mr-2">{isClient ? 'Client' : 'Freelancer'}</p>
                {!isClient && (
                   <Badge color={currentUser.plan === 'PREMIUM' ? 'yellow' : currentUser.plan === 'PRO' ? 'blue' : 'gray'}>
                      {currentUser.plan}
                   </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" fullWidth onClick={switchRole} className="text-xs">
            Switch to {isClient ? 'Freelancer' : 'Client'}
          </Button>
        </div>
      </div>
    </div>
  );

  // --- Page Components ---

  const CreateJobPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Job>>({
      title: '',
      category: Category.OTHER,
      skills: [],
      description: '',
      budgetType: 'FIXED',
      status: 'PUBLISHED'
    });

    const categories = Object.values(Category);

    const handleSubmit = () => {
      const newJob: Job = {
        ...formData as Job,
        id: `j${Date.now()}`,
        clientId: currentUser.id,
        clientName: currentUser.name,
        createdAt: new Date().toISOString(),
        applicationCount: 0,
        deadline: formData.deadline || 'TBD'
      };
      handleCreateJob(newJob);
    };

    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Job</h1>
        <Card className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Job Title</label>
              <input 
                type="text" 
                className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                placeholder="e.g., React Frontend Developer needed"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} disabled={!formData.title}>Next</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormData({...formData, category: cat})}
                    className={`text-left px-4 py-3 rounded-lg border ${
                      formData.category === cat ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Budget & Deadline</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['FIXED', 'HOURLY', 'DISCUSS'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({...formData, budgetType: type as any})}
                    className={`px-3 py-2 text-sm rounded-md border ${
                      formData.budgetType === type ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {formData.budgetType !== 'DISCUSS' && (
                 <input 
                  type="text" 
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border mb-4"
                  placeholder={formData.budgetType === 'FIXED' ? "Total Budget (e.g. 500 USD)" : "Hourly Rate (e.g. 25 USD/hr)"}
                  value={formData.budgetValue || ''}
                  onChange={e => setFormData({...formData, budgetValue: e.target.value})}
                />
              )}
              <label className="block text-sm font-medium text-slate-700">Deadline</label>
              <input 
                  type="text" 
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                  placeholder="e.g. 2 weeks, or YYYY-MM-DD"
                  value={formData.deadline || ''}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                />

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handleSubmit}>Publish Job</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const FreelancerSearch = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Find Jobs</h1>
          <div className="flex space-x-2">
             <Button variant="outline" className="flex items-center text-sm"><Lock className="w-3 h-3 mr-1"/> Filter</Button>
          </div>
        </div>
        
        <div className="grid gap-4">
          {jobs.map(job => (
            <Card key={job.id} className="p-5 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                   <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                   <div className="flex items-center space-x-2 mt-1 mb-2">
                     <span className="text-sm text-slate-500">{job.clientName}</span>
                     <Badge color="blue">{job.category}</Badge>
                   </div>
                </div>
                <div className="text-right">
                   <div className="font-bold text-slate-900">
                     {job.budgetType === 'DISCUSS' ? 'Negotiable' : job.budgetValue}
                   </div>
                   <div className="text-xs text-slate-500 capitalize">{job.budgetType.toLowerCase()}</div>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.description}</p>
              <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4">
                <div className="flex space-x-2">
                   {job.skills.map(s => <Badge key={s} color="gray">{s}</Badge>)}
                </div>
                <Button size="sm" onClick={() => { setSelectedJob(job); setCurrentView('JOB_DETAILS'); }}>Details</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const JobDetailsPage = () => {
    if (!selectedJob) return null;
    const [msg, setMsg] = useState('');
    const [price, setPrice] = useState('');

    const hasApplied = applications.some(a => a.jobId === selectedJob.id && a.freelancerId === currentUser.id);

    return (
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" className="mb-4" onClick={() => setCurrentView('SEARCH')}>&larr; Back to Search</Button>
        <Card className="p-6 mb-6">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">{selectedJob.title}</h1>
            <Badge color="green">{selectedJob.status}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
             <div>
               <p className="text-slate-500">Client</p>
               <p className="font-medium">{selectedJob.clientName}</p>
             </div>
             <div>
               <p className="text-slate-500">Deadline</p>
               <p className="font-medium">{selectedJob.deadline}</p>
             </div>
             <div>
               <p className="text-slate-500">Budget</p>
               <p className="font-medium">{selectedJob.budgetType === 'DISCUSS' ? 'Negotiable' : selectedJob.budgetValue}</p>
             </div>
          </div>

          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-slate-700 whitespace-pre-line mb-6">{selectedJob.description}</p>

          {!isClient && !hasApplied && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold mb-3">Apply for this job</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                 <input placeholder="Your Price" value={price} onChange={e => setPrice(e.target.value)} className="p-2 border rounded" />
                 <input placeholder="Estimated Time" className="p-2 border rounded" />
              </div>
              <textarea 
                className="w-full p-2 border rounded mb-3" 
                rows={3} 
                placeholder="Cover letter..."
                value={msg}
                onChange={e => setMsg(e.target.value)}
              ></textarea>
              <div className="flex justify-between items-center">
                 <span className="text-xs text-slate-500">
                    {currentUser.plan === 'FREE' ? `${3 - currentUser.weeklyApplicationsUsed} free applications left this week` : 'Unlimited applications'}
                 </span>
                 <Button onClick={() => handleApply(selectedJob.id, price, 'TBD', msg)}>Submit Application</Button>
              </div>
            </div>
          )}
          {hasApplied && (
             <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center font-medium">
               You have applied to this job.
             </div>
          )}
        </Card>
      </div>
    );
  };

  const SubscriptionPage = () => {
    const PlanCard = ({ title, price, features, current, recommended, type }: any) => (
      <div className={`relative p-6 rounded-2xl border ${current ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-slate-200'} bg-white flex flex-col`}>
        {recommended && <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full uppercase">Best Value</span>}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="text-3xl font-extrabold mb-4">{price}<span className="text-sm text-slate-500 font-normal">/mo</span></div>
        <ul className="mb-6 space-y-3 flex-1">
          {features.map((f: string, i: number) => (
            <li key={i} className="flex items-center text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <Button 
          variant={current ? 'secondary' : 'primary'} 
          fullWidth
          disabled={current}
          onClick={() => handleUpgrade(type)}
        >
          {current ? 'Current Plan' : 'Upgrade'}
        </Button>
      </div>
    );

    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Upgrade your capabilities</h1>
          <p className="text-slate-500">Unlock more applications and direct chat with clients.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <PlanCard 
            title="Free" 
            price="$0" 
            type="FREE"
            current={currentUser.plan === 'FREE'}
            features={['3 Applications per week', 'Basic Profile', 'Search jobs']} 
          />
          <PlanCard 
            title="Pro" 
            price="$9" 
            type="PRO"
            current={currentUser.plan === 'PRO'}
            features={['Unlimited Applications', 'Priority Search Ranking', 'Verified Badge']} 
          />
          <PlanCard 
            title="Premium" 
            price="$19" 
            type="PREMIUM"
            current={currentUser.plan === 'PREMIUM'}
            recommended={true}
            features={['Everything in Pro', 'Direct Chat with Clients', 'Top Tier Support']} 
          />
        </div>
      </div>
    );
  };

  const ChatPage = () => {
    // Premium Lock for Freelancers
    if (isFreelancer && currentUser.plan !== 'PREMIUM') {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
             <Lock className="w-8 h-8 text-slate-400" />
           </div>
           <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
           <p className="text-slate-500 max-w-md mb-6">Chat is only available for Premium subscribers. Clients can see your applications, but direct messaging requires an upgrade.</p>
           <Button onClick={() => setCurrentView('SUBSCRIPTION')}>Upgrade to Premium</Button>
        </div>
      );
    }

    const myDeals = isFreelancer ? deals.filter(d => d.freelancerId === currentUser.id) : deals.filter(d => d.clientId === currentUser.id);
    
    // Select first deal if none selected
    if (myDeals.length > 0 && !selectedDeal) {
      setSelectedDeal(myDeals[0]);
    }

    if (myDeals.length === 0) {
      return (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No active chats</h3>
          <p className="text-slate-500">Chats will appear here once you have an active deal.</p>
        </div>
      );
    }

    const activeMessages = messages.filter(m => m.dealId === selectedDeal?.id);
    const [inputText, setInputText] = useState('');

    return (
      <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col">
           <div className="p-4 border-b border-slate-200 bg-slate-50">
             <h3 className="font-bold text-slate-700">Active Deals</h3>
           </div>
           <div className="overflow-y-auto flex-1">
             {myDeals.map(deal => (
               <div 
                  key={deal.id} 
                  onClick={() => setSelectedDeal(deal)}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selectedDeal?.id === deal.id ? 'bg-blue-50' : ''}`}
               >
                 <div className="font-medium text-slate-900 truncate">{deal.jobTitle}</div>
                 <div className="text-xs text-slate-500 mt-1">
                    {isFreelancer ? deal.clientName : deal.freelancerName}
                 </div>
               </div>
             ))}
           </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
           {selectedDeal && (
             <>
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                   <span className="font-bold">{isFreelancer ? selectedDeal.clientName : selectedDeal.freelancerName}</span>
                   <Badge color="blue">In Progress</Badge>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                   {activeMessages.map(msg => {
                     const isMe = msg.fromUserId === currentUser.id;
                     return (
                       <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                            isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                          }`}>
                            {msg.text}
                          </div>
                       </div>
                     );
                   })}
                </div>
                <div className="p-4 bg-white border-t border-slate-200">
                   <div className="flex space-x-2">
                      <input 
                        className="flex-1 border border-slate-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (handleSendMessage(inputText), setInputText(''))}
                      />
                      <Button className="rounded-full w-10 h-10 p-0 flex items-center justify-center" onClick={() => { handleSendMessage(inputText); setInputText(''); }}>
                        <Send className="w-5 h-5" />
                      </Button>
                   </div>
                </div>
             </>
           )}
        </div>
      </div>
    );
  };

  const MyJobsPage = () => {
    // Client view of their jobs
    const myJobsList = jobs.filter(j => j.clientId === currentUser.id);
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Posted Jobs</h1>
          <Button onClick={() => setCurrentView('CREATE_JOB')}><PlusCircle className="w-4 h-4 mr-2" /> New Job</Button>
        </div>
        <div className="space-y-4">
           {myJobsList.map(job => (
             <Card key={job.id} className="p-4">
               <div className="flex justify-between">
                 <div>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <div className="flex space-x-4 mt-2 text-sm text-slate-500">
                       <span>{job.applicationCount} Applicants</span>
                       <span>Created: {job.createdAt.split('T')[0]}</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-end space-y-2">
                    <Badge color={job.status === 'PUBLISHED' ? 'green' : 'gray'}>{job.status}</Badge>
                    <div className="space-x-2">
                       <Button size="sm" variant="outline">View</Button>
                       <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">Close</Button>
                    </div>
                 </div>
               </div>
             </Card>
           ))}
           {myJobsList.length === 0 && <p className="text-slate-500 text-center py-8">You haven't posted any jobs yet.</p>}
        </div>
      </div>
    );
  };

  const ApplicationsPage = () => {
    // Freelancer view of their applications
    const myApps = applications.filter(a => a.freelancerId === currentUser.id);
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        <div className="space-y-4">
           {myApps.map(app => {
             const job = jobs.find(j => j.id === app.jobId);
             return (
               <Card key={app.id} className="p-4">
                  <div className="flex justify-between items-start">
                     <div>
                       <h3 className="font-bold">{job?.title || 'Unknown Job'}</h3>
                       <p className="text-sm text-slate-500 mb-2">Sent to: {job?.clientName}</p>
                       <div className="text-sm bg-slate-50 p-2 rounded inline-block">
                          Proposed: <span className="font-medium">{app.price}</span> in <span className="font-medium">{app.eta}</span>
                       </div>
                     </div>
                     <Badge color={app.status === 'ACCEPTED' ? 'green' : app.status === 'REJECTED' ? 'red' : 'blue'}>{app.status}</Badge>
                  </div>
               </Card>
             );
           })}
           {myApps.length === 0 && <p className="text-slate-500 text-center py-8">No applications sent yet.</p>}
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
        <p className="text-slate-500 mb-8">Here is what is happening today.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card className="p-6">
              <div className="text-slate-500 text-sm font-medium mb-1">{isClient ? 'Active Jobs' : 'Weekly Applications'}</div>
              <div className="text-3xl font-bold text-slate-900">
                {isClient ? jobs.filter(j => j.clientId === currentUser.id).length : `${currentUser.weeklyApplicationsUsed}/3`}
              </div>
              {!isClient && currentUser.plan === 'FREE' && <div className="text-xs text-orange-500 mt-2">Limit resets Sunday</div>}
              {!isClient && currentUser.plan !== 'FREE' && <div className="text-xs text-green-500 mt-2">Unlimited Plan</div>}
           </Card>
           <Card className="p-6">
              <div className="text-slate-500 text-sm font-medium mb-1">{isClient ? 'Total Applications' : 'Active Deals'}</div>
              <div className="text-3xl font-bold text-slate-900">
                {isClient 
                  ? jobs.filter(j => j.clientId === currentUser.id).reduce((acc, curr) => acc + curr.applicationCount, 0)
                  : deals.filter(d => d.freelancerId === currentUser.id).length
                }
              </div>
           </Card>
           <Card className="p-6">
              <div className="text-slate-500 text-sm font-medium mb-1">Unread Messages</div>
              <div className="text-3xl font-bold text-slate-900">0</div>
           </Card>
        </div>

        {isFreelancer ? (
          <div>
            <h2 className="text-lg font-bold mb-4">Recommended for you</h2>
            {/* Reuse Search subset */}
            <div className="space-y-4">
              {jobs.slice(0, 2).map(job => (
                 <Card key={job.id} className="p-4 border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer" onClick={() => { setSelectedJob(job); setCurrentView('JOB_DETAILS');}}>
                    <div className="flex justify-between">
                       <h3 className="font-semibold">{job.title}</h3>
                       <span className="text-slate-600 font-medium text-sm">{job.budgetValue}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                       <Badge>{job.category}</Badge>
                    </div>
                 </Card>
              ))}
            </div>
            <Button variant="outline" fullWidth className="mt-4" onClick={() => setCurrentView('SEARCH')}>Find more jobs</Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold">Your Latest Jobs</h2>
               <button className="text-blue-600 text-sm hover:underline" onClick={() => setCurrentView('MY_JOBS')}>View All</button>
            </div>
             <div className="space-y-4">
              {jobs.filter(j => j.clientId === currentUser.id).slice(0, 2).map(job => (
                 <Card key={job.id} className="p-4">
                    <div className="flex justify-between">
                       <h3 className="font-semibold">{job.title}</h3>
                       <Badge>{job.status}</Badge>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{job.applicationCount} candidates applied</div>
                 </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Main Layout Render ---
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
           <div className="font-bold text-lg text-slate-800">FreelanceBot</div>
           <button onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6 text-slate-600" /></button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {currentView === 'DASHBOARD' && <Dashboard />}
           {currentView === 'CREATE_JOB' && <CreateJobPage />}
           {currentView === 'MY_JOBS' && <MyJobsPage />}
           {currentView === 'SEARCH' && <FreelancerSearch />}
           {currentView === 'JOB_DETAILS' && <JobDetailsPage />}
           {currentView === 'APPLICATIONS' && <ApplicationsPage />}
           {currentView === 'SUBSCRIPTION' && <SubscriptionPage />}
           {currentView === 'CHAT' && <ChatPage />}
           {currentView === 'PROFILE' && (
             <div className="max-w-xl mx-auto text-center py-20">
               <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
               </div>
               <h2 className="text-2xl font-bold">{currentUser.name}</h2>
               <p className="text-slate-500 mb-6">{isClient ? currentUser.company : currentUser.role}</p>
               <Card className="text-left p-6">
                 <h3 className="font-bold mb-2">Bio</h3>
                 <p className="text-slate-600 mb-4">{currentUser.bio}</p>
                 <Button variant="outline" fullWidth>Edit Profile</Button>
               </Card>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
