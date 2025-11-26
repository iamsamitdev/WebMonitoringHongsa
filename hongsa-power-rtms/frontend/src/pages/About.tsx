import { CheckCircle2, Server, Database, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">เกี่ยวกับระบบ RTMS</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ระบบบริหารจัดการสถานะเครื่องจักรและพยากรณ์กำลังการผลิต สำหรับโรงไฟฟ้าหงสา (Hongsa Power)
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Mission Section */}
          <div className="p-8 md:p-12 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-1 h-8 bg-blue-600 rounded-full mr-4"></span>
              วัตถุประสงค์โครงการ
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                โครงการพัฒนาระบบ <strong>Real Time Machine Status & Forecasting</strong> นี้จัดทำขึ้นเพื่อแก้ปัญหาความล่าช้าและความผิดพลาดในการบันทึกข้อมูลแบบ Manual เดิม โดยมีเป้าหมายหลักคือ:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ListItem text="ลดระยะเวลาในการรวบรวมข้อมูลและทำรายงาน (Daily Report)" />
                <ListItem text="เพิ่มความแม่นยำในการพยากรณ์ (Forecast) ด้วยข้อมูลสถิติ" />
                <ListItem text="ติดตามสถานะเครื่องจักรได้แบบ Real-time ผ่าน Web Application" />
                <ListItem text="แจ้งเตือนทันทีเมื่อเกิดความคลาดเคลื่อนในการผลิตไฟฟ้า" />
              </ul>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="p-8 md:p-12 bg-slate-50/50">
             <h2 className="text-2xl font-bold text-slate-900 mb-6">เทคโนโลยีที่ใช้</h2>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <TechCard 
                  icon={Users} 
                  title="Frontend" 
                  desc="React 19 + Tailwind CSS เพื่อการใช้งานที่ลื่นไหลและรองรับทุกอุปกรณ์" 
                />
                <TechCard 
                  icon={Server} 
                  title="Backend" 
                  desc=".NET 10 Web API ที่มีความปลอดภัยและประสิทธิภาพสูง" 
                />
                <TechCard 
                  icon={Database} 
                  title="Database" 
                  desc="SQL Server 2022 สำหรับจัดการข้อมูลขนาดใหญ่และประวัติย้อนหลัง" 
                />
             </div>
          </div>

          {/* Contact Section */}
          <div className="p-8 md:p-12 bg-blue-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">ต้องการความช่วยเหลือ?</h2>
            <p className="text-blue-100 mb-6">
              หากพบปัญหาในการใช้งาน หรือต้องการสอบถามข้อมูลเพิ่มเติม สามารถติดต่อทีม IT Support
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
              ติดต่อ Support
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

interface ListItemProps {
  text: string;
}

const ListItem = ({ text }: ListItemProps) => (
  <li className="flex items-start">
    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

interface TechCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const TechCard = ({ icon: Icon, title, desc }: TechCardProps) => (
  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3 text-slate-700">
      <Icon size={20} />
    </div>
    <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600">{desc}</p>
  </div>
);
export default About