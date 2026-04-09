import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return [
    { equipmentId: '1' }, { equipmentId: '2' }, { equipmentId: '3' }, { equipmentId: '4' }, { equipmentId: '5' }
  ];
}

export default function BookingFlow() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

{/*  TopNavBar  */}

{/*  Main Content Canvas  */}
<main className="pt-28 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
{/*  Header Section  */}

{/*  Stepper Indicator  */}
<div className="relative flex justify-between items-center mb-16 max-w-3xl mx-auto">
<div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -z-10 -translate-y-1/2"></div>
{/*  Step 1 (Active)  */}
<div className="flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold ring-4 ring-primary-fixed">1</div>
<span className="text-xs font-bold text-primary uppercase tracking-wider">Details</span>
</div>
{/*  Step 2  */}
<div className="flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-surface-variant text-outline flex items-center justify-center font-bold">2</div>
<span className="text-xs font-medium text-outline uppercase tracking-wider">Location</span>
</div>
{/*  Step 3  */}
<div className="flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-surface-variant text-outline flex items-center justify-center font-bold">3</div>
<span className="text-xs font-medium text-outline uppercase tracking-wider">Review</span>
</div>
{/*  Step 4  */}
<div className="flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-surface-variant text-outline flex items-center justify-center font-bold">4</div>
<span className="text-xs font-medium text-outline uppercase tracking-wider">Status</span>
</div>
</div>
{/*  Form Container  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
{/*  Step Content: Left Column  */}
<div className="lg:col-span-7 space-y-8">
<div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-surface-variant">
<h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">event_available</span>
                        Date &amp; Task Details
                    </h2>
<form className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-sm font-semibold text-on-surface-variant block">Start Date</label>
<div className="relative">
<input className="w-full bg-surface-container-lowest border-surface-variant rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-secondary-container transition-all" type="date"/>
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-semibold text-on-surface-variant block">Duration (Days)</label>
<select className="w-full bg-surface-container-lowest border-surface-variant rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-secondary-container transition-all">
<option>1 Day</option>
<option>2-3 Days</option>
<option>1 Week</option>
<option>Custom</option>
</select>
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-semibold text-on-surface-variant block">Select Farming Task</label>
<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
<button className="flex flex-col items-center justify-center p-4 border-2 border-secondary-container bg-secondary-fixed/20 rounded-2xl text-secondary transition-all" type="button">
<span className="material-symbols-outlined mb-2" style={{'fontVariationSettings': '\'FILL\' 1'}}>agriculture</span>
<span className="text-xs font-bold">Ploughing</span>
</button>
<button className="flex flex-col items-center justify-center p-4 border-2 border-transparent bg-surface-container-low rounded-2xl text-on-surface hover:border-surface-variant transition-all" type="button">
<span className="material-symbols-outlined mb-2">grain</span>
<span className="text-xs font-bold">Sowing</span>
</button>
<button className="flex flex-col items-center justify-center p-4 border-2 border-transparent bg-surface-container-low rounded-2xl text-on-surface hover:border-surface-variant transition-all" type="button">
<span className="material-symbols-outlined mb-2">water_drop</span>
<span className="text-xs font-bold">Spraying</span>
</button>
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-semibold text-on-surface-variant block">Field Size (Acres)</label>
<div className="flex items-center gap-4">
<input className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary" max="50" min="1" type="range"/>
<span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full font-bold min-w-[60px] text-center">5</span>
</div>
</div>
<div className="pt-6">
<button className="w-full bg-primary-container text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="button">
                                Save &amp; Continue
                                <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</form>
</div>
{/*  Trust Signal  */}
<div className="bg-primary-fixed/30 rounded-2xl p-6 flex items-start gap-4 border border-primary-fixed">
<span className="material-symbols-outlined text-primary-container" style={{'fontVariationSettings': '\'FILL\' 1'}}>verified_user</span>
<div>
<h4 className="font-bold text-primary-container">Kisan Kamai Guarantee</h4>
<p className="text-sm text-on-primary-fixed-variant leading-relaxed">Your payment is only processed after the owner confirms availability. We ensure equipment reaches your field on time.</p>
</div>
</div>
</div>
{/*  Summary Sidebar: Right Column  */}
<div className="lg:col-span-5">
<div className="sticky top-28 space-y-6">
{/*  Equipment Card Preview  */}
<div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-surface-variant">
<div className="h-48 relative">
<img className="w-full h-full object-cover" data-alt="Modern red Mahindra tractor parked in a lush green Indian field during golden hour with mountains in background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnFJi0w34H16W-3vWg7CoKeBwmAqAqLAW-u1X0_JuEsrP68JXfkctxn2FSg6-2JXcqEZ8Rk2oXcqyY7HDgnHYL9zReL2O6ezhoKNCURyRpmZEFuPhAJNrRPP-iJ9vAXZ3Ml7czlpzrzjwYYu8uczAnE8SjfupprNjmaad1cEPDW6mI4T2G605wCqEsHdY2mWH1FDJElkFzMyLrmW_5_vN7wuK_FUr_IunV_aEOiA_eeiHhPwmyLdbWICS3t5_-49ehIJFDpeASTF12"/>
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span>
                                4.9 (120+ Bookings)
                            </div>
</div>
<div className="p-6">
<h3 className="text-xl font-bold text-primary mb-1">Mahindra Novo 605 DI-i</h3>
<p className="text-sm text-on-surface-variant mb-4">65 HP • Heavy Duty • 2023 Model</p>
<div className="flex justify-between items-end border-t border-surface-variant pt-4">
<div>
<p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Base Rate</p>
<p className="text-2xl font-black text-secondary">₹1,200 <span className="text-sm font-normal text-on-surface-variant">/ hour</span></p>
</div>
<div className="text-right">
<p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Owner</p>
<p className="font-bold text-primary">Suresh Patil, Sangli</p>
</div>
</div>
</div>
</div>
{/*  Help Card  */}
<div className="bg-emerald-950 text-white rounded-[32px] p-8 space-y-4">
<h4 className="text-lg font-bold">Need Assistance?</h4>
<p className="text-emerald-200/70 text-sm leading-relaxed">Our support team is available in Marathi &amp; English to help you complete your booking.</p>
<div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
<span className="material-symbols-outlined text-orange-400">support_agent</span>
<div>
<p className="text-xs font-bold uppercase text-emerald-300">Call Support</p>
<p className="font-bold">+91 1800-456-7890</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
{/*  Success Modal (Hidden by Default, Mockup for Step 4)  */}
<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm hidden">
<div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-orange-500"></div>
<div className="w-24 h-24 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-8">
<span className="material-symbols-outlined text-primary-container text-5xl" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
</div>
<h2 className="text-3xl font-black text-primary mb-4 tracking-tight">Request Submitted!</h2>
<p className="text-on-surface-variant mb-8 leading-relaxed">We've sent your request to <strong>Suresh Patil</strong>. You will receive an SMS and notification once they approve the booking.</p>
<div className="space-y-4">
<button className="w-full bg-primary-container text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all">Track My Booking</button>
<button className="w-full bg-surface-container text-primary py-4 rounded-2xl font-bold hover:bg-surface-variant transition-all">Back to Home</button>
</div>
</div>
</div>
{/*  Footer  */}

{/*  BottomNavBar (Mobile Only)  */}


      </main>
      <Footer />
    </div>
  );
}
