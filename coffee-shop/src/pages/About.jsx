import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <img
        className="about-banner"
        src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&q=80"
        alt="Coffee Interior"
      />

      <h2>关于 Cozy Coffee</h2>
      <p>
        Cozy Coffee 是一家位于莫里克 III 星环太空城的独立咖啡馆，地处 L 区 3 层 14 号，正对生态环道与文化交流节点。
      </p>
      <p>
        本店服务对象涵盖各类种族旅客、驻外外交人员、星际工程师与自由商团成员。我们的目标很简单——在复杂的星际跳跃与边境博弈之外，为你提供一杯稳定、热腾腾的好咖啡。
      </p>
      <p>
        店内饮品菜单定期轮换，部分甜点来自海星共和国蓝潮文化贸易渠道。每位顾客都可以找到适合自己的角落：窗边软椅、开放式吧台，或是低语的后座。
      </p>
      <p>
        你可以把这里当成补给点，也可以把这里当成终点——我们始终在原地，为你留一席温暖。
      </p>
    </div>
  );
}
