import { Coffee, MapPin, Clock, Phone } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="page">
      <img
        className="banner"
        src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80"
        alt="Coffee Shop"
      />

      <h2>欢迎来到 Cozy Coffee</h2>
      <Coffee size={32} color="#6f4e37" />
      <p>
        Cozy Coffee 是一家坐落于银河中部星域的独立咖啡馆，位于莫里克 III 星环太空城 L 区 3 层 14 号——一个交通繁忙的恒星环城枢纽。
      </p>
      <p>
        我们为来自人类联邦、海星共和国、奥比斯客户协同社等多个文明的旅客、航行员、外交官与远行商人提供片刻宁静与香气四溢的咖啡。这里没有战略会议、也没有星舰调度，只有交谈、轻音乐与来自各个星球的口音。
      </p>
      <p>
        店内每一杯咖啡，都以恒星命名，每一道甜点，都记录着一次跳跃的终点。
      </p>

      <div className="info-section">
        <h3 className='info-head'>门店信息</h3>
        <div className="info-row">
          <div className="info-item">
            <MapPin size={18} />
            <span>莫里克 III · 星环太空城 L 区 3 层 14 号</span>
          </div>
          <div className="info-item">
            <Clock size={18} />
            <span>当地地系统时每日 08:00 - 22:00</span>
          </div>
          <div className="info-item">
            <Phone size={18} />
            <span>联邦通讯频道编号：#1601-L0314-404-COFFEE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
