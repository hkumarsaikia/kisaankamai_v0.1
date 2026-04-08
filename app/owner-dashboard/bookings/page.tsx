import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function OwnerDashboardBookings() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

{/*  SideNavBar (Shared Component)  */}
<aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full h-screen w-64 border-r border-surface-container-highest bg-white dark:bg-slate-950 z-40">
<div className="px-6 py-8">
<span className="text-xl font-bold text-primary">Kisan Kamai</span>
</div>
<div className="px-4 mb-6">
<div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-highest">
<div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container">
<img className="w-full h-full object-cover" data-alt="portrait of a confident Indian farmer smiling wearing a traditional white kurta" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCExv3QOuibAX6OClfz_t075pUbPpJfzqx6sb25CiutKAmBrXyTH1QWiiPw-IW4p5WgJr3Dmm5g5mCx6isTHJzUsHMEW_vpFKttBYWOMjfGTCUxD3GX0E0jCk4LmKjk3uwBC42kquNUrTDYImmkeAjgiHZmhUCvsyaUAo-6qFhAGCwvj9j9M0yI2mPGM7qxvaED16FYQe-i4v3ins77rZpK6wLZFqza2K80SQHrw_rUlDaG0pHpssIDt2u1KfQiEk0X4VVCY3_OBKOq"/>
</div>
<div className="flex flex-col">
<span className="text-sm font-bold text-primary leading-tight">Kisan Owner</span>
<span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">Verified Partner</span>
</div>
</div>
</div>

<div className="p-4 space-y-2 border-t border-surface-container-highest">
<button className="w-full flex items-center justify-center gap-2 bg-primary-container text-white py-3 px-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                Add New Listing
            </button>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" href="#">
<span className="material-symbols-outlined" data-icon="support_agent">support_agent</span>
<span className="font-manrope text-sm font-medium">Support</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="font-manrope text-sm font-medium">Sign Out</span>
</a>
</div>
</aside>
{/*  Main Content Canvas  */}
<main className="main-content-offset min-h-screen pb-12">
{/*  Top Sticky Header for Mobile/Context  */}

<div className="max-w-6xl mx-auto px-6 pt-8">
{/*  Header Section  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
<div>
<div className="flex items-center gap-2 text-on-surface-variant mb-1">
<span className="text-xs font-bold tracking-widest uppercase">Owner Portal</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span className="text-xs font-bold tracking-widest uppercase text-secondary">मराठी पोर्टल</span>
</div>
<h1 className="text-3xl font-extrabold text-primary tracking-tight">Booking Management</h1>
<p className="text-on-surface-variant mt-1">Manage your incoming requests and schedule.</p>
</div>
<div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-surface-container-highest">
<button className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg transition-all">Active</button>
<button className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-all">Upcoming</button>
<button className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-all">History</button>
</div>
</div>
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
{/*  Left: New Requests Column (Bento Cards)  */}
<div className="xl:col-span-2 space-y-6">
<div className="flex items-center justify-between">
<h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            New Requests <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-xs">3</span>
</h2>
<a className="text-sm font-bold text-secondary hover:underline" href="#">मराठीत पहा</a>
</div>
{/*  Request Card 1  */}
<div className="bg-white rounded-2xl p-5 border border-surface-container-highest shadow-sm hover:shadow-md transition-all group">
<div className="flex flex-col md:flex-row gap-6">
<div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="high-end John Deere tractor parked in a golden wheat field during sunrise with premium lens flare" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfu_AMK_TC8qMMVZ5e68Vj614f7M-Jvj39tLDf3BQJkq-OR0wlOV6NnKY023rSowbHNfyUR20P5q9Emgjo4e57yk4c-aACXJdZTlCLD205lUsSDSeqCy9E2TCpIP7z4Fvt3iHDiYNgRCVDnJB3NDcwl79hAdszGgm4yLyy0f7U7N9J_tB4bXx2XkjVYlAWGd5o9b53aF9pauVHDAIeeds_aa7VckpSTmbvjgEmlh9kYALpZ4nflwGb2cyeq4_Ih7RTZDPwgd3CIiRh"/>
</div>
<div className="flex-1 flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<h3 className="text-base font-bold text-primary">Mahindra Yuvo 575 DI</h3>
<div className="flex items-center gap-2 mt-1">
<div className="w-6 h-6 rounded-full overflow-hidden bg-surface-container-highest">
<img className="w-full h-full object-cover" data-alt="Close up portrait of a young Indian man in a smart casual polo shirt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx5bzL6bDQVA0JxAp7j3KMGj422zWVggwjN1uLMEN6YpdhDTjMjWHLXb_0V3dVd0WMlENhvLzIn426BpV8FXdPS88eGjjWb2YK4IpWBgH4aXhxV3uwZNLfBgajOd9yQhswUz1ZVqFEhjLJG_FKW9E9sLeR697KlUCScCYRDLMDl-t9mf5xwsJQudvzRFyYPPSv5jPOhU5v_omPSVzIiCTDoNc4oXdWzTRporMg1YH3LoPQoWVSEz4abYKQ3jGGBPZYgL9aOVZnMFfe"/>
</div>
<span className="text-sm font-semibold text-on-surface">Rajesh Deshmukh <span className="text-on-surface-variant font-normal">from Satara</span></span>
</div>
</div>
<div className="text-right">
<span className="block text-lg font-extrabold text-primary">₹3,200</span>
<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Estimated Total</span>
</div>
</div>
<div className="mt-4 flex flex-wrap items-center gap-4 py-3 border-y border-surface-container-highest">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-lg" data-icon="calendar_month">calendar_month</span>
<span className="text-xs font-bold">24 Oct - 26 Oct</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-lg" data-icon="history">history</span>
<span className="text-xs font-bold">3 Days</span>
</div>
<div className="flex items-center gap-2 ml-auto">
<span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded uppercase">Urgent</span>
</div>
</div>
<div className="mt-4 flex flex-wrap gap-3">
<button className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">Approve Request</button>
<button className="px-6 py-2.5 border border-surface-container-highest text-on-surface py-2 rounded-lg text-sm font-bold hover:bg-surface-container transition-colors">Decline</button>
<button className="w-10 h-10 flex items-center justify-center border border-surface-container-highest text-primary rounded-lg hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined" data-icon="chat">chat</span>
</button>
</div>
</div>
</div>
</div>
{/*  Request Card 2 (Bento Variant)  */}
<div className="bg-white rounded-2xl p-5 border border-surface-container-highest shadow-sm hover:shadow-md transition-all group">
<div className="flex flex-col md:flex-row gap-6">
<div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Heavy duty combine harvester operating in a lush green paddy field, cinematic low angle shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXeWgkAV1x1OgBpa0auyHmBacTvv1IBdSuN6HHZuMz0giFUEgslR8DNPtxyaEFW_qQfI-SY6jGv3V3EMDAQxI5mZ10393zRusmkv2bKJ0Eath72hCyYwYPCNfDHP8rV_I0LBL3I8go1bhHdl5ramzkl-_47sR06qnJvglu5XQAz32-c5aMpqHKCutM2wE6jkFcfqQOO-oqQE7EbYADTp3cVHtBZTe3hEvuMKsI-i5SRaRyWrydi81W7U1m7BGa2bUrV19hlxUPJC1m"/>
</div>
<div className="flex-1 flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<h3 className="text-base font-bold text-primary">Swaraj 744 FE</h3>
<div className="flex items-center gap-2 mt-1">
<div className="w-6 h-6 rounded-full overflow-hidden bg-surface-container-highest">
<img className="w-full h-full object-cover" data-alt="Indian woman farmer in a vibrant yellow saree standing in a field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSq5F2cYUuHYvBmXAsvxfDZXj8e5KUW5MdWMRmUV_E7aVgcECHdB37efSooZU37aQMHE2uMlH5_qq8EXFprA_jz2AT0Bf8jhSMJYsvk5HDimpaD86TMoEyYlEhntgcyEt7YDAPS6Hbs2dKAGkjqWW5m5pgRzagnZ9MCEO2waJgg-VGJuzN5M3W_FDECvdn_c_mYGqSUvGZQpTe7vNh6Wq12hUw7sh2AryJuq-dWeNygpmLu3nl_7gSomHl4vsY_kHpoeLx5TgwK3fu"/>
</div>
<span className="text-sm font-semibold text-on-surface">Anjali Patil <span className="text-on-surface-variant font-normal">from Karad</span></span>
</div>
</div>
<div className="text-right">
<span className="block text-lg font-extrabold text-primary">₹1,850</span>
<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Estimated Total</span>
</div>
</div>
<div className="mt-4 flex flex-wrap items-center gap-4 py-3 border-y border-surface-container-highest">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-lg" data-icon="calendar_month">calendar_month</span>
<span className="text-xs font-bold">28 Oct - 29 Oct</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-lg" data-icon="history">history</span>
<span className="text-xs font-bold">2 Days</span>
</div>
</div>
<div className="mt-4 flex flex-wrap gap-3">
<button className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">Approve Request</button>
<button className="px-6 py-2.5 border border-surface-container-highest text-on-surface py-2 rounded-lg text-sm font-bold hover:bg-surface-container transition-colors">Decline</button>
<button className="w-10 h-10 flex items-center justify-center border border-surface-container-highest text-primary rounded-lg hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined" data-icon="chat">chat</span>
</button>
</div>
</div>
</div>
</div>
</div>
{/*  Right Column: Calendar & Stats  */}
<div className="space-y-8">
{/*  Calendar View Section  */}
<div className="bg-white rounded-2xl p-6 border border-surface-container-highest shadow-sm">
<div className="flex items-center justify-between mb-6">
<h2 className="text-base font-bold text-primary">Schedule</h2>
<div className="flex gap-1">
<button className="p-1 rounded hover:bg-surface-container"><span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span></button>
<button className="p-1 rounded hover:bg-surface-container"><span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span></button>
</div>
</div>
<div className="grid grid-cols-7 gap-1 text-center mb-4">
<span className="text-[10px] font-black text-on-surface-variant uppercase">M</span>
<span className="text-[10px] font-black text-on-surface-variant uppercase">T</span>
<span className="text-[10px] font-black text-on-surface-variant uppercase">W</span>
<span className="text-[10px] font-black text-on-surface-variant uppercase">T</span>
<span className="text-[10px] font-black text-on-surface-variant uppercase">F</span>
<span className="text-[10px] font-black text-on-surface-variant uppercase">S</span>
<span className="text-[10px] font-black text-on-surface-variant uppercase">S</span>
</div>
<div className="grid grid-cols-7 gap-2">
{/*  Simple Calendar Days Mockup  */}
<div className="h-8 flex items-center justify-center text-xs text-on-surface-variant opacity-40">20</div>
<div className="h-8 flex items-center justify-center text-xs text-on-surface-variant opacity-40">21</div>
<div className="h-8 flex items-center justify-center text-xs font-bold text-on-surface">22</div>
<div className="h-8 flex items-center justify-center text-xs font-bold text-on-surface">23</div>
<div className="h-8 flex items-center justify-center text-xs font-bold bg-primary text-white rounded-lg shadow-sm">24</div>
<div className="h-8 flex items-center justify-center text-xs font-bold bg-primary-fixed text-primary rounded-lg">25</div>
<div className="h-8 flex items-center justify-center text-xs font-bold bg-primary-fixed text-primary rounded-lg">26</div>
<div className="h-8 flex items-center justify-center text-xs font-bold text-on-surface">27</div>
<div className="h-8 flex items-center justify-center text-xs font-bold bg-secondary-container text-on-secondary-container rounded-lg">28</div>
<div className="h-8 flex items-center justify-center text-xs font-bold bg-secondary-container text-on-secondary-container rounded-lg">29</div>
<div className="h-8 flex items-center justify-center text-xs font-bold text-on-surface">30</div>
<div className="h-8 flex items-center justify-center text-xs font-bold text-on-surface">31</div>
<div className="h-8 flex items-center justify-center text-xs text-on-surface-variant opacity-40">1</div>
<div className="h-8 flex items-center justify-center text-xs text-on-surface-variant opacity-40">2</div>
</div>
<div className="mt-6 pt-4 border-t border-surface-container-highest space-y-3">
<div className="flex items-center gap-3">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-xs font-semibold">Deshmukh - Tractor (Today)</span>
</div>
<div className="flex items-center gap-3">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
<span className="text-xs font-semibold">Anjali - Swaraj (Upcoming)</span>
</div>
</div>
</div>
{/*  Earnings Summary  */}
<div className="bg-primary-container rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
<div className="relative z-10">
<span className="text-[10px] font-black uppercase tracking-widest text-on-primary-container">Estimated Earnings</span>
<div className="text-3xl font-extrabold mt-1">₹42,850</div>
<div className="mt-4 flex items-center gap-2 text-xs font-medium text-on-primary-container">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
                                12% higher than last month
                            </div>
</div>
{/*  Abstract design element  */}
<div className="absolute -right-4 -bottom-4 opacity-10">
<span className="material-symbols-outlined text-[120px]" data-icon="payments">payments</span>
</div>
</div>
{/*  Quick Support Card  */}
<div className="bg-surface-container-low rounded-2xl p-6 border border-dashed border-outline-variant text-center">
<h3 className="text-sm font-bold text-primary mb-2">Need help managing equipment?</h3>
<p className="text-xs text-on-surface-variant mb-4 leading-relaxed">Our support team is available in Marathi &amp; English to help you list or manage bookings.</p>
<button className="w-full py-2 bg-white text-primary border border-surface-container-highest rounded-lg text-xs font-bold hover:bg-surface transition-colors">Contact Support</button>
</div>
</div>
</div>
{/*  Empty State Concept (Visible if no requests) - Hidden by default  */}
<div className="hidden mt-12 py-20 flex flex-col items-center text-center bg-white rounded-3xl border border-dashed border-outline-variant">
<div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-outline text-4xl" data-icon="inventory_2">inventory_2</span>
</div>
<h2 className="text-2xl font-bold text-primary">No new requests yet</h2>
<p className="text-on-surface-variant max-w-sm mt-2">Update your pricing or add professional photos to attract more farmers to your equipment.</p>
<div className="mt-8 flex gap-4">
<button className="bg-primary text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg">Add New Listing</button>
<button className="bg-white text-primary border border-surface-container-highest px-8 py-3 rounded-xl font-bold hover:bg-surface transition-all">Optimize Current</button>
</div>
</div>
{/*  Completed History Strip  */}
<div className="mt-16">
<div className="flex items-center justify-between mb-6">
<h2 className="text-lg font-bold text-primary">Recently Completed</h2>
<button className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">View All History</button>
</div>
<div className="overflow-x-auto pb-4 scrollbar-hide">
<div className="flex gap-4 min-w-max">
{/*  History Item 1  */}
<div className="w-80 bg-white p-4 rounded-xl border border-surface-container-highest flex gap-4 items-center">
<div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="close up of tractor wheel on dark soil with sunlight reflecting on the rim" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdqNOAoCPN8x0nsEZC8ySbNFRQhgNTr8XGeglYme_oheUE-k1yvgLhZtw5MZd2AnHdZBTUP9xgRxwNDjSjuqiAOcuSnP4MChkAFQSOkgcz-1_hGr-OJ2z1tDzf8sOQDTVJu296cAO1lslwFCoXrwyZpVsm9_gqgIrzYeHEFMt-F63fydM-fghS4V_bZ3tWF-zGPQyrV1SPq8Z5g7MRNMeFK1jcr99JJnCYiEAXJ-d_Egi_TGMI-UBGEi5auHaJpN3nUrA4eeHXZSJM"/>
</div>
<div className="flex-1">
<span className="block text-xs font-black text-on-surface-variant uppercase tracking-tighter">Completed 12 Oct</span>
<h4 className="text-sm font-bold text-primary">Rotavator Attachment</h4>
<span className="text-xs font-medium text-secondary">₹1,200 Earned</span>
</div>
<span className="material-symbols-outlined text-emerald-600" data-icon="check_circle" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
</div>
{/*  History Item 2  */}
<div className="w-80 bg-white p-4 rounded-xl border border-surface-container-highest flex gap-4 items-center">
<div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="modern farming seeder implement detail in high contrast morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD7UN56-Z2_tDkc9fBsx1kXCYvgZSc6DtKZ-iIbjFzKKvMiNQE2_kpTFOJZoJ-82Rl4k669AmPzsKzGuPiXxOak6Vuxv0dB_GJ43522eiid2WvxFDwZlPR5TT_2cyO_fpq84se2YAe019WzFiJbgxenW7R1UEyPbtFk2TWOiosq0Rq0ibIK90moqEjMBqjhwkvB7Y8xTgAb4VIiP9m5kV09cXfp4gu4is9YrmHaBy1aNtTQKG1UP5PVwJ_D_QZFRZuk63-qQbjJXKG"/>
</div>
<div className="flex-1">
<span className="block text-xs font-black text-on-surface-variant uppercase tracking-tighter">Completed 08 Oct</span>
<h4 className="text-sm font-bold text-primary">Seed Drill - 9 Row</h4>
<span className="text-xs font-medium text-secondary">₹2,450 Earned</span>
</div>
<span className="material-symbols-outlined text-emerald-600" data-icon="check_circle" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
</div>
{/*  History Item 3  */}
<div className="w-80 bg-white p-4 rounded-xl border border-surface-container-highest flex gap-4 items-center">
<div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="powerful tractor engine detailing with clean metallic surfaces" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo30tOlVIugzS_7jgt7kuk4aZ7kUqq9s-awHCixPh5aJzriB9MdVMO_H8faueekx3BhnItbI7F9XHhH4zuKIaF9ytFaC1HBrDuwcwkJP2zNE4TjwSfJfRxCdGrJNjdWHI_XIy3QlKbJpKYN1BQc8PuvrbXd0eqpnzPL69L64J3Fh6MgVgqVIgV2AAqhlsNTDGhoevjEujKOzHb_9ZtXhCy7m6BQisG1w5zXAaKltdC4njE3nE7IBh2gKFoGN2BcjSYpCJ5H4xkb3yw"/>
</div>
<div className="flex-1">
<span className="block text-xs font-black text-on-surface-variant uppercase tracking-tighter">Completed 02 Oct</span>
<h4 className="text-sm font-bold text-primary">John Deere 5310</h4>
<span className="text-xs font-medium text-secondary">₹3,800 Earned</span>
</div>
<span className="material-symbols-outlined text-emerald-600" data-icon="check_circle" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
</div>
</div>
</div>
</div>
</div>
{/*  Footer (Shared Component Lite)  */}

</main>
{/*  Mobile Navigation Bar (Shared Component)  */}


      </main>
      <Footer />
    </div>
  );
}
