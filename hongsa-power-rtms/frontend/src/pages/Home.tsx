import { Link } from 'react-router';
import { ArrowRight, Activity, BarChart3, Bell } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-900">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(37,99,235,0.4)_0%,rgba(0,0,0,0)_60%)] animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-6">
            <span className="flex h-2 w-2 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time Monitoring System v1.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            ยกระดับการจัดการพลังงาน <br className="hidden md:block" />
            ด้วยระบบ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Smart Forecasting</span>
          </h1>
          
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            ติดตามสถานะเครื่องจักรและวางแผนการผลิตไฟฟ้าของโรงไฟฟ้าหงสาได้อย่างแม่นยำ รวดเร็ว และมีประสิทธิภาพสูงสุด
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/auth/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              เข้าสู่ระบบ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-300 bg-transparent hover:bg-slate-800 md:text-lg transition-all"
            >
              เรียนรู้เพิ่มเติม
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">ฟีเจอร์หลักของระบบ</h2>
            <p className="mt-4 text-lg text-slate-600">ออกแบบมาเพื่อตอบโจทย์การทำงานของวิศวกรและผู้ดูแลระบบ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Activity}
              title="Real-time Monitoring"
              description="ติดตามค่า Load และสถานะการทำงานของเครื่องจักรได้ทันที ทุกที่ ทุกเวลา ข้อมูลอัปเดตระดับวินาที"
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Advance Forecasting"
              description="ระบบคำนวณและพยากรณ์กำลังการผลิตล่วงหน้าด้วยข้อมูลสถิติ ช่วยให้การวางแผนแม่นยำยิ่งขึ้น"
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <FeatureCard 
              icon={Bell}
              title="Smart Notifications"
              description="แจ้งเตือนทันทีเมื่อมีความผิดปกติ หรือค่า Actual แตกต่างจาก Forecast เกินเกณฑ์ที่กำหนด ผ่าน Line และ Email"
              color="text-amber-600"
              bg="bg-amber-50"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bg: string;
}

const FeatureCard = ({ icon: Icon, title, description, color, bg }: FeatureCardProps) => (
  <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-6`}>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);
export default Home