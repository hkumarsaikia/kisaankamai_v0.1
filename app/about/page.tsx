import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

{/*  TopNavBar  */}

<main className="pt-20">
{/*  Hero Section  */}
<section className="relative h-[716px] flex items-center overflow-hidden">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover grayscale-[20%] brightness-75" data-alt="cinematic wide shot of a vast green wheat field in rural India during golden hour with soft sunlight hitting the crop tops" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs9DHbhafEzMseEdaelDTnmWi_AM75UJnKhuZ5uEb_Oo5T9xCFGuDliIwNAJgJvI8UuxdufdLDuoSQ_aGXygRlmZ7mA0KOjnVaOiS5esGUG0iphZM40IBy1uYWIcpG53285n1bxRUh9KVCwYLg1--MB7iZhnZtzGwMSNE0j_U_oSx28sxIzgqEXF6zLoT14leFsC9fTebuxK5VcOltWj2igypR5pwP8a-4X5XzvGQ80if9YW4sgzoixIsAqhhk9k71OqJSe4BNJD6u"/>
<div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent"></div>
</div>
<div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
<div className="max-w-2xl">
<span className="inline-block py-1 px-3 bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase rounded mb-6">Rooted in Trust</span>
<h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">Empowering Indian Agriculture Through Shared Growth.</h1>
<p className="text-xl text-emerald-50/90 font-medium max-w-lg">We are bridging the gap between equipment owners and farmers to create a more efficient, prosperous, and sustainable farming ecosystem.</p>
</div>
</div>
</section>
{/*  Mission & Vision Bento  */}
<section className="py-24 px-6 bg-surface">
<div className="max-w-7xl mx-auto">
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
<div className="md:col-span-8 p-12 bg-primary-container rounded-3xl text-white flex flex-col justify-between min-h-[400px]">
<div>
<span className="material-symbols-outlined text-4xl text-on-primary-container mb-6">spa</span>
<h2 className="text-4xl font-bold mb-6">Our Mission</h2>
<p className="text-xl text-emerald-100/80 leading-relaxed max-w-2xl">To democratize access to advanced agricultural machinery for every farmer in India, ensuring that no crop goes unharvested due to a lack of equipment. We strive to make farming profitable and equipment ownership a viable business.</p>
</div>
<div className="mt-8 flex items-center gap-4">
<div className="h-[1px] flex-grow bg-emerald-800"></div>
<span className="text-on-primary-container font-headline font-bold uppercase tracking-widest text-xs">The Kisan Kamai Way</span>
</div>
</div>
<div className="md:col-span-4 p-8 bg-tertiary-container rounded-3xl text-white flex flex-col justify-center text-center">
<span className="material-symbols-outlined text-5xl text-on-tertiary-container mb-4">visibility</span>
<h2 className="text-3xl font-bold mb-4">Our Vision</h2>
<p className="text-lg text-amber-100/80">To become the backbone of rural agricultural logistics, fostering a community where technology and tradition work hand in hand.</p>
</div>
<div className="md:col-span-4 h-80 rounded-3xl overflow-hidden group">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="close up of a modern tractor wheel moving through rich dark brown soil in a field at sunrise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_pGYjPJ7B8vFifINeKfkwzeZx5es_azCql7EZnoTEvouyK-xVGXpBhuXv1r1Fa6loLatH8ImfF1x8A771EXN2m1fGN7FVtxLp27GRo58qSjq93zfszJgXcIOeupNCgPFraPV_MxThNaCDRj5fpdlYUvcafS0ae9izidP0eVxZDs8Bpmwntz5LlQkM3JwSLxnw4EcBEYROhWEmKU_hm2YFuE5bKkTSUTWHYX93L-nIUqeGyJb2pAwM5Rz0Hutps1e1ulvpcIS5nqxt"/>
</div>
<div className="md:col-span-8 p-12 bg-white rounded-3xl border border-emerald-100 flex flex-col justify-center relative overflow-hidden">
<div className="relative z-10">
<h3 className="text-2xl font-bold text-primary mb-4">The Origin Story</h3>
<p className="text-on-surface-variant leading-relaxed text-lg italic">"It started in a small village in Maharashtra, watching a neighbor struggle to find a harvester while three others sat idle just two kilometers away. We realized it wasn't a lack of resources, but a lack of connection."</p>
<p className="mt-6 font-bold text-secondary">— Founders' Note</p>
</div>
<div className="absolute -right-16 -bottom-16 opacity-5">
<span className="material-symbols-outlined text-[200px]" style={{'fontVariationSettings': '\'FILL\' 1'}}>agriculture</span>
</div>
</div>
</div>
</div>
</section>
{/*  Values Section  */}
<section className="py-24 bg-surface-container-low border-y border-emerald-50">
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-16">
<h2 className="text-4xl font-extrabold text-primary mb-4">Core Values</h2>
<div className="h-1 w-20 bg-secondary mx-auto"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
<span className="material-symbols-outlined text-4xl" style={{'fontVariationSettings': '\'FILL\' 1'}}>handshake</span>
</div>
<h3 className="text-xl font-bold text-primary mb-3">Trust</h3>
<p className="text-on-surface-variant">We build relationships rooted in transparency, reliability, and verified equipment quality for every transaction.</p>
</div>
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
<span className="material-symbols-outlined text-4xl" style={{'fontVariationSettings': '\'FILL\' 1'}}>lightbulb</span>
</div>
<h3 className="text-xl font-bold text-primary mb-3">Innovation</h3>
<p className="text-on-surface-variant">We bring cutting-edge logistics and mobile technology to the fields of India to solve age-old agricultural problems.</p>
</div>
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
<span className="material-symbols-outlined text-4xl" style={{'fontVariationSettings': '\'FILL\' 1'}}>groups</span>
</div>
<h3 className="text-xl font-bold text-primary mb-3">Community</h3>
<p className="text-on-surface-variant">We are more than a marketplace; we are a support network for farmers and owners growing together.</p>
</div>
</div>
</div>
</section>
{/*  Team Section  */}
<section className="py-24 px-6">
<div className="max-w-7xl mx-auto">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
<div className="max-w-xl">
<h2 className="text-4xl font-extrabold text-primary mb-4">Meet the People Behind the Platform</h2>
<p className="text-on-surface-variant text-lg">A diverse team of agronomists, technologists, and rural development experts dedicated to your success.</p>
</div>
<button className="flex items-center gap-2 text-secondary font-bold hover:gap-4 transition-all">
                        View Open Roles <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
{/*  Team Member 1  */}
<div className="group">
<div className="aspect-[4/5] bg-surface-container-high rounded-2xl overflow-hidden mb-6 relative">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="portrait of a professional indian man with a warm smile wearing a light linen shirt in an outdoor setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCe_c_b2e6P6Gt2rq03XlryiAkPp0ep6JPQaUKq2PuDdN5ahUHLhI4UPFVMi7C0Kfov35bXDpShSIOyA0bNDvnq11mTYPR81RNKRW8UXGvlzCI6WzzCwGHl157AqbAhH24EfQdsPP4Id-cY0wfNhhRw2V5-nTfdUjIdbqzY76tfeGeLeJx8cBHjQebC37vqdSMBehusOyPO7A7QEMJCc_IYu5QyTUPWyS3OJAPeg_xTQMzBzMh2mwh4XVbglSDwPcb4Wl8ZmhII9CG"/>
<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<h3 className="text-xl font-bold text-primary">Founder &amp; CEO</h3>
<p className="text-on-surface-variant">Agricultural Strategy</p>
</div>
{/*  Team Member 2  */}
<div className="group">
<div className="aspect-[4/5] bg-surface-container-high rounded-2xl overflow-hidden mb-6 relative">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="portrait of a confident indian woman in professional attire with soft natural lighting and a clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN3gGR-eLxkHosTLDXSgvQrpN1bi0XCDhS4CN4S9VVIEBKr-yh_lC8JyBSY-LjC_SddKg2K_fInsxbXLuHO623nm4RRk2QOx2phiBUCqOfdqrz7ikO2uIzSyOLDny_yRMAyCZGv4_yUDooCY3FljDjbclPTKTaTcWmrnlDmH_byUzckoBVia7uInsU4EvFuGwPAg4PqE_HO5VpJt94cFtkEb_p3MGPfqtI8wbIZLEGFp73FjccLlfdQxUqVYzyL4AVdGd4bfY89XvZ"/>
<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<h3 className="text-xl font-bold text-primary">Chief Technology Officer</h3>
<p className="text-on-surface-variant">Product &amp; Logistics</p>
</div>
{/*  Team Member 3  */}
<div className="group">
<div className="aspect-[4/5] bg-surface-container-high rounded-2xl overflow-hidden mb-6 relative">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="professional portrait of a man in his late 30s with short hair in a bright office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfwWcP3qIBrAYLMHeeOfLNS6Qw4-YE6cVivNcjGygqUle0LvPSXnuitxUfj-ktBATiHHmNvv8Tc-sNjX5V3f-t6RPuUZZhPVewutgvG8Xg-pfE-gH2zKgN0MyKBxhL8RXaiW07k-5rB-ggASUqPIl20b8mPpnNqpTHToJ_q5Yw0_E6l25dEk4eivjP3dEEZzivsFYONxdQlntfKtOT_2AwL5g84OfmG5yvqvh3aQY0STjyMsRu3Wr7i40UHa9dNpZSBud3wpBgvvSI"/>
<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<h3 className="text-xl font-bold text-primary">Head of Operations</h3>
<p className="text-on-surface-variant">Rural Network &amp; Support</p>
</div>
{/*  Team Member 4  */}
<div className="group">
<div className="aspect-[4/5] bg-surface-container-high rounded-2xl overflow-hidden mb-6 relative">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="portrait of a young indian woman with glasses smiling confidently in a modern studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs69P_i7hKz0kxKLA9x-khAnVs4cvsVtEdT0JD7lVtKrQKBG9895zhefQ2IierNATXm-G5DmDoOIyvC7X-xBZ9movIWI8-7cV2AKpUaFXUzpZK4CYTVEzh9DCdnMl7osiV8oH0bk24fmJ_zwocHAWB4upVYNq4hOLvrZzg-MKVMnnm4NMb0iap6ubmYUhHd4uGwl1nGw1ct3GDERoeaOTDf-nXKRHDJ4gRw-qunq-Wz8S_yvzdBseQsoYq4miL1QnAkjCxtyvnZriW"/>
<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<h3 className="text-xl font-bold text-primary">Lead Experience Designer</h3>
<p className="text-on-surface-variant">Farmer-Centric UX</p>
</div>
</div>
</div>
</section>
{/*  Realistic Impact Section  */}
<section className="py-24 bg-white">
<div className="max-w-7xl mx-auto px-6">
<div className="bg-primary p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-800/30 via-transparent to-transparent"></div>
<div className="relative z-10 w-full md:w-1/2">
<h2 className="text-4xl font-bold text-white mb-6">Our Impact in Numbers</h2>
<div className="grid grid-cols-2 gap-8">
<div>
<p className="text-primary-fixed text-4xl font-extrabold mb-1">50+</p>
<p className="text-emerald-100/60 font-medium">Districts Covered</p>
</div>
<div>
<p className="text-primary-fixed text-4xl font-extrabold mb-1">12k+</p>
<p className="text-emerald-100/60 font-medium">Verified Equipments</p>
</div>
<div>
<p className="text-primary-fixed text-4xl font-extrabold mb-1">85k+</p>
<p className="text-emerald-100/60 font-medium">Farmer Users</p>
</div>
<div>
<p className="text-primary-fixed text-4xl font-extrabold mb-1">20%</p>
<p className="text-emerald-100/60 font-medium">Avg. Cost Saving</p>
</div>
</div>
</div>
<div className="relative z-10 w-full md:w-1/2">
<div className="aspect-video bg-emerald-900 rounded-3xl overflow-hidden border border-emerald-800 shadow-2xl">
<img className="w-full h-full object-cover" data-alt="overhead view of multiple combines harvesting a golden grain field in perfect parallel lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyBQM-eH0GwDzEc_yQrn2OC06qlNa4Oa5cPndIZHuNTHzK9V_yYQ7VC__OJFFYHB8e4LEen5CU5CAmNjOTl4rDM3-OAgxhUcB03l18ER8jDetAisXx8NVAAj1IzIcsLmiPgeTUfAW5VRIdV5kVSlb_Z_kTzUlm13Onag2QrgO5BS_-6d7YS1aXMNCSZkfBTE25QPFt_W6uz9RZFjkkpllmTKShWCiqG-Phs_XnUveMmo-_6Np_DPKiFfhQ4DD5AzcbJYw093TDPu49"/>
</div>
</div>
</div>
</div>
</section>
</main>
{/*  Footer  */}


      </main>
      <Footer />
    </div>
  );
}
